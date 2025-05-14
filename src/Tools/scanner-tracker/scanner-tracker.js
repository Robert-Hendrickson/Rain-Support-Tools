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
    document.querySelector('#clearButton button').addEventListener('click', () => {
        keystrokes = [];
        textInput.value = '';
        updateKeystrokeDisplay();
        textInput.focus();
    });
    textInput.focus();
});
