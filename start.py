#!/usr/bin/env python3
"""
Simple startup script for the AI Video Generator app
"""

import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import httpx
        import aiofiles
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists and has API key"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  No .env file found")
        print("Please copy env.example to .env and add your Replicate API key")
        return False
    
    # Check if API key is set
    with open(env_file, 'r') as f:
        content = f.read()
        if "REPLICATE_API_KEY=your_replicate_api_key_here" in content:
            print("⚠️  Please set your actual Replicate API key in .env file")
            return False
    
    print("✅ Environment file configured")
    return True

def create_uploads_dir():
    """Create uploads directory if it doesn't exist"""
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    print("✅ Uploads directory ready")

def start_app():
    """Start the FastAPI application"""
    print("🚀 Starting AI Video Generator...")
    print("📱 App will be available at: http://127.0.0.1:8000")
    print("🔑 Make sure you have set your Replicate API key in .env")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("🎬 AI Video Generator - Startup Check")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment
    if not check_env_file():
        print("\n💡 To continue without API key (for testing UI only):")
        print("   Just press Enter. The app will start but video generation won't work.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Create necessary directories
    create_uploads_dir()
    
    print("\n🎉 All checks passed! Starting the app...")
    start_app()

if __name__ == "__main__":
    main()
