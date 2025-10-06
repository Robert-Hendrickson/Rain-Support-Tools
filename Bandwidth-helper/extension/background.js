// Background Script for Bandwidth Helper
console.log('Bandwidth Helper background script loaded');

// Version checking functionality
const CURRENT_VERSION = '1.2'; // This should match your manifest.json version
const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const VERSION_URL = 'https://robert-hendrickson.github.io/Rain-Support-Tools/Bandwidth-helper/version/version.js'; // Replace with your actual server URL

// Fetch version information from remote server
async function fetchRemoteVersion() {
    try {
        const response = await fetch(VERSION_URL, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const versionData = await response.json();
        return versionData;
    } catch (error) {
        console.error('Failed to fetch remote version:', error);
        return null;
    }
}

// Check for version updates
async function checkForVersionUpdate() {
    try {
        // Get stored version from Chrome storage
        const result = await chrome.storage.local.get(['storedVersion', 'lastVersionCheck', 'lastVersionData']);
        const storedVersion = result.storedVersion;
        const lastCheck = result.lastVersionCheck;
        
        // Check if it's time for a version check (every 24 hours)
        const now = Date.now();
        if (lastCheck && (now - lastCheck) < VERSION_CHECK_INTERVAL) {
            return; // Too soon for another check
        }
        
        // Fetch latest version from remote server
        const remoteVersionData = await fetchRemoteVersion();
        
        if (!remoteVersionData) {
            console.log('Could not fetch remote version data');
            return;
        }
        
        const latestVersion = remoteVersionData.version;
        
        if (storedVersion !== latestVersion) {
            console.log(`Version update detected: ${storedVersion} -> ${latestVersion}`);
            console.log('Changelog:', remoteVersionData.changelog);
            console.log('Release Date:', remoteVersionData.releaseDate);
            
            // Store the new version and version data
            await chrome.storage.local.set({
                storedVersion: latestVersion,
                lastVersionCheck: now,
                lastVersionData: remoteVersionData
            });
            
            // Notify user of update
            console.log('Extension update available:', latestVersion);
            
            // You could show a notification here
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Bandwidth Helper Update Available',
                message: `Version ${latestVersion} is now available!`
            });
            
            // Update badge to show update available
            chrome.action.setBadgeText({text: '!'});
            chrome.action.setBadgeBackgroundColor({color: '#ff4444'});
            
        } else {
            // Update last check time even if no version change
            await chrome.storage.local.set({
                lastVersionCheck: now,
                lastVersionData: remoteVersionData
            });
            
            // Clear badge if no update needed
            chrome.action.setBadgeText({text: ''});
        }
    } catch (error) {
        console.error('Error checking for version update:', error);
    }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('Bandwidth Helper extension installed');
        // Initialize version tracking
        chrome.storage.local.set({
            storedVersion: CURRENT_VERSION,
            lastVersionCheck: Date.now()
        });
    } else if (details.reason === 'update') {
        console.log('Bandwidth Helper extension updated');
        // Check for version updates on extension update
        checkForVersionUpdate();
    }
});

// Set up periodic version checking
chrome.alarms.create('versionCheck', {
    delayInMinutes: 60, // Check every hour
    periodInMinutes: 60
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'versionCheck') {
        checkForVersionUpdate();
    }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background script received message:', request);
    
    if (request.action === 'checkVersion') {
        checkForVersionUpdate().then(() => {
            sendResponse({status: 'version check completed'});
        });
        return true; // Keep message channel open for async response
    }
    
    sendResponse({status: 'received'});
});
