import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const app = createApp({
    data() {
        return {
            company_name: 'COMPANY NAME',
            required_text: true,
            marketing_signup: true,
            marketing_title_text: 'MARKETING NOTIFICATIONS',
            marketing_consent_text: 'Marketing',
            notification_title_text: 'MESSAGE RECEIPTS & NOTIFICATIONS',
            notification_consent_text: 'Account Notification'
        }
    },
    methods: {
      updateName() {
        this.company_name = this.$refs['name-input'].value;
      },
      updateRequiredText() {
        this.required_text = !this.required_text;
      }
    },
})
app.mount('#app');