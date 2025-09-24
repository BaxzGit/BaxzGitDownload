// API Key untuk TikTok Downloader (ganti dengan API key Anda)
const API_KEY = "https://api.sxtream.xyz/downloader/tiktok";

// DOM Elements
const tiktokUrlInput = document.getElementById('tiktok-url');
const downloadBtn = document.getElementById('download-btn');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result');
const ratingStars = document.querySelectorAll('.rating-stars i');
const ratingText = document.getElementById('rating-text');
const averageRating = document.getElementById('average-rating');
const totalRatings = document.getElementById('total-ratings');
const commentName = document.getElementById('comment-name');
const commentText = document.getElementById('comment-text');
const submitComment = document.getElementById('submit-comment');
const commentsList = document.getElementById('comments-list');
const notificationSound = document.getElementById('notification-sound');

// Data storage (in a real app, this would be on a server)
let ratings = JSON.parse(localStorage.getItem('tiktokDownloaderRatings')) || [];
let comments = JSON.parse(localStorage.getItem('tiktokDownloaderComments')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateRatingDisplay();
    displayComments();
    
    // Add event listeners
    downloadBtn.addEventListener('click', processDownload);
    tiktokUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') processDownload();
    });
    
    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', rateWebsite);
        star.addEventListener('mouseover', hoverStar);
        star.addEventListener('mouseout', resetStars);
    });
    
    // Comments
    submitComment.addEventListener('click', addComment);
});

// Process TikTok download
function processDownload() {
    const url = tiktokUrlInput.value.trim();
    
    if (!url) {
        showNotification('Masukkan URL video TikTok!', 'error');
        return;
    }
    
    // Validate TikTok URL
    if (!isValidTikTokUrl(url)) {
        showNotification('URL TikTok tidak valid!', 'error');
        return;
    }
    
    // Show loading
    loading.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // In a real implementation, you would call the TikTok download API here
        // For demonstration, we'll simulate a successful response
        const videoData = {
            title: 'Video TikTok Demo',
            thumbnail: 'https://placehold.co/400x600/ff0050/white?text=TikTok+Video',
            downloadUrl: '#',
            downloadUrlNoWatermark: '#'
        };
        
        displayResult(videoData);
        loading.style.display = 'none';
        
        // Play notification sound
        playNotificationSound();
        
        // Show success message
        showNotification('Video berhasil diunduh!', 'success');
    }, 2000);
}

// Validate TikTok URL
function isValidTikTokUrl(url) {
    const tiktokRegex = /https?:\/\/(www\.)?tiktok\.com\/@.+\/video\/\d+/;
    return tiktokRegex.test(url);
}

// Display download result
function displayResult(videoData) {
    resultSection.innerHTML = `
        <div class="video-preview">
            <img src="${videoData.thumbnail}" alt="${videoData.title}">
            <h3>${videoData.title}</h3>
        </div>
        <div class="download-options">
            <button class="btn-download" onclick="downloadVideo('${videoData.downloadUrl}')">
                <i class="fas fa-download"></i> Download dengan Watermark
            </button>
            <button class="btn-without-watermark" onclick="downloadVideo('${videoData.downloadUrlNoWatermark}')">
                <i class="fas fa-download"></i> Download Tanpa Watermark
            </button>
        </div>
    `;
    
    resultSection.style.display = 'block';
}

// Download video function
function downloadVideo(url) {
    // In a real implementation, this would trigger the download
    // For demonstration, we'll show an alert
    showNotification('Download dimulai!', 'success');
    
    // Simulate download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiktok_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Rating functionality
function rateWebsite(e) {
    const rating = parseInt(e.target.getAttribute('data-rating'));
    
    // Save rating to localStorage
    ratings.push(rating);
    localStorage.setItem('tiktokDownloaderRatings', JSON.stringify(ratings));
    
    // Update display
    updateRatingDisplay();
    
    // Show thank you message
    showNotification('Terima kasih atas rating Anda!', 'success');
    
    // Play notification sound
    playNotificationSound();
}

function hoverStar(e) {
    const hoverRating = parseInt(e.target.getAttribute('data-rating'));
    resetStars();
    
    ratingStars.forEach(star => {
        if (parseInt(star.getAttribute('data-rating')) <= hoverRating) {
            star.classList.add('active');
        }
    });
}

function resetStars() {
    ratingStars.forEach(star => {
        star.classList.remove('active');
    });
}

function updateRatingDisplay() {
    if (ratings.length > 0) {
        const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        averageRating.textContent = avg;
        totalRatings.textContent = ratings.length;
        
        // Update stars to show average
        resetStars();
        ratingStars.forEach(star => {
            if (parseInt(star.getAttribute('data-rating')) <= Math.round(avg)) {
                star.classList.add('active');
            }
        });
        
        ratingText.textContent = `Terima kasih! Anda memberi rating ${avg} bintang`;
    } else {
        averageRating.textContent = '0';
        totalRatings.textContent = '0';
        ratingText.textContent = 'Klik bintang untuk memberi rating';
    }
}

// Comments functionality
function addComment() {
    const name = commentName.value.trim();
    const text = commentText.value.trim();
    
    if (!name || !text) {
        showNotification('Harap isi nama dan komentar!', 'error');
        return;
    }
    
    // Create new comment
    const newComment = {
        id: Date.now(),
        name: name,
        text: text,
        date: new Date().toLocaleDateString('id-ID')
    };
    
    // Save to localStorage
    comments.unshift(newComment);
    localStorage.setItem('tiktokDownloaderComments', JSON.stringify(comments));
    
    // Update display
    displayComments();
    
    // Clear form
    commentName.value = '';
    commentText.value = '';
    
    // Show success message
    showNotification('Komentar berhasil ditambahkan!', 'success');
    
    // Play notification sound
    playNotificationSound();
}

function displayComments() {
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-name">${comment.name}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

// Notification system
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else {
        notification.style.backgroundColor = '#f44336';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Play notification sound
function playNotificationSound() {
    notificationSound.currentTime = 0;
    notificationSound.play().catch(e => {
        console.log("Autoplay prevented by browser");
    });
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);