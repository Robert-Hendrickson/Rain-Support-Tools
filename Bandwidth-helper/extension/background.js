// Background Script for Bandwidth Helper
console.log('Bandwidth Helper background script loaded');

// Version checking functionality
const INSTALLED_VERSION = chrome.runtime.getManifest().version; // Single source of truth: manifest.json
const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const VERSION_URL = 'https://robert-hendrickson.github.io/Rain-Support-Tools/Bandwidth-helper/version/version.json';

// Returns true if candidateVersion is newer than baseVersion (e.g. '2.0' > '1.3')
function isNewerVersion(candidateVersion, baseVersion) {
    const candidateParts = String(candidateVersion).split('.').map(part => parseInt(part, 10) || 0);
    const baseParts = String(baseVersion).split('.').map(part => parseInt(part, 10) || 0);
    const partCount = Math.max(candidateParts.length, baseParts.length);

    for (let index = 0; index < partCount; index++) {
        const difference = (candidateParts[index] || 0) - (baseParts[index] || 0);
        if (difference !== 0) return difference > 0;
    }
    return false;
}

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

// Check for version updates (force skips the 24 hour throttle)
async function checkForVersionUpdate(force = false) {
    try {
        const result = await chrome.storage.local.get(['lastVersionCheck', 'lastNotifiedVersion']);
        const now = Date.now();

        // Check if it's time for a version check (every 24 hours)
        if (!force && result.lastVersionCheck && (now - result.lastVersionCheck) < VERSION_CHECK_INTERVAL) {
            return; // Too soon for another check
        }

        // Fetch latest version from remote server
        const remoteVersionData = await fetchRemoteVersion();

        if (!remoteVersionData || !remoteVersionData.version) {
            console.log('Could not fetch remote version data');
            return;
        }

        const latestVersion = remoteVersionData.version;
        await chrome.storage.local.set({
            lastVersionCheck: now,
            lastVersionData: remoteVersionData
        });

        if (isNewerVersion(latestVersion, INSTALLED_VERSION)) {
            console.log(`Version update detected: ${INSTALLED_VERSION} -> ${latestVersion}`);
            console.log('Changelog:', remoteVersionData.changelog);
            console.log('Release Date:', remoteVersionData.releaseDate);

            // Badge stays until the user installs the new version
            chrome.action.setBadgeText({text: '!'});
            chrome.action.setBadgeBackgroundColor({color: '#ff4444'});

            // Only send the notification once per new version
            if (result.lastNotifiedVersion !== latestVersion) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Bandwidth Helper Update Available',
                    message: `Version ${latestVersion} is now available!`
                });
                await chrome.storage.local.set({lastNotifiedVersion: latestVersion});
            }
        } else {
            // Up to date: clear badge
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
    } else if (details.reason === 'update') {
        console.log('Bandwidth Helper extension updated');
    }
    // Check right away on install/update
    checkForVersionUpdate(true);
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
        checkForVersionUpdate(true).then(() => {
            sendResponse({status: 'version check completed'});
        });
        return true; // Keep message channel open for async response
    }

    sendResponse({status: 'received'});
});
