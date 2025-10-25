/**
 * Colab Keepalive Extension - Background Service Worker
 * Manages extension lifecycle and state coordination
 */

// Track keepalive status per tab
const keepaliveStatus = new Map();

/**
 * Message handler for communication with content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'toggleKeepalive':
        handleToggleKeepalive(request, sendResponse);
        break;
      case 'getStatus':
        handleGetStatus(request, sendResponse);
        break;
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true; // Keep message channel open for async response
});

/**
 * Handle keepalive toggle request
 */
function handleToggleKeepalive(request, sendResponse) {
  const tabId = request.tabId;
  keepaliveStatus.set(tabId, request.enabled);
  sendResponse({ success: true, enabled: request.enabled });
}

/**
 * Handle status check request
 */
function handleGetStatus(request, sendResponse) {
  const enabled = keepaliveStatus.get(request.tabId) || false;
  sendResponse({ success: true, enabled });
}

/**
 * Clean up when tabs are closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  keepaliveStatus.delete(tabId);
  console.log(`Cleaned up keepalive status for tab ${tabId}`);
});

/**
 * Extension installation/update handler
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Colab Keepalive extension installed');
    // Set default preferences
    chrome.storage.local.set({ autoStart: true });
  } else if (details.reason === 'update') {
    console.log('Colab Keepalive extension updated to version', chrome.runtime.getManifest().version);
  }
});
