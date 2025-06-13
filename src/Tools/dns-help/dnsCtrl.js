/**
 * @module dnsCtrl
 * @description Controller for the DNS Help Tool
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import flowCtrlApp from '../../common/flow-format/flow-ctrl-app.js';
import errorCtrl from '../../modules/error-popup/errorCtrl.js';
import ticketDataCtrl from '../../modules/copy-data/ticketDataCtrl.js';
import step1 from './step-1.js';
import addRecords from './add-records.js';
import correctRecords from './correct-records.js';
import removeRecords from './remove-records.js';
import recordEditor from './record-editor.js';

const dnsHelp = createApp({
    components: {
        flowCtrlApp,
        errorCtrl,
        ticketDataCtrl,
        step1,
        addRecords,
        correctRecords,
        removeRecords,
        recordEditor
    },
    data() {
        return {
            current_step: 1,
            ticketData: '',
            domain: '',
            add_record: [],
            correct_record: [],
            remove_record: [],
            actions: {
                add_record: false,
                correct_record: false,
                remove_record: false
            },
            currentRecord: {},
            callBack: null,
            isCorrection: false,
            showRecordEditor: false
        }
    },
    methods: {
        handleNextStep(step){
            this.current_step = step;
        },
        handlePreviousStep(step){
            this.current_step = step;
        },
        handleFinish(){
            this.compileRecords();
            this.$refs.ticketDataCtrl.showTicketContainer = true;
        },
        async validateStepData(step, resolve){
            this.$refs.errorCtrl.closeErrorDisplay();
            let validation_result;
            switch(step){
                case 1:
                    validation_result = await new Promise(resolve => this.$refs.step1.validateData(resolve));
                    if(validation_result.success){
                        this.domain = validation_result.data.domain;
                    }
                    break;
                case 2:
                    validation_result = this.checkRecords()
                    break;
                case 3:
                    validation_result = {success: true}
                    break;
                default:
                    break;
            }
            if(!validation_result.success && validation_result.data){
                this.$refs.errorCtrl.updateErrorObject(validation_result.data);
            }
            resolve(validation_result.success);
        },
        checkRecords(){
            let error_list = {};
            if(this.actions.add_record){
                if(this.add_record.length === 0){
                    error_list['add_record'] = 'Please add at least one record to the add records section.';
                }
                for(let record of this.add_record){
                    if(record.type === ''){
                        error_list['add_record'] = 'Make sure all records to add are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            if(this.actions.correct_record){
                if(this.correct_record.length === 0){
                error_list['correct_record'] = 'Please add at least one record to the correct records section.';
                }
                for(let record of this.correct_record){
                    if(record.type === ''){
                        error_list['correct_record'] = 'Make sure all records to correct are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            if(this.actions.remove_record){
                if(this.remove_record.length === 0){
                    error_list['remove_record'] = 'Please add at least one record to the remove records section.';
                }
                for(let record of this.remove_record){
                    if(record.type === ''){
                        error_list['remove_record'] = 'Make sure all records to remove are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            if(Object.keys(error_list).length > 0){
                return {success: false, data: error_list};
            }
            return {success: true};
        },
        openRecordEditor(record, isCorrection, callBack){
            this.currentRecord = { ...record };
            this.isCorrection = isCorrection;
            this.callBack = callBack;
            this.showRecordEditor = true;
        },
        closeRecordEditor(){
            this.currentRecord = {};
            this.isCorrection = false;
            this.callBack = null;
            this.showRecordEditor = false;
        },
        updateRecord(){
            this.callBack(this.currentRecord, this.isCorrection);
            this.closeRecordEditor();
        },
        resetTicket(){
            location.reload();
        },
        compileRecords(){
            this.ticketData = `DNS Record Changes
Domain: ${this.domain}

`;
            if(this.actions.add_record){
                this.ticketData += `-----Records to be Added-----

`;
                for(let record of this.add_record){
                    this.ticketData += `Record #${record.id}
Record Type: ${record.type}
Name: ${record.name}
Value: ${record.value}
TTL: ${record.ttl}

`;
                }
            }
            if(this.actions.correct_record){
                this.ticketData += `-----Records to be Corrected-----

`;
                for(let record of this.correct_record){
                    this.ticketData += `Record #${record.id}
**Original Values**
Record Type: ${record.type}
Name: ${record.name}
Value: ${record.value}
TTL: ${record.ttl}

**New Values**
Record Type: ${record.newType}
Name: ${record.newName}
Value: ${record.newValue}
TTL: ${record.newTtl}

`;
                }
            }
            if(this.actions.remove_record){
                this.ticketData += `-----Records to be Removed-----

`;
                for(let record of this.remove_record){
                    this.ticketData += `Record #${record.id}
Record Type: ${record.type}
Name: ${record.name}
Value: ${record.value}
TTL: ${record.ttl}

`;
                }
            }
        }
    }
});

window.dnsHelp = dnsHelp.mount('#dns-help');