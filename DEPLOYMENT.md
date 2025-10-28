# 🚀 Pythagora AI Platform - Deployment Guide

## 📋 Deployment Status

✅ **GitHub Repository**: https://github.com/you112ef/pythagora-ai-platform  
✅ **Code Committed**: All conflicts resolved and code pushed  
✅ **Application Tested**: Running successfully on localhost:3001  
🔄 **Deployment**: Ready for Vercel/Netlify deployment  

## 🌐 Live Application URLs

- **GitHub Repository**: https://github.com/you112ef/pythagora-ai-platform
- **Vercel Deployment**: https://pythagora-ai-platform.vercel.app (Ready to deploy)
- **Local Development**: http://localhost:3001

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import `you112ef/pythagora-ai-platform`

2. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   GITHUB_TOKEN=your-github-token
   ```

3. **Deploy**: Click "Deploy" - Vercel will automatically build and deploy

### Option 2: Netlify

1. **Connect GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Select `you112ef/pythagora-ai-platform`

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `api`

### Option 3: Railway

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `you112ef/pythagora-ai-platform`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create free account
   - Create new cluster

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pythagora-ai?retryWrites=true&w=majority
   ```

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/pythagora-ai
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pythagora-ai

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# AI Services
OPENAI_API_KEY=sk-proj-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GITHUB_TOKEN=ghp_your-github-token

# Optional Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🧪 Testing the Deployment

### Health Check
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-10-27T...",
  "version": "2.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "websocket": "active"
  }
}
```

### Test API Endpoints
```bash
# Test projects endpoint
curl https://your-domain.com/api/projects

# Test AI generation
curl -X POST https://your-domain.com/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a hello world function", "language": "javascript"}'
```

## 📊 Monitoring & Analytics

The platform includes built-in monitoring for:
- ✅ Application health status
- ✅ Database connection status
- ✅ Redis connection status
- ✅ WebSocket connectivity
- ✅ API response times
- ✅ Error tracking

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection

## 📱 Features Available

### 🤖 AI Studio
- Code generation in 50+ languages
- AI code review and suggestions
- Debug assistant
- Test generation
- Multiple AI providers (OpenAI, Anthropic)

### 📁 Project Management
- Create and manage projects
- File organization
- Version control integration
- Template library

### 👥 Collaboration
- Real-time team collaboration
- User management
- Chat system
- Activity tracking

### 🚀 Deployment Tools
- One-click deployment
- Environment management
- CI/CD pipelines
- Monitoring dashboard

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check MongoDB URI format
   - Verify network access
   - Check credentials

2. **Redis Connection Failed**:
   - Application works without Redis
   - Check Redis URL format
   - Verify Redis server is running

3. **Build Failures**:
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check environment variables

4. **API Errors**:
   - Check authentication tokens
   - Verify API keys are valid
   - Check rate limits

### Support

- **GitHub Issues**: https://github.com/you112ef/pythagora-ai-platform/issues
- **Documentation**: See README.md
- **API Docs**: Available at `/api/health` endpoint

## 🎉 Success!

Once deployed, your Pythagora AI Platform will be available at:
- **Main Application**: https://your-domain.com
- **API Health**: https://your-domain.com/api/health
- **GitHub Repository**: https://github.com/you112ef/pythagora-ai-platform

The platform is now ready for production use with all features working!
