/**
 * @module dnsCtrl
 * @description Controller for the DNS Help Tool
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import flowCtrlApp from '../../common/flow-format/flow-ctrl-app.js';
import errorCtrl from '../../modules/error-popup/errorCtrl.js';
import ticketDataCtrl from '../../modules/copy-data/ticketDataCtrl.js';
import addRecords from './add-records.js';
import correctRecords from './correct-records.js';
import removeRecords from './remove-records.js';
import recordEditor from './record-editor.js';
import { textInputComponent } from '../../components/text-input/text-input-component.js';
import { optionPickerComponent } from '../../components/option-picker/option-picker-component.js';

const dnsHelp = createApp({
    components: {
        flowCtrlApp,
        errorCtrl,
        ticketDataCtrl,
        addRecords,
        correctRecords,
        removeRecords,
        recordEditor,
        textInputComponent,
        optionPickerComponent,
    },
    data() {
        return {
            current_step: 1,
            ticketData: '',
            domain: '',
            addRecordList: [],
            correctRecordList: [],
            removeRecordList: [],
            actionOptions: ['Add Record(s)', 'Correct Existing Record(s)', 'Remove Record(s)'],
            actionsList: [],
            currentRecord: {},
            updateRecordCallback: null,//used to assign the correct callback function to the record editor
            isCorrection: false,
            showRecordEditor: false
        }
    },
    mounted() {
        if (location.search === '?test' || location.hostname === 'localhost') {
            this.domain = 'test.com';
            this.actionsList = [...this.actionOptions];
        }
    },
    methods: {
        updateDomainValue(value){
            try {
                this.domain = value;
            } catch (error) {
                console.error('Failed to update Domain', error);
            }
        },
        updateSelectedActions(value){
            try {
                this.actionsList = value;
            } catch (error) {
                console.error('Failed to update Selected Actions', error);
            }
        },
        //Add Records Functions
        addNewAddRecord(record){
            this.addRecordList.push(record);
        },
        deleteAddRecord(id){
            this.addRecordList = this.addRecordList.filter(record => record.id !== id);
        },
        removeAddRow(){
            this.addRecordList.pop();
        },
        openAddRecordEditor(id){
            this.currentRecord = this.addRecordList.find(record => record.id === id);
            this.updateRecordCallback = this.updateAddRecord;
            this.showRecordEditor = true;
        },
        //Correct Records Functions
        addNewCorrectRecord(record){
            this.correctRecordList.push(record);
        },
        deleteCorrectRecord(id){
            this.correctRecordList = this.correctRecordList.filter(record => record.id !== id);
        },
        removeCorrectRow(){
            this.correctRecordList.pop();
        },
        openCorrectRecordEditor(id){
            this.currentRecord = this.correctRecordList.find(record => record.id === id);
            this.isCorrection = true;
            this.updateRecordCallback = this.updateCorrectRecord;
            this.showRecordEditor = true;
        },
        //Remove Records Functions
        addNewRemoveRecord(record){
            this.removeRecordList.push(record);
        },
        deleteRemoveRecord(id){
            this.removeRecordList = this.removeRecordList.filter(record => record.id !== id);
        },
        removeRemoveRow(){
            this.removeRecordList.pop();
        },
        openRemoveRecordEditor(id){
            this.currentRecord = this.removeRecordList.find(record => record.id === id);
            this.updateRecordCallback = this.updateRemoveRecord;
            this.showRecordEditor = true;
        },
        closeRecordEditor() {
            this.currentRecord = {};
            this.isCorrection = false;
            this.showRecordEditor = false;
        },
        //Update Record Functions
        updateRecord(record) {
            this.updateRecordCallback(record);
            this.closeRecordEditor();
        },
        updateAddRecord(record) {
            let index = this.addRecordList.findIndex(r => r.id === record.id);
            if(index !== -1){
                this.addRecordList[index] = { ...record };
            }
        },
        updateCorrectRecord(record) {
            let index = this.correctRecordList.findIndex(r => r.id === record.id);
            if(index !== -1){
                this.correctRecordList[index] = { ...record };
            }
        },
        updateRemoveRecord(record) {
            let index = this.removeRecordList.findIndex(r => r.id === record.id);
            if(index !== -1){
                this.removeRecordList[index] = { ...record };
            }
        },
        //Handle Next Step Functions
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
                    let error_list = {};
                    if (!(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(this.domain)) {
                        error_list.domain = 'Domain is invalid';
                    }

                    if (!this.actionsList) {
                        error_list.action_type = 'At least one action type is required';
                    }
                    let record_errors = this.checkRecords();
                    error_list = {...error_list, ...record_errors};
                    if(Object.keys(error_list).length > 0){
                        validation_result = {success: false, data: error_list};
                    } else {
                        validation_result = {success: true};
                    }
                    break;
                case 2:
                    validation_result = this.checkRecords()
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
        checkRecords() {
            let error_list = {};
            if (this.actionsList.includes('Add Record(s)')) {
                if (!this.addRecordList.length) {
                    error_list['add_record'] = 'Please add at least one record to the add records section.';
                }
                for (let record of this.addRecordList) {
                    if (!record.type) {
                        error_list['add_record'] = 'Make sure all records to add are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            if (this.actionsList.includes('Correct Existing Record(s)')) {
                if (!this.correctRecordList.length) {
                    error_list['correct_record'] = 'Please add at least one record to the correct records section.';
                }
                for (let record of this.correctRecordList) {
                    if (!record.type) {
                        error_list['correct_record'] = 'Make sure all records to correct are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            if (this.actionsList.includes('Remove Record(s)')) {
                if (!this.removeRecordList.length) {
                    error_list['remove_record'] = 'Please add at least one record to the remove records section.';
                }
                for (let record of this.removeRecordList) {
                    if (!record.type) {
                        error_list['remove_record'] = 'Make sure all records to remove are filled out, or remove empty rows.';
                        break;
                    }
                }
            }
            return error_list;
        },
        resetTicket(){
            location.reload();
        },
        compileRecords(){
            this.ticketData = `DNS Record Changes
Domain: ${this.domain}

`;
            if (this.actionsList.includes('Add Record(s)')) {
                this.ticketData += `-----Records to be Added-----

`;
                for (let record of this.addRecordList) {
                    this.ticketData += `Record #${record.id}
Record Type: ${record.type}
Name: ${record.name}
Value: ${record.value}
TTL: ${record.ttl}

`;
                }
            }
            if (this.actionsList.includes('Correct Existing Record(s)')) {
                this.ticketData += `-----Records to be Corrected-----

`;
                for (let record of this.correctRecordList) {
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
            if (this.actionsList.includes('Remove Record(s)')) {
                this.ticketData += `-----Records to be Removed-----

`;
                for (let record of this.removeRecordList) {
                    this.ticketData += `Record #${record.id}
Record Type: ${record.type}
Name: ${record.name}
Value: ${record.value}
TTL: ${record.ttl}

`;
                }
            }
        },
    }
});

window.dnsHelp = dnsHelp.mount('#dns-help');
