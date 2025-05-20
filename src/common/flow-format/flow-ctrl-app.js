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
        nextStep(){
            this.currentStep++;
            this.$emit('step-changed', this.currentStep);
        },
        previousStep(){
            this.currentStep--;
            this.$emit('step-changed', this.currentStep);
        },
        finish(){
            this.$emit('finish');
        }
    },
    template: `<div>
    <button @click="previousStep" v-show="currentStep > 1">Previous</button>
    <button @click="nextStep" v-show="currentStep < maxStep">Next</button>
    <button @click="finish" v-show="currentStep === maxStep">Finish</button>
</div>`
};