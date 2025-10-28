const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // In demo mode, allow requests without token for certain routes
  if (!token) {
    // Allow public routes
    const publicRoutes = ['/api/health', '/api/auth/login', '/api/auth/register'];
    if (publicRoutes.includes(req.path)) {
      return next();
    }
    
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is blacklisted (for logout functionality)
    try {
      const redisClient = getRedisClient();
      const isBlacklisted = await redisClient.get(`blacklist_${token}`);
      
      if (isBlacklisted) {
        return res.status(401).json({ 
          error: 'Token invalid',
          message: 'This token has been revoked'
        });
      }
    } catch (redisError) {
      // If Redis is not available, continue without blacklist check
      console.warn('Redis not available for token blacklist check:', redisError.message);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    return res.status(403).json({ 
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
};

module.exports = {
  authenticateToken,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};