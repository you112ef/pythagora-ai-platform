const redis = require('redis');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

let redisClient;

const initializeRedis = async () => {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisURL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.warn('Redis server connection refused - continuing without Redis');
          return undefined; // Stop retrying
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.warn('Redis retry time exhausted - continuing without Redis');
          return undefined;
        }
        if (options.attempt > 3) {
          logger.warn('Redis max retry attempts reached - continuing without Redis');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.warn('Redis client error:', err.message);
    });

    redisClient.on('end', () => {
      logger.warn('Redis client connection ended');
    });

    await redisClient.connect();
    
  } catch (error) {
    logger.warn('Redis connection failed - continuing without Redis:', error.message);
    redisClient = null; // Set to null so we can check if Redis is available
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    logger.warn('Redis client not available - returning mock client');
    return {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      exists: async () => 0,
      expire: async () => 1,
      connect: async () => {},
      disconnect: async () => {}
    };
  }
  return redisClient;
};

module.exports = { initializeRedis, getRedisClient };