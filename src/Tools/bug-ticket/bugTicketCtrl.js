/**
 * @module bug-ticket-v2
 * @description This module is used to generate bug tickets for the Rain Support Team.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
//import component pieces
import flowCtrlApp from '/Rain-Support-Tools/src/common/flow-format/flow-ctrl-app.js';
import validateStep1 from './validate-step-1.js';
const BugTicketV2 = createApp({
    components: {
        //'nav-menu': () => import('/Rain-Support-Tools/src/common/navigation/nav-menu.js'),
        //'past-tickets': () => import('/Rain-Support-Tools/src/common/past-tickets/past-tickets.js'),
        flowCtrlApp,
        validateStep1
    },
    data() {
        return {
            brand: '',
            currentStep: 1,
            isFinished: false
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
            this.isFinished = true;
        }
    },
    mounted(){
        this.handleNextStep();
    }
});
window.BugTicketV2 = BugTicketV2.mount('#bug-ticket-v2');