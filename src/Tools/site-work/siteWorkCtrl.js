/**
 * @description This controls the site work tool.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import flowCtrlApp from '../../common/flow-format/flow-ctrl-app.js';
import errorCtrl from '../../modules/error-popup/errorCtrl.js';
import ticketDataCtrl from '../../modules/copy-data/ticketDataCtrl.js';
import validateStep1 from'./validate-step-1.js';
import validateSiteWork from'./validate-site-work.js';
import validateTemplateWork from'./validate-template-work.js';
const siteWorkCtrl = createApp({
    components: {
        flowCtrlApp,
        errorCtrl,
        ticketDataCtrl,
        validateStep1,
        validateSiteWork,
        validateTemplateWork
    },
    data() {
        return {
            currentStep: 1,
            workType: '',
            storeID: '',
            siteWorkInfo: [],
            templateWorkInfo: {},
            ticketData: ''
        }
    },
    methods: {
        handleResetTicket(){
            location.reload();
        },
        handleNextStep(step){
            this.currentStep = step;
        },
        handlePreviousStep(step){
            this.currentStep = step;
        },
        handleFinish(){
            this.ticketData = `**Store Information**
Store ID: ${this.storeID}
Work Type: ${this.workType}
`;
            if(this.workType === 'Site Work'){
                this.ticketData += `**Site Work Details**
${this.siteWorkInfo.map(row => `**Page ${row.page}**
Type: 
${row.type}

URL: 
${row.url}

Screenshot: 
${row.screenshot}

Video: 
${row.video}

Details: 
${row.details}`).join('\n\n')}`;
            }
            if(this.workType === 'Template Work'){
                this.ticketData += `**Template Work Details**
Update Type: 
${this.templateWorkInfo.type}

Template Number: 
${this.templateWorkInfo.number}

Template CRM: 
${this.templateWorkInfo.crm}

Customer Notes: 
${this.templateWorkInfo.notes}`;
            }
            this.$refs.ticketDataCtrl.showTicketContainer = true;
        },
        async validateStepData(step, resolve){
            this.$refs.errorCtrl.closeErrorDisplay();
            let validation_result;
            switch(step){
                case 1:
                    validation_result = await new Promise((result) => this.$refs.validateStep1.validateStep1(result));
                    if (validation_result.success){
                        this.storeID = validation_result.data.storeID;
                        this.workType = validation_result.data.workType[0];
                    }
                    break;
                case 2:
                    if(this.workType === 'Site Work'){
                        validation_result = await new Promise((result) => this.$refs.validateSiteWork.validateData(result));
                        if (validation_result.success){
                            this.siteWorkInfo = [...validation_result.data];
                        }
                    }
                    if(this.workType === 'Template Work'){
                        validation_result = await new Promise((result) => this.$refs.validateTemplateWork.validateData(result));
                        if (validation_result.success){
                            this.templateWorkInfo = {...validation_result.data};
                        }
                    }
                    if(validation_result.success){
                        this.ticketPreview();
                    }
                    break;
                case 3:
                    validation_result = {success: true};
                    break;
                default:
                    break;
            }
            if(!validation_result.success && validation_result.data){
                this.$refs.errorCtrl.updateErrorObject(validation_result.data);
            }
            resolve(validation_result.success);
        },
        ticketPreview(){
            let html = '<div class="ticket-preview">';
            
            // Step 1 Data
            html += `<div class="ticket-section">
                <h3>Store Information</h3>
                <p><strong>Store ID:</strong> ${this.storeID || 'Not provided'}</p>
                <p><strong>Work Type:</strong> ${this.workType || 'Not selected'}</p>
            </div>`;

            // Step 2 Data based on work type
            if (this.workType === 'Site Work') {
                html += `<div class="ticket-section">
                    <h3>Site Work Details</h3>`;
                this.siteWorkInfo.forEach((row, index) => {
                    html += `<div class="work-item">
                        <h4>**Page ${index + 1}**</h4>
                        <p><strong>Type:</strong> ${row.type || 'Not selected'}</p>
                        <p><strong>URL:</strong> ${row.url || 'Not provided'}</p>
                        <p><strong>Screenshot:</strong> ${row.screenshot || 'Not provided'}</p>
                        <p><strong>Video:</strong> ${row.video || 'Not provided'}</p>
                        <p><strong>Details:</strong> ${row.details || 'Not provided'}</p>
                    </div>`;
                });
                html += '</div>';
            } else if (this.workType === 'Template Work') {
                html += `<div class="ticket-section">
                    <h3>Template Work Details</h3>
                    <p><strong>Update Type:</strong> ${this.templateWorkInfo.type || 'Not selected'}</p>
                    <p><strong>Template Number:</strong> ${this.templateWorkInfo.number || 'Not provided'}</p>
                    <p><strong>Template CRM:</strong> ${this.templateWorkInfo.crm || 'Not provided'}</p>
                    <p><strong>Customer Notes:</strong> ${this.templateWorkInfo.notes || 'Not provided'}</p>
                </div>`;
            } else {
                html += `<div class="ticket-section">
                    <p>No work type selected</p>
                </div>`;
            }

            html += '</div>';
            document.getElementById('confirm-content').innerHTML = html;
        },
    }
});
siteWorkCtrl.mount('#site-work-container');
