import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const scanner_tracker_app = createApp({
    data() {
        return {
            keystrokes: []
        }
    },
    methods: {
        handleKeydown(event) {
            const timestamp = new Date().toISOString();
            const keyInfo = {
                key: event.key,
                keyCode: event.keyCode,
                timestamp: timestamp,
                type: 'keydown'
            };
            this.keystrokes.push(keyInfo);
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        clearKeystrokes() {
            this.keystrokes = [];
            this.$refs.textInput.value = '';
            this.$refs.textInput.focus();
        },
        scrollToBottom() {
            this.$refs.keystrokeInfo.scrollTop = this.$refs.keystrokeInfo.scrollHeight;
        },
        isBadScan(keystroke) {
            return (keystroke.key.length > 1 && keystroke.key !== 'Enter');
        }
    },
    mounted() {
        this.$refs.textInput.focus();
    }
});
scanner_tracker_app.mount('#scanner-tracker-app');