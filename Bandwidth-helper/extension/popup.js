// Popup JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const markBtn = document.getElementById('mark-btn');
    const notifBtn = document.getElementById('notif-btn');

    // Profile toggle event listeners
    document.querySelectorAll('.profile-btn').forEach(btn => {
        btn.addEventListener('click', () => switchProfile(btn.dataset.profile));
    });

    // Load saved configuration
    loadConfiguration();

    // Save button event listener
    saveBtn.addEventListener('click', saveConfiguration);

    // Reset button event listener
    resetBtn.addEventListener('click', resetToDefaults);

    // Mark button event listener
    markBtn.addEventListener('click', () => updateFields('marketing'));

    // Notif button event listener
    notifBtn.addEventListener('click', () => updateFields('notifications'));
});

// Default configuration values
// Rain uses the original customerName/accountId keys so existing saved data is kept.
const defaultConfig = {
    profile: 'rain',
    customerName: 'Rain Retail Software, LLC',
    accountId: '5007974',
    stormCustomerName: 'Rain Retail Software LLC - Storm',
    stormAccountId: '5010389',
    email: '', // empty default: storage.get only returns keys listed here
};

// Storage keys for the name/id fields of each profile
const profileKeys = {
    rain: { name: 'customerName', id: 'accountId' },
    storm: { name: 'stormCustomerName', id: 'stormAccountId' },
};

// Build the flat config the content script uses for the given profile
function getEffectiveConfig(items, profile) {
    const keys = profileKeys[profile] || profileKeys.rain;
    return {
        customerName: items[keys.name],
        accountId: items[keys.id],
        email: items.email || '',
    };
}

function setActiveProfileButton(profile) {
    document.querySelectorAll('.profile-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.profile === profile);
    });
}

// Notify content scripts about the update
function notifyContentScript(config) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'configUpdated',
                config: config
            }).catch(error => {
                console.log('Content script not available:', error);
            });
        }
    });
}

// Load configuration from storage
function loadConfiguration() {
    chrome.storage.sync.get(defaultConfig, function(items) {
        const profile = profileKeys[items.profile] ? items.profile : 'rain';
        const config = getEffectiveConfig(items, profile);
        setActiveProfileButton(profile);
        document.getElementById('customerName').value = config.customerName || '';
        document.getElementById('accountId').value = config.accountId || '';
        document.getElementById('email').value = config.email || '';
    });
}

// Switch between Rain and Storm profiles
function switchProfile(profile) {
    chrome.storage.sync.set({profile: profile}, function() {
        chrome.storage.sync.get(defaultConfig, function(items) {
            setActiveProfileButton(profile);
            const config = getEffectiveConfig(items, profile);
            document.getElementById('customerName').value = config.customerName || '';
            document.getElementById('accountId').value = config.accountId || '';
            showStatus('Switched to ' + (profile === 'storm' ? 'Storm' : 'Rain') + '!', 'success');
            // Only send the profile fields; the email is not part of a profile switch
            notifyContentScript({
                customerName: config.customerName,
                accountId: config.accountId,
            });
        });
    });
}

// Save configuration to storage (for the active profile)
function saveConfiguration() {
    const activeBtn = document.querySelector('.profile-btn.active');
    const profile = activeBtn ? activeBtn.dataset.profile : 'rain';
    const keys = profileKeys[profile];
    const config = {
        customerName: document.getElementById('customerName').value,
        accountId: document.getElementById('accountId').value,
        email: document.getElementById('email').value,
    };

    const toStore = {
        profile: profile,
        email: config.email,
        [keys.name]: config.customerName,
        [keys.id]: config.accountId,
    };

    chrome.storage.sync.set(toStore, function() {
        showStatus('Configuration saved!', 'success');
        notifyContentScript(config);
    });
}

// Reset to default values
function resetToDefaults() {
    // Reset the profile fields only; keep the user's saved email
    const {email, ...profileDefaults} = defaultConfig;
    chrome.storage.sync.set(profileDefaults, function() {
        loadConfiguration();
        showStatus('Reset to defaults!', 'success');
        notifyContentScript({
            customerName: defaultConfig.customerName,
            accountId: defaultConfig.accountId,
        });
    });
}

// Update fields based on type clicked
function updateFields(type) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: type,
            }).catch(error => {
                console.log('Content script not available:', error);
            });
        }
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status-message ' + type;

    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status-message';
    }, 2000);
}
