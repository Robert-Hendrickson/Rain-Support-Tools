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
        },
        clearKeystrokes() {
            this.keystrokes = [];
            this.$refs.textInput.value = '';
            this.$refs.textInput.focus();
        }
    },
    mounted() {
        this.$refs.textInput.focus();
    }
});
scanner_tracker_app.mount('#scanner-tracker-app');