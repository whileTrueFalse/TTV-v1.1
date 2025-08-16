# 🚀 Deployment Guide

This guide will walk you through deploying your AI Video Generator app to various cloud platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Stability AI API Key**: Get one from [platform.stability.ai](https://platform.stability.ai/)
2. **GitHub Repository**: Your code should be in a public GitHub repository
3. **Cloud Platform Account**: Choose from the options below

## 🌟 Recommended: Render (Free Tier Available)

Render offers a generous free tier and is the easiest platform to deploy to.

### Step 1: Prepare Your Repository

1. Fork or clone this repository to your GitHub account
2. Ensure your repository is public
3. Verify all files are committed and pushed

### Step 2: Deploy on Render

1. **Sign Up**: Go to [render.com](https://render.com) and create an account
2. **Connect GitHub**: Click "New +" → "Web Service" → "Connect your GitHub repo"
3. **Select Repository**: Choose your AI video generator repository
4. **Configure Service**:
   - **Name**: `ai-video-generator` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Set Environment Variables**:
   - Click "Environment" tab
   - Add `STABILITY_API_KEY` with your actual API key
6. **Deploy**: Click "Create Web Service"

### Step 3: Access Your App

- Render will provide a URL like: `https://your-app-name.onrender.com`
- Your app will be live and accessible worldwide!

## 🚂 Railway Deployment

Railway is another excellent option with automatic deployments.

### Step 1: Deploy on Railway

1. **Sign Up**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your AI video generator repository
4. **Add Environment Variable**:
   - Go to "Variables" tab
   - Add `STABILITY_API_KEY` with your API key
5. **Deploy**: Railway will automatically build and deploy your app

### Step 2: Access Your App

- Railway provides a URL like: `https://your-app-name.railway.app`
- Your app is now live!

## 🦸 Heroku Deployment

Heroku is a classic choice with good free tier options.

### Step 1: Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variable
heroku config:set STABILITY_API_KEY=your_actual_api_key

# Add git remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### Step 3: Access Your App

- Your app will be available at: `https://your-app-name.herokuapp.com`

## 🐳 Docker Deployment (Any Platform)

Use Docker to deploy to any cloud platform that supports containers.

### Step 1: Build Docker Image

```bash
# Build the image
docker build -t ai-video-generator .

# Test locally
docker run -p 8000:8000 --env-file .env ai-video-generator
```

### Step 2: Deploy to Container Services

#### AWS ECS/Fargate
```bash
# Tag for AWS ECR
docker tag ai-video-generator:latest your-account.dkr.ecr.region.amazonaws.com/ai-video-generator:latest

# Push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker push your-account.dkr.ecr.region.amazonaws.com/ai-video-generator:latest
```

#### Google Cloud Run
```bash
# Tag for Google Container Registry
docker tag ai-video-generator:latest gcr.io/your-project/ai-video-generator:latest

# Push to GCR
docker push gcr.io/your-project/ai-video-generator:latest

# Deploy to Cloud Run
gcloud run deploy ai-video-generator \
  --image gcr.io/your-project/ai-video-generator:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars STABILITY_API_KEY=your_api_key
```

#### Azure Container Instances
```bash
# Tag for Azure Container Registry
docker tag ai-video-generator:latest your-registry.azurecr.io/ai-video-generator:latest

# Push to ACR
docker push your-registry.azurecr.io/ai-video-generator:latest

# Deploy to ACI
az container create \
  --resource-group your-rg \
  --name ai-video-generator \
  --image your-registry.azurecr.io/ai-video-generator:latest \
  --dns-name-label your-app-name \
  --ports 8000 \
  --environment-variables STABILITY_API_KEY=your_api_key
```

## 🔧 Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STABILITY_API_KEY` | Your Stability AI API key | `sk-abc123...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STABILITY_CFG_SCALE` | Video creativity (1-20) | `7.5` |
| `STABILITY_HEIGHT` | Video height (pixels) | `576` |
| `STABILITY_WIDTH` | Video width (pixels) | `1024` |
| `STABILITY_STEPS` | Generation steps | `25` |

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-url.com/health
```

### 2. Main Page
```bash
curl https://your-app-url.com/
```

### 3. Video Generation (requires API key)
```bash
curl -X POST "https://your-app-url.com/generate-video" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "prompt=test video"
```

## 🚨 Common Issues & Solutions

### Issue: App won't start
**Solution**: Check your start command matches exactly:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Issue: API key not working
**Solution**: 
1. Verify the environment variable is set correctly
2. Check that your API key is valid
3. Ensure the variable name is exactly `STABILITY_API_KEY`

### Issue: Build fails
**Solution**: 
1. Check that `requirements.txt` is in your repository
2. Verify Python version compatibility
3. Check build logs for specific error messages

### Issue: App times out
**Solution**: 
1. Video generation can take 1-3 minutes
2. Consider implementing a queue system for production
3. Add proper timeout handling in your frontend

## 📊 Performance Optimization

### For Production Deployments

1. **Add Caching**: Implement Redis for video caching
2. **Queue System**: Use Celery for background video generation
3. **CDN**: Serve videos through a CDN for better performance
4. **Monitoring**: Add logging and monitoring (e.g., Sentry, LogRocket)
5. **Rate Limiting**: Implement API rate limiting to prevent abuse

### Environment-Specific Optimizations

#### Render
- Use the paid tier for better performance
- Enable auto-scaling if available

#### Railway
- Monitor resource usage
- Use the appropriate plan for your needs

#### Heroku
- Consider using worker dynos for video generation
- Use add-ons for caching and monitoring

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to your repository
2. **Environment Variables**: Use platform-specific secret management
3. **CORS**: Configure CORS properly for production
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: Validate all user inputs

## 📞 Getting Help

- **Render**: [docs.render.com](https://docs.render.com)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Heroku**: [devcenter.heroku.com](https://devcenter.heroku.com)
- **Docker**: [docs.docker.com](https://docs.docker.com)

## 🎉 Congratulations!

Once deployed, your AI Video Generator will be accessible worldwide! Share your app URL and let users create amazing AI-generated videos.

---

**Need help?** Open an issue on GitHub or check the platform-specific documentation above.
