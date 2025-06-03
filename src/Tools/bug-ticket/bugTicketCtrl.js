/**
 * @module bug-ticket-v2
 * @description This module is used to generate bug tickets for the Rain Support Team.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import cookieCtrl from '/Rain-Support-Tools/src/common/ctrl/cookie_ctrl.js';
//import component pieces
import flowCtrlApp from '/Rain-Support-Tools/src/common/flow-format/flow-ctrl-app.js';
import pastTicketsCtrl from './past-tickets.js';
import validateStep1 from './validate-step-1.js';
import validateStep2 from './validate-step-2.js';
import validateStep3 from './validate-step-3.js';
import validateStep4 from './validate-step-4.js';
import validateStep5 from './validate-step-5.js';
const BugTicketV2 = createApp({
    components: {
        //'nav-menu': () => import('/Rain-Support-Tools/src/common/navigation/nav-menu.js'),
        pastTicketsCtrl,
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
            console.log(validation_result.data);
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
        markdownScrubbing(string_data){//currently this finds any '#' characters and adds a space to them so it looks like '# ' so it doesn't try to link the following data and says a normal '#'
            let characters_to_adjust = new RegExp(/#/g);
            return string_data.replaceAll(characters_to_adjust, "$& ");
        },
        addTableRow(table){
            let row_label;//switch statement finds the correct row label
            switch(table) {
                case 'steps-table':
                    row_label = 'Step';
                    break;
                case 'screenshot-table':
                    row_label = 'Image';
                    break;
                case 'video-table':
                    row_label = 'Video';
                    break;
                default:
                    console.error('Something went wrong. Passed table type was not of an expected value: ' + table);
            }
            //finds what row is being added by how many already exist
            let new_row_number = document.querySelectorAll(`#${table} tbody tr`).length + 1;
            //create a new table row and append it to the table
            try{
                document.querySelector(`#${table} tbody`).insertAdjacentHTML('beforeend', `<tr><td>${row_label} ${new_row_number}<input placeholder="Enter ${row_label} ${new_row_number}" type="text" /></td></tr>`);
            }catch(error){
                console.error(`Error adding table row: ${table}`, error);
            }
        },
        removeTableRow(table){
            try{
                document.querySelector(`#${table} tbody tr:last-child`).remove();
            }catch(error){
                console.error(`Error removing table row: ${table}`, error);
            }
        },
        generateTicket(data){
            this.ticketData = `**LOCATION:**
**Bug Submission:**
Reporting Tech:
${data.step1.tech}

Store:
${data.step1.store}

Store ID:
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
            this.showTicketContainer = true;
        }
    },
    mounted() {
        // Listen for SharePoint upload completion
        document.addEventListener('sharepoint-upload-complete', (e) => {
            for (let i = 0; i < e.detail.links.length; i++) {
                if (e.detail.links[i].includes(":i:")) {
                    this.addTableRow('screenshot-table');
                    document.querySelector('#screenshot-table tbody tr:last-child td:last-child input').value = e.detail.links[i];
                }
                if (e.detail.links[i].includes(":v:")) {
                    this.addTableRow('video-table');
                    document.querySelector('#video-table tbody tr:last-child td:last-child input').value = e.detail.links[i];
                }
            }
        });
    }
});
window.BugTicketV2 = BugTicketV2.mount('#bug-ticket-v2');