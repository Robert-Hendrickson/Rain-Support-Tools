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