// js/script.js - Interactive features for MeetingNote.ai

// ==================== CONFIGURATION ====================
const CONFIG = {
    AI_PROCESSING_TIME: 3000, // 3 seconds for AI processing simulation
    PLATFORM_CONNECTION_TIME: 2000, // 2 seconds for connection
    MEETING_START_TIME: 2500 // 2.5 seconds to start meeting
};

// ==================== APPLICATION STATE ====================
let appState = {
    connectedPlatforms: [],
    activeMeetings: [],
    meetingHistory: [],
    userPreferences: {
        autoStart: true,
        language: 'en',
        notifications: true
    }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Simulates connection to a meeting platform
 * @param {string} platformName - Platform name (Zoom, Teams, Meet)
 */
function connectPlatform(platformName) {
    console.log(`🔗 Connecting to ${platformName}...`);
    
    // Check if already connected
    if (appState.connectedPlatforms.includes(platformName)) {
        showInfo(`${platformName} is already connected`);
        return;
    }
    
    showLoading(`Connecting to ${platformName}...`);
    
    // Simulate connection process
    setTimeout(() => {
        hideLoading();
        
        // Add to connected platforms list
        appState.connectedPlatforms.push(platformName);
        
        // Update interface
        updatePlatformCard(platformName);
        updatePlatformStats();
        
        showSuccess(`✅ ${platformName} connected successfully!`);
        console.log(`✅ ${platformName} connected - Platforms:`, appState.connectedPlatforms);
        
    }, CONFIG.PLATFORM_CONNECTION_TIME);
}

/**
 * Simulates starting a meeting
 * @param {string} platform - Platform to use
 */
function startMeeting(platform) {
    if (!appState.connectedPlatforms.includes(platform)) {
        showError(`Please connect ${platform} first`);
        return;
    }
    
    console.log(`🎥 Starting meeting on ${platform}...`);
    showLoading(`Preparing ${platform} meeting`);
    
    const meetingId = 'meeting_' + Date.now();
    const newMeeting = {
        id: meetingId,
        platform: platform,
        startTime: new Date(),
        status: 'starting'
    };
    
    appState.activeMeetings.push(newMeeting);
    
    setTimeout(() => {
        hideLoading();
        
        // Update meeting status
        const meetingIndex = appState.activeMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
            appState.activeMeetings[meetingIndex].status = 'recording';
        }
        
        showSuccess(`🎥 ${platform} meeting started! AI is listening and analyzing...`);
        
        // Simulate meeting end after 5 seconds
        setTimeout(() => {
            endMeeting(meetingId);
        }, 5000);
        
    }, CONFIG.MEETING_START_TIME);
}

/**
 * Simulates meeting end and AI processing
 * @param {string} meetingId - Meeting ID
 */
function endMeeting(meetingId) {
    const meetingIndex = appState.activeMeetings.findIndex(m => m.id === meetingId);
    if (meetingIndex === -1) return;
    
    const meeting = appState.activeMeetings[meetingIndex];
    
    console.log(`⏹️ Ending meeting ${meetingId}`);
    showLoading(`AI processing for ${meeting.platform}...`);
    
    // Simulate AI processing
    setTimeout(() => {
        hideLoading();
        
        // Create simulated summary
        const summary = generateAISummary(meeting.platform);
        
        // Add to history
        const completedMeeting = {
            ...meeting,
            endTime: new Date(),
            status: 'completed',
            summary: summary,
            duration: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
            participants: Math.floor(Math.random() * 10) + 2 // 2-12 participants
        };
        
        appState.meetingHistory.unshift(completedMeeting);
        appState.activeMeetings.splice(meetingIndex, 1);
        
        // Update interface
        updateMeetingHistory();
        updateStats();
        
        showSuccess(`📋 AI summary generated for ${meeting.platform} meeting!`);
        console.log('📊 New meeting processed:', completedMeeting);
        
    }, CONFIG.AI_PROCESSING_TIME);
}

/**
 * Generates a simulated meeting summary
 * @param {string} platform - Meeting platform
 * @returns {object} AI-generated summary
 */
function generateAISummary(platform) {
    const topics = [
        'Project Review',
        'Strategic Planning',
        'Problem Solving',
        'Client Presentation',
        'Team Meeting'
    ];
    
    const actions = [
        'Prepare final report',
        'Contact client',
        'Review budget',
        'Schedule next meeting',
        'Update documentation'
    ];
    
    const decisions = [
        'Approve new budget',
        'Validate deadlines',
        'Adopt new strategy',
        'Confirm resources'
    ];
    
    return {
        title: topics[Math.floor(Math.random() * topics.length)],
        keyPoints: [
            'Project is on track overall',
            'Budget constraints discussed',
            'Team collaboration is effective',
            'Client satisfaction is high'
        ],
        actionItems: [
            { task: actions[Math.floor(Math.random() * actions.length)], assignee: 'John D.', dueDate: '2024-01-15' },
            { task: actions[Math.floor(Math.random() * actions.length)], assignee: 'Sarah M.', dueDate: '2024-01-20' }
        ],
        decisions: [
            decisions[Math.floor(Math.random() * decisions.length)],
            decisions[Math.floor(Math.random() * decisions.length)]
        ],
        sentiment: 'positive',
        confidence: (Math.random() * 20 + 80).toFixed(1) + '%' // 80-100%
    };
}

/**
 * Displays a meeting summary in a modal
 * @param {string} meetingTitle - Meeting title
 */
function showMeetingSummary(meetingTitle) {
    const summary = generateAISummary('General');
    
    showLoading(`Loading summary: ${meetingTitle}`);
    
    setTimeout(() => {
        hideLoading();
        
        // Create modal with summary
        const modalHTML = `
            <div class="summary-modal">
                <div class="modal-header">
                    <h3>${meetingTitle}</h3>
                    <button class="close-modal" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="summary-section">
                        <h4><i class="fas fa-list"></i> Key Points</h4>
                        <ul>
                            ${summary.keyPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="summary-section">
                        <h4><i class="fas fa-tasks"></i> Action Items</h4>
                        <div class="action-items">
                            ${summary.actionItems.map(action => `
                                <div class="action-item">
                                    <span class="action-task">${action.task}</span>
                                    <div class="action-details">
                                        <span class="assignee">👤 ${action.assignee}</span>
                                        <span class="due-date">📅 ${action.dueDate}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="summary-section">
                        <h4><i class="fas fa-check-circle"></i> Decisions Made</h4>
                        <ul>
                            ${summary.decisions.map(decision => `<li>${decision}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="summary-meta">
                        <span class="sentiment ${summary.sentiment}">
                            <i class="fas fa-smile"></i> Positive sentiment
                        </span>
                        <span class="confidence">
                            <i class="fas fa-brain"></i> ${summary.confidence} confidence
                        </span>
                    </div>
                </div>
            </div>
            <div class="modal-overlay" onclick="closeModal()"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
    }, 1500);
}

// ==================== UI UPDATE FUNCTIONS ====================

/**
 * Updates platform card after connection
 * @param {string} platformName - Platform name
 */
function updatePlatformCard(platformName) {
    const platformCards = document.querySelectorAll('.platform-card');
    
    platformCards.forEach(card => {
        if (card.querySelector('h3').textContent.includes(platformName)) {
            const button = card.querySelector('button');
            button.innerHTML = '<i class="fas fa-check"></i> Connected';
            button.style.background = 'var(--success)';
            button.disabled = true;
            
            // Add connected badge
            const badge = document.createElement('div');
            badge.className = 'connected-badge';
            badge.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
            card.appendChild(badge);
            
            // Add start meeting button
            const startButton = document.createElement('button');
            startButton.className = 'btn-primary start-meeting-btn';
            startButton.innerHTML = '<i class="fas fa-play"></i> Start Meeting';
            startButton.onclick = () => startMeeting(platformName);
            card.appendChild(startButton);
        }
    });
}

/**
 * Updates platform statistics
 */
function updatePlatformStats() {
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const platformStat = statsGrid.children[0];
        if (platformStat) {
            const countElement = platformStat.querySelector('h3');
            if (countElement) {
                countElement.textContent = appState.connectedPlatforms.length;
            }
        }
    }
}

/**
 * Updates meeting history display
 */
function updateMeetingHistory() {
    // This would update the meetings list in a real app
    console.log('Meeting history updated:', appState.meetingHistory.length, 'meetings');
}

/**
 * Updates statistics display
 */
function updateStats() {
    // Update stats cards with new data
    const stats = document.querySelectorAll('.stat-card h3');
    if (stats.length > 0) {
        // Update meetings count
        stats[0].textContent = appState.meetingHistory.length + 12; // Base + new
        
        // Update time saved (approximate calculation)
        const totalMinutes = appState.meetingHistory.reduce((total, meeting) => {
            return total + (meeting.duration || 45);
        }, 540); // Base 9 hours
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        stats[1].textContent = `${hours}h ${minutes}m`;
        
        // Update actions identified
        const totalActions = appState.meetingHistory.reduce((total, meeting) => {
            return total + (meeting.summary?.actionItems?.length || 2);
        }, 47); // Base 47 actions
        stats[2].textContent = totalActions;
    }
}

// ==================== NOTIFICATION FUNCTIONS ====================

/**
 * Shows loading indicator
 * @param {string} message - Loading message
 */
function showLoading(message) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
    
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        color: white;
        font-size: 18px;
        backdrop-filter: blur(4px);
    `;
    
    loadingOverlay.querySelector('.loading-spinner').style.cssText = `
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 12px;
        color: var(--dark);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `;
    
    loadingOverlay.querySelector('.fa-spinner').style.cssText = `
        font-size: 48px;
        margin-bottom: 16px;
        color: var(--primary);
    `;
    
    document.body.appendChild(loadingOverlay);
}

/**
 * Hides loading indicator
 */
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

/**
 * Shows success notification
 * @param {string} message - Success message
 */
function showSuccess(message) {
    showNotification(message, 'success');
}

/**
 * Shows error notification
 * @param {string} message - Error message
 */
function showError(message) {
    showNotification(message, 'error');
}

/**
 * Shows info notification
 * @param {string} message - Info message
 */
function showInfo(message) {
    showNotification(message, 'info');
}

/**
 * Shows a notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: 'var(--success)',
        error: '#EF4444',
        info: 'var(--primary)'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1001;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

/**
 * Closes modal
 */
function closeModal() {
    const modal = document.querySelector('.summary-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// ==================== INITIALIZATION ====================

/**
 * Initializes the application
 */
function initApp() {
    console.log('🚀 MeetingNote.ai Application Initialized');
    
    // Add event listeners to platform connection buttons
    const connectButtons = document.querySelectorAll('.platform-card .btn-primary');
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platformName = this.closest('.platform-card').querySelector('h3').textContent;
            connectPlatform(platformName);
        });
    });
    
    // Add event listeners to summary buttons
    const summaryButtons = document.querySelectorAll('.meeting-actions .btn-primary');
    summaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const meetingTitle = this.closest('.meeting-card').querySelector('.meeting-title').textContent;
            showMeetingSummary(meetingTitle);
        });
    });
    
    // Add event listeners to replay buttons
    const replayButtons = document.querySelectorAll('.btn-outline');
    replayButtons.forEach(button => {
        if (button.textContent.includes('Replay')) {
            button.addEventListener('click', function() {
                const meetingTitle = this.closest('.meeting-card').querySelector('.meeting-title').textContent;
                showInfo(`Replaying meeting: ${meetingTitle}`);
            });
        }
    });
    
    // Initialize with some connected platforms for demo
    setTimeout(() => {
        appState.connectedPlatforms = ['Zoom', 'Microsoft Teams'];
        updatePlatformStats();
        console.log('Demo platforms initialized');
    }, 1000);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        connectPlatform,
        startMeeting,
        showMeetingSummary,
        appState
    };
}
