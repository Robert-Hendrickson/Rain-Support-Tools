// Popup JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const markBtn = document.getElementById('mark-btn');
    const notifBtn = document.getElementById('notif-btn');

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
const defaultConfig = {
    customerName: 'Rain Retail Software, LLC',
    accountId: '5007974',
    email: 'robert.hendrickson@quiltsoftware.com',
};

// Load configuration from storage
function loadConfiguration() {
    chrome.storage.sync.get(defaultConfig, function(items) {
        document.getElementById('customerName').value = items.customerName || '';
        document.getElementById('accountId').value = items.accountId || '';
        document.getElementById('email').value = items.email || '';
    });
}

// Save configuration to storage
function saveConfiguration() {
    const config = {
        customerName: document.getElementById('customerName').value,
        accountId: document.getElementById('accountId').value,
        email: document.getElementById('email').value,
    };

    chrome.storage.sync.set(config, function() {
        showStatus('Configuration saved!', 'success');

        // Notify content scripts about the update
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
    });
}

// Reset to default values
function resetToDefaults() {
    chrome.storage.sync.set(defaultConfig, function() {
        loadConfiguration();
        showStatus('Reset to defaults!', 'success');

        // Notify content scripts about the update
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs && tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'configUpdated',
                    config: defaultConfig
                }).catch(error => {
                    console.log('Content script not available:', error);
                });
            }
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
