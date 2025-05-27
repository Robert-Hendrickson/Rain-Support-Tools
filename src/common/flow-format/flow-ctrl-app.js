export default {
    name: 'flow-ctrl-app',
    data(){
        return {
            currentStep: 1
        }
    },
    props: {
        maxStep: {
            type: Number,
            default: 3
        }
    },
    methods: {
        async nextStep(){
            try {
                // Create a Promise that will be resolved by the parent
                const canProceed = await new Promise((resolve) => {
                    this.$emit('step-change-request', this.currentStep, resolve);
                });
                
                // Only proceed if parent returned true
                if (canProceed) {
                    this.currentStep++;
                    this.$emit('step-changed', this.currentStep);
                }
            } catch (error) {
                console.error('Error during step change:', error);
            }
        },
        previousStep(){
            this.currentStep--;
            this.$emit('previous-step', this.currentStep);
        },
        async finish(){
            try{
                const canProceed = await new Promise((resolve) => {
                    this.$emit('step-change-request', this.currentStep, resolve);
                });
                if (canProceed) {
                    this.$emit('finish');
                }
            } catch (error) {
                console.error('Error during step change:', error);
            }
        }
    },
    template: `<div class="flow-controls">
    <button class="btn secondary" @click="previousStep" v-show="currentStep > 1">Previous</button>
    <button class="btn primary" @click="nextStep" v-show="currentStep < maxStep">Next</button>
    <button class="btn primary" @click="finish" v-show="currentStep === maxStep">Finish</button>
</div>`
};