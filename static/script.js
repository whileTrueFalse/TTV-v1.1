// DOM elements
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const statusSection = document.getElementById('status-section');
const resultSection = document.getElementById('result-section');
const errorSection = document.getElementById('error-section');
const loadingSpinner = document.getElementById('loading-spinner');
const statusMessage = document.getElementById('status-message');
const progressFill = document.getElementById('progress-fill');
const generatedVideo = document.getElementById('generated-video');
const videoSource = document.getElementById('video-source');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const newVideoBtn = document.getElementById('new-video-btn');
const retryBtn = document.getElementById('retry-btn');
const errorMessage = document.getElementById('error-message');

// State management
let currentVideoUrl = '';
let isGenerating = false;

// Event listeners
generateBtn.addEventListener('click', handleGenerateVideo);
downloadBtn.addEventListener('click', handleDownload);
shareBtn.addEventListener('click', handleShare);
newVideoBtn.addEventListener('click', resetToInput);
retryBtn.addEventListener('click', resetToInput);

// Handle video generation
async function handleGenerateVideo() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Please enter a description for your video.');
        return;
    }
    
    if (isGenerating) return;
    
    isGenerating = true;
    showStatus('Preparing your video generation...');
    
    try {
        // Simulate progress updates
        simulateProgress();
        
        // Make API call to generate video
        const response = await fetch('/generate-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `prompt=${encodeURIComponent(prompt)}`
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate video');
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentVideoUrl = result.video_url;
            showResult(result.video_url);
        } else {
            throw new Error(result.message || 'Video generation failed');
        }
        
    } catch (error) {
        console.error('Error generating video:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        isGenerating = false;
        hideStatus();
    }
}

// Show status section with loading
function showStatus(message) {
    statusMessage.textContent = message;
    statusSection.style.display = 'block';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    generateBtn.disabled = true;
}

// Hide status section
function hideStatus() {
    statusSection.style.display = 'none';
    generateBtn.disabled = false;
}

// Show result section with generated video
function showResult(videoUrl) {
    videoSource.src = videoUrl;
    generatedVideo.load();
    resultSection.style.display = 'block';
    errorSection.style.display = 'none';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Show error section
function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    resultSection.style.display = 'none';
    hideStatus();
    
    // Scroll to error
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset to input section
function resetToInput() {
    errorSection.style.display = 'none';
    resultSection.style.display = 'none';
    statusSection.style.display = 'none';
    generateBtn.disabled = false;
    promptInput.focus();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Simulate progress bar animation
function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressFill.style.width = `${progress}%`;
    }, 500);
}

// Handle video download
function handleDownload() {
    if (!currentVideoUrl) return;
    
    const link = document.createElement('a');
    link.href = currentVideoUrl;
    link.download = `ai-generated-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle video sharing
async function handleShare() {
    if (!currentVideoUrl) return;
    
    const shareData = {
        title: 'AI Generated Video',
        text: 'Check out this amazing AI-generated video!',
        url: window.location.origin + currentVideoUrl
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: copy URL to clipboard
            await navigator.clipboard.writeText(shareData.url);
            showToast('Video URL copied to clipboard!');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy URL to clipboard
        try {
            await navigator.clipboard.writeText(shareData.url);
            showToast('Video URL copied to clipboard!');
        } catch (clipboardError) {
            showToast('Failed to copy URL. Please copy manually.');
        }
    }
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add some interactive features
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleGenerateVideo();
    }
});

// Add character count
promptInput.addEventListener('input', () => {
    const maxLength = 500;
    const currentLength = promptInput.value.length;
    
    if (currentLength > maxLength) {
        promptInput.value = promptInput.value.substring(0, maxLength);
    }
});

// Add placeholder rotation for better UX
const placeholders = [
    "e.g., A majestic dragon flying over a medieval castle at sunset, cinematic lighting, epic atmosphere...",
    "e.g., A futuristic cityscape with flying cars and neon lights, cyberpunk aesthetic...",
    "e.g., A serene forest with gentle sunlight filtering through trees, peaceful nature scene...",
    "e.g., A space station orbiting Earth, astronauts floating in zero gravity...",
    "e.g., A magical library with floating books and mystical energy, fantasy setting..."
];

let placeholderIndex = 0;
setInterval(() => {
    promptInput.placeholder = placeholders[placeholderIndex];
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
}, 4000);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Focus on input
    promptInput.focus();
    
    // Add some visual feedback
    generateBtn.addEventListener('mouseenter', () => {
        if (!isGenerating) {
            generateBtn.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });
    
    generateBtn.addEventListener('mouseleave', () => {
        if (!isGenerating) {
            generateBtn.style.transform = 'translateY(0) scale(1)';
        }
    });
});
