/**
 * @module this controls the database ticket tool
 * @requires ../../common/flow-format/flow-ctrl-app.js
 * @requires ../../modules/error-popup/errorCtrl.js
 * @requires ../../modules/copy-data/ticketDataCtrl.js
 * @requires ./validate-step-1.js
 * @requires ./validate-step-2.js
 * @requires ./validate-step-3.js
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import flowCtrlApp from '../../common/flow-format/flow-ctrl-app.js';
import errorCtrl from '../../modules/error-popup/errorCtrl.js';
import ticketDataCtrl from '../../modules/copy-data/ticketDataCtrl.js';
import validateStep1 from './validate-step-1.js';
import validateStep2 from './validate-step-2.js';
import validateStep3 from './validate-step-3.js';
let database_ticket = createApp({
    name: 'database-ticket',
    components: {
        //'nav-menu': '/Rain-Support-Tools/src/common/navigation/nav-menu.js',
        flowCtrlApp,
        errorCtrl,
        ticketDataCtrl,
        validateStep1,
        validateStep2,
        validateStep3
    },
    data() {
        return {
            current_step: 1,
            ticket_data: {
                businessName: '',
                storeID: '',
                vertical: '',
                details: '',
                salesforce_ticket_id: '',
                shortcut_story_link: '',
                approving_agent_name: '',
                approval_reason: '',
            },
            ticketData: ''
        }
    },
    methods: {
        async validateStepData(step, resolve){
            let validation_result;
            //make sure error growl is empty
            this.$refs.errorCtrl.closeErrorDisplay();
            switch(step){
                case 1:
                    validation_result = await new Promise((result) => this.$refs.validateStep1.validateStep1(result));
                    if (validation_result.success){
                        for (let key in validation_result.data){
                            this.ticket_data[key] = validation_result.data[key];
                        }
                    }
                    break;
                case 2:
                    validation_result = await new Promise((result) => this.$refs.validateStep2.validateStep2(result));
                    if (validation_result.success){
                        for (let key in validation_result.data){
                            this.ticket_data[key] = validation_result.data[key];
                        }
                    }
                    break;
                case 3:
                    validation_result = await new Promise((result) => this.$refs.validateStep3.validateStep3(result));
                    if (validation_result.success){
                        for (let key in validation_result.data){
                            this.ticket_data[key] = validation_result.data[key];
                        }
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
        handleNextStep(step){
            this.current_step = step;
        },
        handlePreviousStep(step){
            this.current_step = step;
        },
        handleFinish(){
            this.ticketData = `**Data Fix**
**Company Info**
Business Name:
${this.ticket_data.businessName}

Store ID:
${this.ticket_data.storeID}

Store Vertical:
${this.ticket_data.vertical}

**Connected Bug**
Salesforce Ticket ID:
${this.ticket_data.salesforce_ticket_id}

Shortcut Story Link:
${this.ticket_data.shortcut_story_link}

**Case Info**
Approving Team Lead's Name:
${this.ticket_data.approving_agent_name}

Ticket Approval Reason:
${this.ticket_data.approval_reason}

**Fix Details**
Details:
${this.ticket_data.details}
`;
            console.log(this.ticket_data_string);
            this.$refs.ticketDataCtrl.showTicketContainer = true;
        },
        handleResetTicket(){
            location.reload();
        }
    }
});

database_ticket.mount('#database-ticket');