/**
 * @module feedback
 * @description Feedback module for the application
 */

export default {
    name: 'feedBack',
    template: `
        <button class="btn secondary" @click="handleShowFeedback">
            Submit Feedback
        </button>
        <div v-if="showFeedback" class="feedback-container">
            <h1>Submit Feedback</h1>
            <p>
                Please submit any feedback you have about the tool. Make sure to label step and need not being met currently.
            </p>
            <textarea id="feedback-textarea" v-model="feedback" placeholder="Enter your feedback here"></textarea>
            <button class="btn primary" @click="submitFeedback" :disabled="loading">
                <span v-if="loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </span>
                <span v-else>Submit</span>
            </button>
            <button class="btn secondary" @click="handleCloseFeedback">Cancel</button>
            <div id="feedback-status">
                <span v-if="error">Error submitting feedback</span>
                <span v-if="success">Feedback submitted successfully</span>
            </div>
        </div>
    `,
    props: {
        brand: {
            type: String,
            default: 'Rain',
            required: true
        }
    },
    data() {
        return {
            feedback: '',
            showFeedback: false,
            loading: false,
            error: false,
            success: false
        }
    },
    methods: {
        handleShowFeedback() {
            this.showFeedback = true;
        },
        handleCloseFeedback() {
            this.showFeedback = false;
            this.error = false;
            this.success = false;
        },
        async submitFeedback() {
            this.loading = true;
            console.log('Submitting feedback for', this.brand);
            console.log('Feedback:', this.feedback);
            try {
                // Use fetch with no-cors mode to bypass CORS
                const response = await fetch(
                    'https://hooks.zapier.com/hooks/catch/17502823/uuy78rx/',
                    {
                        method: 'POST',
                        mode: 'no-cors', // This bypasses CORS
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            brand: this.brand,
                            tool: location.pathname,
                            feedback: this.feedback
                        })
                    }
                );
                this.feedback = '';
                this.success = true;
                setTimeout(() => {
                    this.success = false;
                }, 3000);
                this.loading = false;
            } catch (error) {
                console.error('Error submitting feedback:', error);
                this.error = true;
                setTimeout(() => {
                    this.error = false;
                }, 3000);
                this.loading = false;
            }
        }
    },
    mounted() {
        let css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', '/Rain-Support-Tools/src/modules/feedback/feedback.css');
        document.head.appendChild(css);
    }
}