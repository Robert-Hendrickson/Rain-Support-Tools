// Background Script for Bandwidth Helper
console.log('Bandwidth Helper background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('Bandwidth Helper extension installed');
        // You can add any initialization logic here
    }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background script received message:', request);
    sendResponse({status: 'received'});
});
