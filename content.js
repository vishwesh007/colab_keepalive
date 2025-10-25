/**
 * Colab Keepalive Extension - Content Script
 * Runs on Google Colab pages to simulate user activity
 */

let keepaliveInterval = null;
let isEnabled = false;

// Configuration
const CONFIG = {
  INTERVAL_MS: 60000, // 60 seconds
  SELECTORS: {
    CONNECT_BUTTON: 'colab-connect-button',
    CONNECT_SHADOW_BUTTON: '#connect',
    TOP_TOOLBAR: '#top-toolbar',
    NOTEBOOK_CONTAINER: '.notebook-container'
  }
};

/**
 * Simulates user activity to prevent Colab disconnection
 */
function simulateActivity() {
  try {
    // 1. Check and handle connection status
    attemptReconnect();
    
    // 2. Simulate mouse movement
    simulateMouseMovement();
    
    // 3. Simulate interaction with notebook
    simulateNotebookInteraction();
    
    console.log(`[Colab Keepalive] Activity simulated at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('[Colab Keepalive] Error during activity simulation:', error);
  }
}

/**
 * Attempts to reconnect if disconnected
 */
function attemptReconnect() {
  const connectButton = document.querySelector(CONFIG.SELECTORS.CONNECT_BUTTON);
  if (!connectButton) return;

  const shadowButton = connectButton.shadowRoot?.querySelector(CONFIG.SELECTORS.CONNECT_SHADOW_BUTTON);
  if (shadowButton && shadowButton.textContent?.includes('Connect')) {
    console.log('[Colab Keepalive] Detected disconnection, attempting reconnect...');
    shadowButton.click();
  }
}

/**
 * Simulates mouse movement across the page
 */
function simulateMouseMovement() {
  const mouseMoveEvent = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: Math.random() * window.innerWidth,
    clientY: Math.random() * window.innerHeight
  });
  document.dispatchEvent(mouseMoveEvent);
}

/**
 * Simulates interaction with notebook elements
 */
function simulateNotebookInteraction() {
  const toolbar = document.querySelector(CONFIG.SELECTORS.TOP_TOOLBAR);
  if (toolbar) {
    toolbar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  }

  const notebook = document.querySelector(CONFIG.SELECTORS.NOTEBOOK_CONTAINER);
  if (notebook) {
    notebook.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
  }
}

/**
 * Starts the keepalive interval
 */
function startKeepalive() {
  if (keepaliveInterval) {
    console.log('[Colab Keepalive] Already running');
    return;
  }
  
  console.log('[Colab Keepalive] Started');
  isEnabled = true;
  
  // Start interval
  keepaliveInterval = setInterval(simulateActivity, CONFIG.INTERVAL_MS);
  
  // Run initial simulation immediately
  simulateActivity();
  
  // Update badge
  chrome.runtime.sendMessage({ action: 'updateBadge', enabled: true });
}

/**
 * Stops the keepalive interval
 */
function stopKeepalive() {
  if (keepaliveInterval) {
    clearInterval(keepaliveInterval);
    keepaliveInterval = null;
  }
  
  isEnabled = false;
  console.log('[Colab Keepalive] Stopped');
  
  // Update badge
  chrome.runtime.sendMessage({ action: 'updateBadge', enabled: false });
}

/**
 * Message listener for popup communication
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'start':
        startKeepalive();
        sendResponse({ success: true, enabled: true });
        break;
      
      case 'stop':
        stopKeepalive();
        sendResponse({ success: true, enabled: false });
        break;
      
      case 'getStatus':
        sendResponse({ success: true, enabled: isEnabled });
        break;
      
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('[Colab Keepalive] Message handler error:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep message channel open for async response
});

/**
 * Initialize on page load
 */
function initialize() {
  console.log('[Colab Keepalive] Content script loaded');
  
  // Check auto-start preference
  chrome.storage.local.get(['autoStart'], (result) => {
    if (result.autoStart !== false) {
      console.log('[Colab Keepalive] Auto-start enabled');
      // Delay start to ensure page is fully loaded
      setTimeout(() => startKeepalive(), 2000);
    }
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  stopKeepalive();
});
