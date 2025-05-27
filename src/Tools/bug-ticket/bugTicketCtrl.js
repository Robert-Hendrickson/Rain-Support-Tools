/**
 * @module bug-ticket-v2
 * @description This module is used to generate bug tickets for the Rain Support Team.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
//import component pieces
import flowCtrlApp from '/Rain-Support-Tools/src/common/flow-format/flow-ctrl-app.js';
import validateStep1 from './validate-step-1.js';
import validateStep2 from './validate-step-2.js';
import validateStep3 from './validate-step-3.js';
import validateStep4 from './validate-step-4.js';
import validateStep5 from './validate-step-5.js';
const BugTicketV2 = createApp({
    components: {
        //'nav-menu': () => import('/Rain-Support-Tools/src/common/navigation/nav-menu.js'),
        //'past-tickets': () => import('/Rain-Support-Tools/src/common/past-tickets/past-tickets.js'),
        flowCtrlApp,
        validateStep1,
        validateStep2,
        validateStep3,
        validateStep4,
        validateStep5
    },
    data() {
        return {
            brand: '',
            currentStep: 1,
            isFinished: false,
            formData: {
                step1: {},
                step2: [],
                step3: '',
                step4: {},
                step5: {}
            }
        }
    },
    methods: {
        async validateStepData(step, resolve){
            let validation_result;
            //this will run a different check before for each step
            switch(step){
                case 1:
                    validation_result = await new Promise((result) => {
                        this.$refs.validateStep1.validate(result);
                    });
                    if (validation_result.success) {
                        this.formData.step1 = validation_result.data;
                    }
                    break;
                case 2:
                    validation_result = await new Promise((result) => {
                        this.$refs.validateStep2.validate(result);
                    });
                    if (validation_result.success) {
                        this.formData.step2 = validation_result.data;
                    }
                    break;
                case 3:
                    validation_result = await new Promise((result) => {
                        this.$refs.validateStep3.validate(result);
                    });
                    if (validation_result.success) {
                        this.formData.step3 = validation_result.data;
                    }
                    break;
                case 4:
                    validation_result = await new Promise((result) => {
                        this.$refs.validateStep4.validate(result);
                    });
                    if (validation_result.success) {
                        this.formData.step4 = validation_result.data;
                    }
                    break;
                case 5:
                    validation_result = await new Promise((result) => {
                        this.$refs.validateStep5.validate(result);
                    });
                    if (validation_result.success) {
                        this.formData.step5 = validation_result.data;
                    }
                    break;
                default:
                    break;
            }
            console.log(validation_result);
            resolve(validation_result.success);
        },
        handleNextStep(){
            this.currentStep++;
        },
        handlePreviousStep(){
            this.currentStep--;
        },
        handleFinish(){
            // Now you can access all the compiled data from this.formData
            console.log('Final form data:', this.formData);
            this.isFinished = true;
        }
    }
});
window.BugTicketV2 = BugTicketV2.mount('#bug-ticket-v2');