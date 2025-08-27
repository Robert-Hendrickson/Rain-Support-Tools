// Download functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadChromeExtension);
    }
});

async function downloadChromeExtension() {
    try { // Load JSZip from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(script);
        
        // Wait for JSZip to load
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
        
        // Create a ZIP file using JSZip library
        const zip = new JSZip();
        
        // Load all files from the local extension folder
        const files = [
            'extension/manifest.json',
            'extension/popup.html',
            'extension/popup.js',
            'extension/popup.css',
            'extension/content.js',
            'extension/background.js',
            'extension/icons/icon16.png',
            'extension/icons/icon32.png',
            'extension/icons/icon48.png',
            'extension/icons/icon128.png',
            'extension/README.md'
        ];
        
        // Load each file and add to ZIP
        for (const filePath of files) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    // Remove 'extension/' prefix for the ZIP structure
                    const zipPath = filePath.replace('extension/', '');
                    zip.file(zipPath, content);
                } else {
                    console.warn(`Failed to load ${filePath}: ${response.status}`);
                }
            } catch (error) {
                console.warn(`Error loading ${filePath}:`, error);
            }
        }
        
        // Generate the ZIP file
        const content = await zip.generateAsync({type: 'blob'});
        
        // Create download link
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bandwidth-helper-extension.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        showMessage('Chrome extension downloaded! Check your downloads folder.', 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showMessage('Download failed. Please try again.', 'error');
    }
}

function showMessage(message, type) {
    // Create a simple message display
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 
        'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'padding: 15px 20px;' +
        'border-radius: 4px;' +
        'color: white;' +
        'font-weight: bold;' +
        'z-index: 1000;' +
        'background-color: ' + (type === 'success' ? '#28a745' : '#dc3545') + ';' +
        'animation: slideIn 0.3s ease;';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}

// Original form filling functionality
/*
document.addEventListener('click', (event) => {
    if (event.target.nodeName != 'INPUT' && event.target.nodeName != 'TEXTAREA') {
        return;
    }
    const field = event.target.getAttribute('label');
    if (field === 'Bandwidth Customer Name') {
        navigator.clipboard.writeText('Rain Retail Software, LLC');
        return;
    }
    if (field === 'Bandwidth Customer Account ID') {
        navigator.clipboard.writeText('5007974');
        return;
    }
    if (field === 'Bandwidth Customer Email Address (for Status Updates)') {
        navigator.clipboard.writeText('robert.hendrickson@quiltsoftware.com');
        return;
    }
    if (field === 'Message Sender: Legal Company Name') {
        navigator.clipboard.writeText('Robs Test Site');
        return;
    }
    if (field === 'Message Sender: URL/Website') {
        navigator.clipboard.writeText('https://www.robstestsite.com');
        return;
    }
    if (field === 'Message Sender Primary Company Address or Corporate Headquarters') {
        navigator.clipboard.writeText('1800 Novell Pl');
        navigator.clipboard.writeText('Provo');
        navigator.clipboard.writeText('Utah');
        navigator.clipboard.writeText('84606');
        return;
    }
    if (field === 'Business Contact: First Name') {
        navigator.clipboard.writeText('Robert');
        return;
    }
    if (field === 'Business Contact: Last Name') {
        navigator.clipboard.writeText('Hendrickson');
        return;
    }
    if (field === 'Business Contact: Email') {
        navigator.clipboard.writeText('robert.hendrickson@quiltsoftware.com');
        return;
    }
    if (field === 'Business Contact: Phone') {
        navigator.clipboard.writeText('3854046200');
        return;
    }
    if (field === 'Use Case Summary') {
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'General Marketing') {
            navigator.clipboard.writeText('The purpose for this number is for general promotions for things like upcoming sales or store events.');
        }
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'Notifications') {
            navigator.clipboard.writeText('The purpose for this number is for sending customers information such as receipts, order updates and repair notifications.');
        }
        return;
    }
    if (field === 'Please provide supporting information of how opt-in is collected') {
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'General Marketing') {
            navigator.clipboard.writeText('Customers will be required to complete a form on the website, where they must enter their name, phone number, and email. This will send info to the store so they can add the customer to the list for receiving marketing messages.');
        }
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'Notifications') {
            navigator.clipboard.writeText('Customers will be required to complete a form on the website, where they must enter their name, phone number, and email. This will send info to the store so they can add the customer to the list for receiving receipt & account notification messages.');
        }
        return;
    }
    if (field === 'Production Messages') {
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'General Marketing') {
            navigator.clipboard.writeText('Celebrate your anniversary with 20% off all [[item category]] this Friday! - {{store name}} [No Reply]');
        }
        if (document.querySelector('select[label="Please choose the category that best represents your use case/content:"]').value === 'Notifications') {
            navigator.clipboard.writeText("Hello, your {{item name}} (Work Order #) is ready for pickup - {{*****STORE NAME******}}; Your order's shipping from {{******STORE NAME****}} has been updated.");
        }
        return;
    }
});

document.querySelector('select[label="Estimated Monthly Message Volume"]').value = '1,000';
document.querySelector('select[label="How many numbers are you attempting to verify on this request?"]').value = '1';
document.querySelector('select[label="How is opt-in collected?"]').value = 'Online';
*/