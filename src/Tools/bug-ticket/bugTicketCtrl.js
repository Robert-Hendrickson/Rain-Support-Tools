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
            showTicketContainer: false,
            ticketData: '',
            formData: {
                step1: {},
                step2: '',
                step3: '',
                step4: '',
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
            this.showTicketContainer = true;
            // Now you can access all the compiled data from this.formData
            console.log('Final form data:', this.formData);
            this.generateTicket();
        },
        markdownScrubbing(string_data){//currently this finds any '#' characters and adds a space to them so it looks like '# ' so it doesn't try to link the following data and says a normal '#'
            let characters_to_adjust = new RegExp(/#/g);
            return string_data.replaceAll(characters_to_adjust, "$& ");
        },
        generateTicket(){
            this.ticketData = `**LOCATION:**
**Bug Submission:**
Reporting Tech:
${this.formData.step1.tech}

Store:
${this.formData.step1.store}

Store ID:
${this.formData.step1.store_id}

System Area:
${this.formData.step1.area}

Can you recreate the problem on your demo site or Customers Site?
${this.formData.step1.replicable}

` +

(this.formData.step1.where ? this.formData.step1.where.toString() : ``)

+ `

STEPS TO REPRODUCE:
${this.formData.step2}

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:
${this.markdownScrubbing(this.formData.step3)}

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${this.markdownScrubbing(this.formData.step5.examples)}

Screenshot:
${this.formData.step4.images}

Video:
${this.formData.step4.videos}

Expected Results:

CONSOLE ERRORS:
\`\`\`
${this.formData.step5.errors}
\`\`\`
`;
        }
    }
});
window.BugTicketV2 = BugTicketV2.mount('#bug-ticket-v2');