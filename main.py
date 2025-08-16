from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import json
import uuid
from pathlib import Path
from dotenv import load_dotenv
import aiofiles
import asyncio
from typing import Optional
import replicate

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Video Generator", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for storing generated videos
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Replicate API configuration (Free tier: 500 predictions/month)
REPLICATE_API_KEY = os.getenv("REPLICATE_API_KEY")

# Set the API token for the replicate library - Fix for deployment
if REPLICATE_API_KEY:
    # Set both environment variables to ensure compatibility
    os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_KEY
    os.environ["REPLICATE_API_KEY"] = REPLICATE_API_KEY
    
    # Also set it directly in the replicate client
    import replicate
    replicate.Client(api_token=REPLICATE_API_KEY)
    
    print(f"Replicate API Key loaded: {REPLICATE_API_KEY[:10]}...{REPLICATE_API_KEY[-4:]}")
    print("✅ API token configured for Replicate library")
else:
    print("No Replicate API key found in environment variables")
    print("💡 Get a free API key at: https://replicate.com/account/api-tokens")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    async with aiofiles.open("static/index.html", "r") as f:
        content = await f.read()
    return HTMLResponse(content=content)

@app.post("/generate-video")
async def generate_video(prompt: str = Form(...)):
    """
    Generate a video based on the provided text prompt using Replicate
    """
    print(f"Received video generation request with prompt: {prompt}")
    
    if not REPLICATE_API_KEY:
        print("No Replicate API key configured")
        raise HTTPException(status_code=500, detail="Replicate API key not configured. Get one at https://replicate.com/account/api-tokens")
    
    if not prompt or len(prompt.strip()) == 0:
        print("Empty prompt received")
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    print(f"Replicate API Key configured: {REPLICATE_API_KEY[:10]}...{REPLICATE_API_KEY[-4:]}")
    
    try:
        # Start prediction with Replicate using the seedance-1-pro model
        print(f"Starting video generation with Replicate (seedance-1-pro)...")
        
        # Use the seedance-1-pro model as specified
        model = "bytedance/seedance-1-pro"
        
        # Prepare input parameters
        input_data = {
            "prompt": prompt
        }
        
        print(f"Using model: {model}")
        print(f"Input prompt: {prompt}")
        
        # Run the prediction using the replicate library
        # Note: This is a blocking call, so we'll run it in a thread pool
        loop = asyncio.get_event_loop()
        
        def run_replicate():
            try:
                # Ensure we have the API token for this call
                if REPLICATE_API_KEY:
                    # Create a new client with explicit API token
                    client = replicate.Client(api_token=REPLICATE_API_KEY)
                    output = client.run(model, input=input_data)
                else:
                    # Fallback to default method
                    output = replicate.run(model, input=input_data)
                return output
            except Exception as e:
                print(f"Replicate API error: {e}")
                raise e
        
        # Run the replicate call in a thread pool to avoid blocking
        output = await loop.run_in_executor(None, run_replicate)
        
        if not output:
            raise HTTPException(status_code=500, detail="No output received from Replicate")
        
        print(f"Video generated successfully!")
        
        # Get the video URL from the output
        if hasattr(output, 'url'):
            video_url = output.url()
        elif isinstance(output, list) and len(output) > 0:
            video_url = output[0]
        else:
            video_url = str(output)
        
        print(f"Video URL: {video_url}")
        
        # Download the video content
        async with httpx.AsyncClient(timeout=60.0) as client:
            video_response = await client.get(video_url)
            
            if video_response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to download generated video")
            
            # Save video to file
            video_filename = f"video_{uuid.uuid4()}.mp4"
            video_path = UPLOAD_DIR / video_filename
            
            async with aiofiles.open(video_path, "wb") as f:
                await f.write(video_response.content)
            
            print(f"Video saved successfully: {video_filename}")
            
            return {
                "success": True,
                "video_url": f"/video/{video_filename}",
                "message": "Video generated successfully using seedance-1-pro!"
            }
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout - video generation is taking longer than expected")
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Error generating video: {str(e)}")
        print(f"Traceback: {error_traceback}")
        raise HTTPException(status_code=500, detail=f"Error generating video: {str(e)}")

@app.get("/video/{filename}")
async def get_video(filename: str):
    """Serve generated video files"""
    video_path = UPLOAD_DIR / filename
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(video_path, media_type="video/mp4")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "api_key_configured": bool(REPLICATE_API_KEY)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
