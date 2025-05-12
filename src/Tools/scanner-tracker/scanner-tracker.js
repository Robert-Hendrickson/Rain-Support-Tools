document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const keystrokeInfo = document.getElementById('keystrokeInfo');
    let keystrokes = [];

    textInput.addEventListener('keydown', (event) => {
        const timestamp = new Date().toISOString();
        const keyInfo = {
            key: event.key,
            keyCode: event.keyCode,
            timestamp: timestamp,
            type: 'keydown'
        };
        keystrokes.push(keyInfo);
        updateKeystrokeDisplay();
    });

    function updateKeystrokeDisplay() {
        const displayText = keystrokes.map(stroke => {
            return `[${stroke.timestamp}] ${stroke.type}: Key="${stroke.key}" (Code: ${stroke.keyCode})`;
        }).join('\n');
        keystrokeInfo.textContent = displayText;
        keystrokeInfo.scrollTop = keystrokeInfo.scrollHeight;
    }

    // Add clear button functionality
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Keystrokes';
    clearButton.style.marginTop = '10px';
    clearButton.style.padding = '8px 16px';
    clearButton.style.backgroundColor = '#dc3545';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.cursor = 'pointer';

    clearButton.addEventListener('click', () => {
        keystrokes = [];
        updateKeystrokeDisplay();
    });

    document.querySelector('#clearButton').appendChild(clearButton);
});
