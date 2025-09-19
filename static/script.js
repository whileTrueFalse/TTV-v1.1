// Kid-Friendly Magic Video Creator JavaScript

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
const charCount = document.getElementById('charCount');
const tipsToggle = document.getElementById('tipsToggle');
const tipsContent = document.getElementById('tipsContent');
const ideaBtns = document.querySelectorAll('.idea-btn');

// State management
let currentVideoUrl = '';
let isGenerating = false;
let currentTipIndex = 0;
let tipsInterval;

// Event listeners
generateBtn.addEventListener('click', handleGenerateVideo);
downloadBtn.addEventListener('click', handleDownload);
shareBtn.addEventListener('click', handleShare);
newVideoBtn.addEventListener('click', resetToInput);
retryBtn.addEventListener('click', resetToInput);
tipsToggle.addEventListener('click', toggleTips);
ideaBtns.forEach(btn => btn.addEventListener('click', handleIdeaClick));

// Character count and validation
promptInput.addEventListener('input', updateCharacterCount);
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleGenerateVideo();
    }
});

// Handle video generation
async function handleGenerateVideo() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Please tell me what you want to see in your video! 🎨');
        return;
    }
    
    if (prompt.length < 10) {
        showError('Try describing more details! The more you tell me, the better your video will be! ✨');
        return;
    }
    
    if (isGenerating) return;
    
    isGenerating = true;
    showStatus('Creating your magical video...');
    
    // Add fun animations
    generateBtn.classList.add('bounce-animation');
    
    try {
        // Simulate progress updates with kid-friendly messages
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
            showToast('🎉 Your amazing video is ready!');
        } else {
            throw new Error(result.message || 'Video generation failed');
        }
        
    } catch (error) {
        console.error('Error generating video:', error);
        showError('Oops! Something went wrong. Don\'t worry, let\'s try again! 😊');
    } finally {
        isGenerating = false;
        hideStatus();
        generateBtn.classList.remove('bounce-animation');
    }
}

// Update character count
function updateCharacterCount() {
    const count = promptInput.value.length;
    charCount.textContent = count;
    
    if (count > 180) {
        charCount.style.color = '#FF6B9D';
    } else if (count > 150) {
        charCount.style.color = '#FF8A65';
    } else {
        charCount.style.color = '#4ECDC4';
    }
}

// Handle quick idea buttons
function handleIdeaClick(e) {
    const prompt = e.target.getAttribute('data-prompt');
    promptInput.value = prompt;
    updateCharacterCount();
    
    // Add fun animation
    e.target.classList.add('wiggle-animation');
    setTimeout(() => {
        e.target.classList.remove('wiggle-animation');
    }, 500);
    
    // Focus on generate button
    generateBtn.focus();
}

// Toggle tips section
function toggleTips() {
    tipsContent.classList.toggle('open');
    tipsToggle.textContent = tipsContent.classList.contains('open') ? '💡' : '💡';
}

// Show status section with loading
function showStatus(message) {
    statusMessage.textContent = message;
    statusSection.style.display = 'block';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    generateBtn.disabled = true;
    
    // Update button text
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
}

// Hide status section
function hideStatus() {
    statusSection.style.display = 'none';
    generateBtn.disabled = false;
    
    // Reset button text
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
}

// Show result section with generated video
function showResult(videoUrl) {
    videoSource.src = videoUrl;
    generatedVideo.load();
    resultSection.style.display = 'block';
    errorSection.style.display = 'none';
    
    // Add celebration animation
    resultSection.classList.add('bounce-animation');
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Show error section
function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    resultSection.style.display = 'none';
    hideStatus();
    
    // Add wiggle animation
    errorSection.classList.add('wiggle-animation');
    
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
    
    // Clear animations
    resultSection.classList.remove('bounce-animation');
    errorSection.classList.remove('wiggle-animation');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Simulate progress bar animation with kid-friendly messages
function simulateProgress() {
    const messages = [
        'Thinking of amazing ideas...',
        'Drawing your characters...',
        'Adding magical colors...',
        'Making everything move...',
        'Adding sparkles and magic...',
        'Almost ready...',
        'Your video is almost done!'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        
        progressFill.style.width = `${progress}%`;
        
        // Update message every 15% progress
        if (progress > messageIndex * 15 && messageIndex < messages.length - 1) {
            messageIndex++;
            statusMessage.textContent = messages[messageIndex];
        }
    }, 800);
}

// Handle video download
function handleDownload() {
    if (!currentVideoUrl) return;
    
    const link = document.createElement('a');
    link.href = currentVideoUrl;
    link.download = `my-magical-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('📥 Your video is being saved!');
}

// Handle video sharing
async function handleShare() {
    if (!currentVideoUrl) return;
    
    const shareData = {
        title: 'My Amazing AI Video!',
        text: 'Look at this cool video I made with AI! 🎬✨',
        url: window.location.origin + currentVideoUrl
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast('🔗 Sharing your awesome video!');
        } else {
            // Fallback: copy URL to clipboard
            await navigator.clipboard.writeText(shareData.url);
            showToast('🔗 Video link copied! Share it with your friends!');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy URL to clipboard
        try {
            await navigator.clipboard.writeText(shareData.url);
            showToast('🔗 Video link copied! Share it with your friends!');
        } catch (clipboardError) {
            showToast('😅 Couldn\'t copy the link. Try again!');
        }
    }
}

// Show toast notification with kid-friendly styling
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, #FF6B9D, #4ECDC4);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-family: 'Comic Neue', cursive;
        font-size: 16px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Rotate tips automatically
function startTipsRotation() {
    const tips = document.querySelectorAll('.tip');
    
    tipsInterval = setInterval(() => {
        tips[currentTipIndex].classList.remove('active');
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tips[currentTipIndex].classList.add('active');
    }, 5000);
}

// Stop tips rotation
function stopTipsRotation() {
    if (tipsInterval) {
        clearInterval(tipsInterval);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Focus on input
    promptInput.focus();
    
    // Start tips rotation
    startTipsRotation();
    
    // Add some visual feedback
    generateBtn.addEventListener('mouseenter', () => {
        if (!isGenerating) {
            generateBtn.style.transform = 'translateY(-5px) scale(1.02)';
        }
    });
    
    generateBtn.addEventListener('mouseleave', () => {
        if (!isGenerating) {
            generateBtn.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Add click sound effects (optional)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Add a subtle animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
    
    // Add floating emoji animation
    createFloatingEmojis();
});

// Create floating emojis for extra fun
function createFloatingEmojis() {
    const emojis = ['✨', '🌟', '🎨', '🎬', '🌈', '🦄', '🤖', '🐉', '🐱'];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            const floatingEmoji = document.createElement('div');
            floatingEmoji.textContent = emoji;
            floatingEmoji.style.cssText = `
                position: fixed;
                top: 100%;
                left: ${Math.random() * 100}%;
                font-size: 24px;
                pointer-events: none;
                z-index: 100;
                animation: floatUp 3s ease-out forwards;
            `;
            
            document.body.appendChild(floatingEmoji);
            
            setTimeout(() => {
                if (document.body.contains(floatingEmoji)) {
                    document.body.removeChild(floatingEmoji);
                }
            }, 3000);
        }
    }, 2000);
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);