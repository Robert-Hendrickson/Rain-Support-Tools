/**
 * @module this validates the data for step 1 of the database ticket tool
 */
import { textInputComponent } from "../../components/text-input/text-input-component.js";
import { dropdownSelectComponent } from "../../components/dropdown-select/dropdown-select-component.js";
export default {
    name: 'validate-step-1',
    components: {
        textInputComponent,
        dropdownSelectComponent,
    },
    template: `
    <div id="company-content" data="1" :class="{active: step === 1, complete: step > 1}">
        <text-input-component
            placeholder="Name of Company"
            label="Business Name:"
            id="businessName"
            :value="this.businessName"
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            @updateValue="handleBusinessUpdate"
        />
        <text-input-component
            placeholder="Store CRM"
            label="CRM:"
            id="storeID"
            :value="this.storeID"
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            @updateValue="handleStoreIDUpdate"
        />
        <dropdown-select-component
            label="Vertical"
            id="vertical"
            :options="vertical_list"
            emptyOption="Select a Option"
            :value="this.vertical"
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            @updateValue="handleVerticalUpdate"
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
            vertical_list: ['Rain','Like Sew','Jewel','Music','Dive','Outdoor'],
            businessName: '',
            storeID: '',
            vertical: '',
        }
    },
    computed: {
        testData () {
            return location.host === 'localhost' || location.search === '?test'
        }
    },
    mounted() {
        if (this.testData) {
            this.businessName = "Experience Test Site";
            this.storeID = "CRM12381";
            this.vertical = "Rain";
        }
    },
    methods: {
        validateStep1(resolve){
            let bad_data_list = {};
            if (this.businessName === ''){
                bad_data_list['businessName'] = 'Please enter the name of the company.';
            }
            if (this.storeID === ''|| !(/^(?:crm)?\d{2,}$/i).test(this.storeID)){
                bad_data_list['storeID'] = 'Please enter the store CRM.';
            }
            if (this.vertical === ''){
                bad_data_list['vertical'] = 'Please select a vertical.';
            }
            if (Object.keys(bad_data_list).length > 0){
                resolve({success: false, data: bad_data_list});
            } else {
                resolve({success: true, data: {businessName: this.businessName, storeID: this.storeID, vertical: this.vertical}});
            }
        },
        handleBusinessUpdate(value) {
            this.businessName = value;
        },
        handleStoreIDUpdate(value) {
            this.storeID = value;
        },
        handleVerticalUpdate(value) {
            this.vertical = value;
        },
    }
}