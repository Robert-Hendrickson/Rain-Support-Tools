/**
 * @module bug-ticket-v2
 * @description This module is used to generate bug tickets for the Rain Support Team.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
//import component pieces
import flowCtrlApp from '/Rain-Support-Tools/src/common/flow-format/flow-ctrl-app.js';
import pastTicketsCtrl from './past-tickets.js';
import brandSelector from '/Rain-Support-Tools/src/modules/brand-selector/brand-selector.js';
import validateStep1 from './validate-step-1.js';
import validateStep2 from './validate-step-2.js';
import validateStep3 from './validate-step-3.js';
import validateStep4 from './validate-step-4.js';
import validateStep5 from './validate-step-5.js';
import errorCtrl from '/Rain-Support-Tools/src/modules/error-popup/errorCtrl.js';
import ticketDataCtrl from '/Rain-Support-Tools/src/modules/copy-data/ticketDataCtrl.js';
import bugQuestionTips from './bug-question-tips.js';
import feedBack from '/Rain-Support-Tools/src/modules/feedback/feedback.js';
const BugTicketV2 = createApp({
    components: {
        //'nav-menu': () => import('/Rain-Support-Tools/src/common/navigation/nav-menu.js'),
        pastTicketsCtrl,
        brandSelector,
        flowCtrlApp,
        validateStep1,
        validateStep2,
        validateStep3,
        validateStep4,
        validateStep5,
        errorCtrl,
        ticketDataCtrl,
        bugQuestionTips,
        feedBack
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
                step4: {},
                step5: {}
            }
        }
    },
    methods: {
        async validateStepData(step, resolve){
            let validation_result;
            //make sure error growl is empty
            this.$refs.errorCtrl.closeErrorDisplay();
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
            if(!validation_result.success && validation_result.data){
                this.$refs.errorCtrl.updateErrorObject(validation_result.data);
            }
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
            this.$refs.pastTicketsCtrl.saveTicket(this.formData);
            this.generateTicket(this.formData);
        },
        handleBrandSelector(brand_value){
            this.brand = brand_value;
        },
        markdownScrubbing(string_data){//currently this finds any '#' characters and adds a space to them so it looks like '# ' so it doesn't try to link the following data and says a normal '#'
            let characters_to_adjust = new RegExp(/#/g);
            return string_data.replaceAll(characters_to_adjust, "$& ");
        },
        generateTicket(data){
            this.ticketData = `**LOCATION:**
**Bug Submission:**
Reporting Tech:
${data.step1.tech}

Store:
${data.step1.store}

${this.brand === 'etailpet' ? 'Dashboard URL:' : 'Store ID:'}
${data.step1.store_id}

System Area:
${data.step1.area}

Can you recreate the problem on your demo site or Customers Site?
${data.step1.replicable}

` +

(data.step1.where ? data.step1.where.toString() : ``)

+ `

STEPS TO REPRODUCE:
${data.step2}

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:
${this.markdownScrubbing(this.formData.step3)}

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${this.markdownScrubbing(data.step5.examples)}

Screenshot:
${data.step4.images}

Video:
${data.step4.videos}

Expected Results:

CONSOLE ERRORS:
\`\`\`
${data.step5.errors}
\`\`\`
`;
            this.$refs.ticketDataCtrl.showTicketContainer = true;
        },
        handleReset(){
            window.location.reload();
        }
    },
    mounted() {
        // Listen for SharePoint upload completion
        document.addEventListener('sharepoint-upload-complete', (e) => {
            for (let i = 0; i < e.detail.links.length; i++) {
                if (e.detail.links[i].includes(":i:")) {
                    this.$refs.validateStep4.addTableRow('screenshot-table');
                    document.querySelector('#screenshot-table tbody tr:last-child td:last-child input').value = e.detail.links[i];
                }
                if (e.detail.links[i].includes(":v:")) {
                    this.$refs.validateStep4.addTableRow('video-table');
                    document.querySelector('#video-table tbody tr:last-child td:last-child input').value = e.detail.links[i];
                }
            }
        });
    }
});
window.BugTicketV2 = BugTicketV2.mount('#bug-ticket-v2');