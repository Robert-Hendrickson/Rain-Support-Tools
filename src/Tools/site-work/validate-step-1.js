import { textInputComponent } from "../../components/text-input/text-input-component.js"
import { optionPickerComponent } from "../../components/option-picker/option-picker-component.js"
export default {
    name: 'validate-step-1',
    components: {
        textInputComponent,
        optionPickerComponent,
    },
    template: `
    <div id="basic-data" data="1"  :class="{active: step === 1, complete: step > 1}">
        <text-input-component
            label="Store ID"
            id="crm"
            placeholder="Enter a CRM"
            :value="this.storeID"
            @updateValue="updateStoreID"
        />
        <option-picker-component
            label="Type of work to be done"
            id="workType"
            :options="workOptions"
            :value="workType"
            @updateValue="updateWorkType"
        />
    </div>`,
    props: {
        step: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            storeID: '',
            workType: [],
            workOptions: ['Site Work' , 'Template Work']
        }
    },
    mounted (){
        if (location.host == 'localhost' || location.search == '?test') {
            this.storeID = '6085';
            this.workType = ['Site Work'];
        }
    },
    methods: {
        validateStep1(resolve){
            let error_list = {};
            if(this.storeID === '' || !(/^(?:[Cc][Rr][Mm])?\d{2,}$/).test(this.storeID)){
                error_list['storeID'] = 'Please enter a valid CRM {(crm)12381}';
            }
            if (!this.workType.length){
                error_list['workType'] = 'Please choose a work type.';
            }
            if (Object.keys(error_list).length > 0){
                resolve({success: false, data: error_list});
            } else {
                resolve({success: true, data: {storeID: this.storeID, workType: this.workType}});
            }
        },
        updateStoreID(value) {
            this.storeID = value;
        },
        updateWorkType(value) {
            this.workType = value;
        },
    }
}
