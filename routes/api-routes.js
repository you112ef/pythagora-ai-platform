const express = require('express');
const router = express.Router();

// API Documentation endpoint
router.get('/docs', (req, res) => {
  const apiDocs = {
    name: 'Pythagora AI Platform API',
    version: '2.0.0',
    description: 'Advanced AI-powered development platform API',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    endpoints: {
      auth: {
        'POST /auth/login': {
          description: 'User login',
          body: { email: 'string', password: 'string' },
          response: { user: 'object', token: 'string' }
        },
        'POST /auth/register': {
          description: 'User registration',
          body: { email: 'string', password: 'string', firstName: 'string', lastName: 'string' },
          response: { user: 'object', token: 'string' }
        },
        'GET /auth/me': {
          description: 'Get current user',
          headers: { Authorization: 'Bearer <token>' },
          response: { user: 'object' }
        },
        'POST /auth/logout': {
          description: 'User logout',
          headers: { Authorization: 'Bearer <token>' },
          response: { message: 'string' }
        }
      },
      projects: {
        'GET /projects': {
          description: 'Get all projects',
          headers: { Authorization: 'Bearer <token>' },
          query: { page: 'number', limit: 'number', status: 'string', type: 'string' },
          response: { projects: 'array', pagination: 'object' }
        },
        'POST /projects': {
          description: 'Create new project',
          headers: { Authorization: 'Bearer <token>' },
          body: { name: 'string', description: 'string', type: 'string', framework: 'string' },
          response: { project: 'object' }
        },
        'GET /projects/:id': {
          description: 'Get project by ID',
          headers: { Authorization: 'Bearer <token>' },
          response: { project: 'object' }
        },
        'PUT /projects/:id': {
          description: 'Update project',
          headers: { Authorization: 'Bearer <token>' },
          body: { name: 'string', description: 'string', status: 'string' },
          response: { project: 'object' }
        },
        'DELETE /projects/:id': {
          description: 'Delete project',
          headers: { Authorization: 'Bearer <token>' },
          response: { message: 'string' }
        }
      },
      ai: {
        'POST /ai/generate-code': {
          description: 'Generate code using AI',
          headers: { Authorization: 'Bearer <token>' },
          body: { prompt: 'string', language: 'string', framework: 'string', model: 'string' },
          response: { generatedCode: 'string', model: 'string', tokensUsed: 'number' }
        },
        'POST /ai/review-code': {
          description: 'Review code using AI',
          headers: { Authorization: 'Bearer <token>' },
          body: { code: 'string', language: 'string' },
          response: { review: 'object', tokensUsed: 'number' }
        },
        'POST /ai/debug-code': {
          description: 'Debug code using AI',
          headers: { Authorization: 'Bearer <token>' },
          body: { code: 'string', error: 'string', language: 'string' },
          response: { debugAnalysis: 'object', tokensUsed: 'number' }
        },
        'POST /ai/generate-tests': {
          description: 'Generate tests using AI',
          headers: { Authorization: 'Bearer <token>' },
          body: { code: 'string', testFramework: 'string', language: 'string' },
          response: { generatedTests: 'object', tokensUsed: 'number' }
        }
      },
      aiProviders: {
        'GET /ai-providers': {
          description: 'Get all AI providers',
          headers: { Authorization: 'Bearer <token>' },
          response: { providers: 'array' }
        },
        'POST /ai-providers': {
          description: 'Add new AI provider',
          headers: { Authorization: 'Bearer <token>' },
          body: { name: 'string', displayName: 'string', apiKey: 'string', baseUrl: 'string' },
          response: { provider: 'object' }
        },
        'GET /ai-providers/models/all': {
          description: 'Get all available models',
          headers: { Authorization: 'Bearer <token>' },
          response: { models: 'array', modelsByCategory: 'object' }
        }
      },
      deployment: {
        'POST /deployment/:projectId/deploy': {
          description: 'Deploy project',
          headers: { Authorization: 'Bearer <token>' },
          body: { provider: 'string', environment: 'string', config: 'object' },
          response: { deploymentId: 'string', status: 'string' }
        },
        'GET /deployment/:projectId/status': {
          description: 'Get deployment status',
          headers: { Authorization: 'Bearer <token>' },
          response: { status: 'string', url: 'string', logs: 'array' }
        }
      }
    },
    authentication: {
      type: 'Bearer Token',
      description: 'Include Authorization header with Bearer token for protected routes'
    },
    rateLimiting: {
      description: '100 requests per 15 minutes per IP',
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '99',
        'X-RateLimit-Reset': 'timestamp'
      }
    }
  };

  res.json({
    success: true,
    data: apiDocs
  });
});

// Health check with more detailed information
router.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    services: {
      database: 'connected',
      redis: 'connected',
      websocket: 'active'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };

  res.json({
    success: true,
    data: health
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      api: 'Pythagora AI Platform API',
      version: '2.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      features: [
        'AI Code Generation',
        'Code Review & Debugging',
        'Project Management',
        'Real-time Collaboration',
        'Deployment Automation',
        'Multi-Provider AI Support'
      ]
    }
  });
});

module.exports = router;