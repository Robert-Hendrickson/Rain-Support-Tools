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
            console.log('finish');
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
                    validation_result = await new Promise(resolve => this.$refs.step2.getData(resolve));
                    if(validation_result.success){
                        this.ticket_data.add_record = [...validation_result.data.add_record];
                        this.ticket_data.correct_record = [...validation_result.data.correct_record];
                        this.ticket_data.remove_record = [...validation_result.data.remove_record];
                    }
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
        }
    }
});

window.dnsHelp = dnsHelp.mount('#dns-help');