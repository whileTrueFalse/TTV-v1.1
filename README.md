# TTV-version 1.1 🎬✨

A modern, AI-powered web application that generates stunning videos from text descriptions using Stability AI's cutting-edge video generation technology.

## 🌟 Features

- **AI-Powered Video Generation**: Create 5-10 second videos from text prompts
- **Modern Web Interface**: Beautiful, responsive design with smooth animations
- **Real-time Progress Tracking**: Visual feedback during video generation
- **Video Management**: Download, share, and manage generated videos
- **Cloud-Ready**: Easy deployment to any cloud platform
- **Secure**: Environment-based API key management

## 🚀 Live Demo

[Deploy your own instance](#deployment) or visit the live demo : https://ttv-v1-1.onrender.com

## 🛠️ Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Service**: Replicate API (Seedance-1-Pro)
- **Deployment**: Docker, Render, Heroku, Railway ready
- **Styling**: Modern CSS with gradients and animations

## 📋 Prerequisites

- Python 3.11+
- Replicate API key ([Get one here](https://replicate.com/account/api-tokens)) - Free tier: 500 predictions/month
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-video-generator.git
cd ai-video-generator
```

### 2. Set Up Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your API key
# REPLICATE_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python main.py
```

The app will be available at `http://localhost:8000`

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t ai-video-generator .
docker run -p 8000:8000 --env-file .env ai-video-generator
```

## ☁️ Cloud Deployment

### Option 1: Render (Recommended)

1. Fork this repository to your GitHub account
2. Sign up at [render.com](https://render.com)
3. Connect your GitHub repository
4. Create a new Web Service
5. Set environment variable `REPLICATE_API_KEY`
6. Deploy!

**Render Configuration:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment: Python 3.11

### Option 2: Railway

1. Fork this repository
2. Sign up at [railway.app](https://railway.app)
3. Connect your GitHub repository
4. Add environment variable `REPLICATE_API_KEY`
5. Deploy automatically!

### Option 3: Heroku

1. Install Heroku CLI
2. Create a new Heroku app
3. Set environment variables:
   ```bash
   heroku config:set REPLICATE_API_KEY=your_api_key
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Option 4: AWS/GCP/Azure

Use the provided `Dockerfile` to deploy to any container service:

```bash
# Build image
docker build -t ai-video-generator .

# Push to your container registry
docker tag ai-video-generator your-registry/ai-video-generator
docker push your-registry/ai-video-generator
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REPLICATE_API_KEY` | Your Replicate API key | Yes | - |
| *Additional parameters can be added if the model supports them* | | | |

### Customizing Video Generation

Edit the parameters in `main.py`:

```python
# The seedance-1-pro model only requires a prompt
input_data = {
    "prompt": prompt
}

# You can add more parameters if the model supports them
# input_data = {
#     "prompt": prompt,
#     "additional_param": value
# }
```

## 📱 Usage

1. **Enter a Prompt**: Describe the video you want to generate
2. **Generate**: Click the "Generate Video" button
3. **Wait**: The AI will create your video (usually 1-3 minutes)
4. **Download/Share**: Save your video or share it with others

### Prompt Tips

- Be descriptive and specific
- Include visual details, lighting, atmosphere
- Mention style preferences (cinematic, artistic, realistic)
- Examples:
  - "A majestic dragon flying over a medieval castle at sunset, cinematic lighting, epic atmosphere"
  - "A futuristic cityscape with flying cars and neon lights, cyberpunk aesthetic"
  - "A serene forest with gentle sunlight filtering through trees, peaceful nature scene"

## 🔒 Security

- API keys are stored in environment variables (never committed to Git)
- CORS is configured for web security
- Input validation and sanitization
- Rate limiting considerations for production

## 🧪 Testing

```bash
# Run the application
python main.py

# Test the health endpoint
curl http://localhost:8000/health

# Test video generation (requires API key)
curl -X POST "http://localhost:8000/generate-video" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "prompt=test video"
```

## 📁 Project Structure

```
ai-video-generator/
├── main.py                 # FastAPI backend
├── requirements.txt        # Python dependencies
├── static/                 # Frontend assets
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript logic
├── uploads/               # Generated videos (auto-created)
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── render.yaml            # Render deployment config
├── Procfile               # Heroku deployment
├── runtime.txt            # Python version specification
├── .gitignore            # Git ignore rules
├── env.example           # Environment template
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Replicate](https://replicate.com/) for providing the video generation API
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Font Awesome](https://fontawesome.com/) for the beautiful icons

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-video-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-video-generator/discussions)
- **Email**: samarthganorar@gmail.com

## 🔮 Future Enhancements

- [ ] User authentication and video history
- [ ] Multiple AI model support
- [ ] Video editing capabilities
- [ ] Batch video generation
- [ ] Advanced prompt templates
- [ ] Video style transfer
- [ ] Mobile app version

---

**Made by Samarth Ganorkar aka WhileTrueFalse**

*Star this repository if you found it helpful!*
