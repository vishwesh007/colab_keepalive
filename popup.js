/**
 * Colab Keepalive Extension - Popup UI Controller
 * Manages the extension popup interface
 */

let isActive = false;
let currentTab = null;

/**
 * Updates the UI based on current state
 */
function updateUI() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const toggleBtn = document.getElementById('toggleBtn');
  
  if (isActive) {
    statusIndicator.className = 'status-indicator active';
    statusText.textContent = 'Active';
    toggleBtn.textContent = 'Stop Keepalive';
    toggleBtn.className = 'btn-stop';
  } else {
    statusIndicator.className = 'status-indicator inactive';
    statusText.textContent = 'Inactive';
    toggleBtn.textContent = 'Start Keepalive';
    toggleBtn.className = 'btn-start';
  }
}

/**
 * Checks if current tab is a Colab page
 */
function isColabPage(url) {
  return url && url.includes('colab.research.google.com');
}

/**
 * Checks and updates the keepalive status
 */
async function checkStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    
    if (!isColabPage(tab.url)) {
      showNotOnColabState();
      return;
    }
    
    // Query content script for status
    chrome.tabs.sendMessage(tab.id, { action: "getStatus" }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not ready or page just loaded
        console.log('[Popup] Content script not ready:', chrome.runtime.lastError.message);
        isActive = false;
        updateUI();
        return;
      }
      
      if (response && response.success) {
        isActive = response.enabled;
        updateUI();
      }
    });
  } catch (error) {
    console.error('[Popup] Error checking status:', error);
  }
}

/**
 * Shows UI state when not on Colab page
 */
function showNotOnColabState() {
  const statusText = document.getElementById('statusText');
  const toggleBtn = document.getElementById('toggleBtn');
  
  statusText.textContent = 'Not on Colab';
  statusText.className = 'warning';
  toggleBtn.textContent = 'Open Colab First';
  toggleBtn.disabled = true;
  toggleBtn.className = 'btn-disabled';
}

/**
 * Handles toggle button click
 */
async function handleToggle() {
  if (!currentTab || !isColabPage(currentTab.url)) {
    return;
  }
  
  const action = isActive ? "stop" : "start";
  
  try {
    chrome.tabs.sendMessage(currentTab.id, { action }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Popup] Error toggling:', chrome.runtime.lastError);
        showError('Failed to communicate with page. Please refresh.');
        return;
      }
      
      if (response && response.success) {
        isActive = !isActive;
        updateUI();
        showSuccess(isActive ? 'Keepalive started!' : 'Keepalive stopped');
      }
    });
  } catch (error) {
    console.error('[Popup] Toggle error:', error);
    showError('An error occurred. Please try again.');
  }
}

/**
 * Shows success message
 */
function showSuccess(message) {
  // Could implement a toast notification here
  console.log('[Popup]', message);
}

/**
 * Shows error message
 */
function showError(message) {
  const statusText = document.getElementById('statusText');
  const originalText = statusText.textContent;
  statusText.textContent = message;
  statusText.style.color = '#ef4444';
  
  setTimeout(() => {
    statusText.style.color = '';
    checkStatus();
  }, 3000);
}

/**
 * Event Listeners
 */
document.getElementById('toggleBtn').addEventListener('click', handleToggle);

document.getElementById('autoStart').addEventListener('change', (e) => {
  chrome.storage.local.set({ autoStart: e.target.checked }, () => {
    console.log('[Popup] Auto-start preference saved:', e.target.checked);
  });
});

/**
 * Initialize popup
 */
function initializePopup() {
  // Load auto-start preference
  chrome.storage.local.get(['autoStart'], (result) => {
    document.getElementById('autoStart').checked = result.autoStart !== false;
  });
  
  // Initial status check
  checkStatus();
  
  // Poll for status updates
  setInterval(checkStatus, 2000);
}

// Run initialization
initializePopup();