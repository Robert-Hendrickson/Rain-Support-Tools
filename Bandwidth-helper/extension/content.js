// Content Script for Bandwidth Helper
console.log('Bandwidth Helper content script loaded');

// Configuration object
let config = {
    customerName: 'Rain Retail Software, LLC',
    accountId: '5007974',
    email: 'robert.hendrickson@quiltsoftware.com',
};

// Load configuration from storage
chrome.storage.sync.get(config, function(items) {
    config = items;
    console.log('Configuration loaded:', config);
    // Auto-fill forms after configuration is loaded
    setTimeout(autoFillForms, 1000);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'configUpdated') {
        config = request.config;
        console.log('Configuration updated:', config);
        autoFillForms();
    }
    if (request.action === 'marketing') {
        updateMarketingFields();
    }
    if (request.action === 'notifications') {
        updateNotificationsFields();
    }
});

// Auto-fill forms function
function autoFillForms() {
    console.log('Auto-filling forms with config:', config);
    
    // Field mappings for Bandwidth forms
    const fieldMappings = [
        // Customer information
        { selectors: ['[label*="Customer Name"]', '[name*="customer_name"]', '[id*="customer_name"]'], value: config.customerName },
        { selectors: ['[label*="Account ID"]', '[name*="account_id"]', '[id*="account_id"]'], value: config.accountId },
        { selectors: ['[label*="Status Updates"]', '[name*="status_updates"]', '[id*="status_updates"]'], value: config.email },
        { selectors: ['[label*="Message Volume"]', '[name*="message_volume"]', '[id*="message_volume"]'], value: '1,000' },
        { selectors: ['[label*="How many numbers are you attempting to verify on this request?"]', '[name*="how_many_numbers_are_you_attempting_to_verify_on_this_request"]', '[id*="how_many_numbers_are_you_attempting_to_verify_on_this_request"]'], value: '1' },
        { selectors: ['[label*="How is opt-in collected?"]', '[name*="how_is_opt_in_collected"]', '[id*="how_is_opt_in_collected"]'], value: 'Online' },
    ];
    
    let filledCount = 0;
    
    fieldMappings.forEach(mapping => {
        mapping.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.offsetParent !== null && !element.value) { // Check if visible and empty
                    element.focus();
                    element.value = mapping.value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    filledCount++;
                    console.log('Filled field:', selector, 'with value:', mapping.value);
                }
            });
        });
    });
    
    if (filledCount > 0) {
        showNotification(`Auto-filled ${filledCount} fields!`);
    }
}

// Auto update fields based on Type Clicked
function updateMarketingFields() {
    console.log('Updating fields based on type: Marketing');
    let fieldMappings = [
        { selectors: ['[label*="Please choose the category that best represents your use case/content:"]', '[name*="please_choose_the_category_that_best_represents_your_use_case_content"]', '[id*="please_choose_the_category_that_best_represents_your_use_case_content"]'], value: 'General Marketing' },
        { selectors: ['[label*="Use Case Summary"]', '[name*="use_case_summary"]', '[id*="use_case_summary"]'], value: 'The purpose for this number is for general promotions for things like upcoming sales or store events.' },
        { selectors: ['[label*="Please provide supporting information of how opt-in is collected"]', '[name*="please_provide_supporting_information_of_how_opt_in_is_collected"]', '[id*="please_provide_supporting_information_of_how_opt_in_is_collected"]'], value: 'Customers will be required to complete a form on the website, where they must enter their name, phone number, and email. This will send info to the store so they can add the customer to the list for receiving marketing messages.' },
        { selectors: ['[label*="Production Messages"]', '[name*="production_messages"]', '[id*="production_messages"]'], value: 'Celebrate your anniversary with 20% off all [[item category]] this Friday! - {{store name}} [No Reply]' },
    ]
    fieldMappings.forEach(mapping => {
        mapping.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.offsetParent !== null) { // Check if visible
                    element.focus();
                    element.value = mapping.value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Filled field:', selector, 'with value:', mapping.value);
                }
            });
        });
    });
}

// Auto update fields based on Type Clicked
function updateNotificationsFields() {
    console.log('Updating fields based on type: Notifications');
    let fieldMappings = [
        { selectors: ['[label*="Please choose the category that best represents your use case/content:"]', '[name*="please_choose_the_category_that_best_represents_your_use_case_content"]', '[id*="please_choose_the_category_that_best_represents_your_use_case_content"]'], value: 'Notifications' },
        { selectors: ['[label*="Use Case Summary"]', '[name*="use_case_summary"]', '[id*="use_case_summary"]'], value: 'The purpose for this number is for sending customers information such as receipts, order updates and repair notifications.' },
        { selectors: ['[label*="Please provide supporting information of how opt-in is collected"]', '[name*="please_provide_supporting_information_of_how_opt_in_is_collected"]', '[id*="please_provide_supporting_information_of_how_opt_in_is_collected"]'], value: 'Customers will be required to complete a form on the website, where they must enter their name, phone number, and email. This will send info to the store so they can add the customer to the list for receiving receipt & account notification messages.' },
        { selectors: ['[label*="Production Messages"]', '[name*="production_messages"]', '[id*="production_messages"]'], value: "Hello, your {{item name}} (Work Order #) is ready for pickup - {{*****STORE NAME******}}; Your order's shipping from {{******STORE NAME****}} has been updated." },
    ]
    fieldMappings.forEach(mapping => {
        mapping.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.offsetParent !== null) { // Check if visible
                    element.focus();
                    element.value = mapping.value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Filled field:', selector, 'with value:', mapping.value);
                }
            });
        });
    });
}

// Auto-fill on page load and when DOM changes
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(autoFillForms, 1000);
});

// Watch for dynamic content changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if new form elements were added
            const hasNewForms = Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && (
                    node.tagName === 'FORM' || 
                    node.querySelector && node.querySelector('input, textarea, select')
                );
            });
            
            if (hasNewForms) {
                setTimeout(autoFillForms, 500);
            }
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = 
        'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'background: #28a745;' +
        'color: white;' +
        'padding: 12px 20px;' +
        'border-radius: 6px;' +
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
        'font-size: 14px;' +
        'font-weight: 500;' +
        'z-index: 10000;' +
        'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
        'animation: slideIn 0.3s ease;';
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = 
        '@keyframes slideIn {' +
        'from { transform: translateX(100%); opacity: 0; }' +
        'to { transform: translateX(0); opacity: 1; }' +
        '}';
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}
