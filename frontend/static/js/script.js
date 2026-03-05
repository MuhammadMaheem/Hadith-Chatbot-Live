/**
 * Hadith Chatbot - Interactive JavaScript
 * Handles user interactions, API calls, and dynamic content
 */

// API Configuration - Update this when deploying
// For local development: 'http://localhost:5000'
// For Render deployment: 'https://hadith-api.onrender.com' (replace with actual URL)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://hadith-api.onrender.com'; // CHANGE THIS TO YOUR RENDER URL

// Backend health check configuration
const HEALTH_CHECK_INTERVAL = 3000; // Check every 3 seconds
let backendHealthy = false;
let healthCheckTimer = null;

// Global state
let currentMode = 'concise';
let isLoading = false;

// DOM Elements
const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const loadingContainer = document.getElementById('loadingContainer');
const resultsSection = document.getElementById('resultsSection');
const responseBody = document.getElementById('responseBody');
const modeIndicator = document.getElementById('modeIndicator');
const hadithsContent = document.getElementById('hadithsContent');
const hadithCount = document.getElementById('hadithCount');
const collapseBtn = document.getElementById('collapseBtn');
const hadithsHeader = document.getElementById('hadithsHeader');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const quickBtns = document.querySelectorAll('.quick-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    addEnterKeyListener();
    startHealthCheck(); // Start checking backend health
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Search button
    searchBtn.addEventListener('click', handleSearch);
    
    // Mode toggle buttons
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            setMode(mode);
        });
    });
    
    // Quick search buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            queryInput.value = query;
            handleSearch();
        });
    });
    
    // Collapse/Expand hadiths
    collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to header
        toggleHadithsExpansion();
    });
    hadithsHeader.addEventListener('click', toggleHadithsExpansion);
}

/**
 * Add enter key listener to search input
 */
function addEnterKeyListener() {
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    });
}

/**
 * Start backend health check
 */
function startHealthCheck() {
    // Initial check
    checkBackendHealth();
    
    // Set up periodic checks
    healthCheckTimer = setInterval(checkBackendHealth, HEALTH_CHECK_INTERVAL);
}

/**
 * Check if backend is healthy
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            handleBackendHealthy(data);
        } else {
            handleBackendUnhealthy();
        }
    } catch (error) {
        handleBackendUnhealthy();
    }
}

/**
 * Handle backend is healthy
 */
function handleBackendHealthy(data) {
    backendHealthy = true;
    
    // Update UI
    const statusMsg = document.getElementById('backendStatus');
    if (statusMsg) {
        statusMsg.style.display = 'none';
    }
    
    // Enable search
    searchBtn.disabled = false;
    queryInput.disabled = false;
    
    // Stop checking if already healthy (save bandwidth)
    if (healthCheckTimer) {
        clearInterval(healthCheckTimer);
        healthCheckTimer = null;
    }
    
    console.log(`✅ Backend is healthy! Loaded ${data.hadiths_loaded} hadiths`);
}

/**
 * Handle backend is unhealthy
 */
function handleBackendUnhealthy() {
    if (backendHealthy) {
        // Was healthy, now isn't
        backendHealthy = false;
        showBackendLoadingMessage();
    } else if (!backendHealthy) {
        // Still unhealthy, show message
        showBackendLoadingMessage();
    }
    
    // Disable search while backend is loading
    searchBtn.disabled = true;
    queryInput.disabled = true;
}

/**
 * Show loading message for backend
 */
function showBackendLoadingMessage() {
    let statusMsg = document.getElementById('backendStatus');
    
    if (!statusMsg) {
        // Create status message element
        statusMsg = document.createElement('div');
        statusMsg.id = 'backendStatus';
        statusMsg.className = 'backend-status-message';
        statusMsg.innerHTML = `
            <div class="status-spinner"></div>
            <div class="status-text">
                <p class="status-title">🚀 Backend is starting up...</p>
                <p class="status-subtitle">This may take 30-60 seconds on free tier. Please wait.</p>
            </div>
        `;
        
        // Insert after header
        const header = document.querySelector('.header');
        if (header) {
            header.insertAdjacentElement('afterend', statusMsg);
        }
    }
    
    statusMsg.style.display = 'flex';
    console.log('⏳ Backend is loading...');
}

/**
 * Set the response mode (concise/detailed)
 */
function setMode(mode) {
    currentMode = mode;
    
    // Update button states
    toggleBtns.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Handle search submission
 */
async function handleSearch() {
    const query = queryInput.value.trim();
    
    if (!query) {
        showNotification('Please enter a query', 'warning');
        return;
    }
    
    if (isLoading) {
        return;
    }
    
    try {
        isLoading = true;
        showLoading();
        hideResults();
        
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                mode: currentMode
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        hideLoading();
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        showNotification('An error occurred. Please try again.', 'error');
    } finally {
        isLoading = false;
    }
}

/**
 * Display search results
 */
function displayResults(data) {
    // Update mode indicator
    modeIndicator.textContent = data.mode.charAt(0).toUpperCase() + data.mode.slice(1);
    
    // Display response
    responseBody.innerHTML = data.response;
    
    // Display hadiths
    displayHadiths(data.hadiths);
    
    // Show results section
    showResults();
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

/**
 * Display individual hadiths
 */
function displayHadiths(hadiths) {
    hadithCount.textContent = `${hadiths.length} Hadith${hadiths.length > 1 ? 's' : ''}`;
    
    hadithsContent.innerHTML = hadiths.map((hadith, index) => `
        <div class="hadith-card" style="animation-delay: ${index * 0.1}s">
            <div class="hadith-header-info">
                <span class="hadith-number">Hadith #${hadith.Hadith_number || 'N/A'}</span>
                <span class="hadith-badge">Chapter ${hadith.Chapter_Number || 'N/A'}</span>
                <span class="grade-badge">${hadith.English_Grade || 'Unknown'}</span>
            </div>
            
            <div class="hadith-text">
                <div class="hadith-english">
                    ${escapeHtml(hadith.English_Hadith || 'No English translation available')}
                </div>
                <div class="hadith-arabic">
                    ${escapeHtml(hadith.Arabic_Hadith || 'لا يوجد نص عربي')}
                </div>
            </div>
            
            <div class="hadith-metadata">
                <div class="metadata-row">
                    <span class="metadata-label">Narrated by:</span>
                    <span class="metadata-value">${escapeHtml(hadith.English_Isnad || 'Unknown')}</span>
                </div>
                <div class="metadata-row">
                    <span class="metadata-label">Similarity Score:</span>
                    <span class="metadata-value">${(1 / (1 + hadith.Distance) * 100).toFixed(2)}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Show loading state
 */
function showLoading() {
    loadingContainer.classList.add('active');
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<span class="btn-text">Searching...</span><i class="fas fa-spinner fa-spin"></i>';
}

/**
 * Hide loading state
 */
function hideLoading() {
    loadingContainer.classList.remove('active');
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<span class="btn-text">Search</span><i class="fas fa-arrow-left"></i>';
}

/**
 * Show results section
 */
function showResults() {
    resultsSection.classList.add('active');
    // Auto-collapse hadiths initially
    hadithsContent.classList.remove('expanded');
    collapseBtn.classList.remove('collapsed');
    updateCollapseButton(false);
}

/**
 * Hide results section
 */
function hideResults() {
    resultsSection.classList.remove('active');
}

/**
 * Toggle hadiths expansion
 */
function toggleHadithsExpansion() {
    const isExpanded = hadithsContent.classList.contains('expanded');
    
    if (isExpanded) {
        hadithsContent.classList.remove('expanded');
        collapseBtn.classList.remove('collapsed');
    } else {
        hadithsContent.classList.add('expanded');
        collapseBtn.classList.add('collapsed');
    }
    
    updateCollapseButton(!isExpanded);
}

/**
 * Update collapse button text
 */
function updateCollapseButton(isExpanded) {
    const btnText = collapseBtn.querySelector('span');
    btnText.textContent = isExpanded ? 'Hide Details' : 'Show Details';
}

/**
 * Show notification (simple implementation)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#008B8B'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-size: 0.95rem;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add smooth scroll behavior to all internal links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Add fade-out animation for notifications
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add console message
console.log('%c🕌 Hadith Chatbot', 'font-size: 20px; font-weight: bold; color: #008B8B;');
console.log('%cBuilt with respect and dedication', 'font-size: 12px; color: #D4AF37;');
