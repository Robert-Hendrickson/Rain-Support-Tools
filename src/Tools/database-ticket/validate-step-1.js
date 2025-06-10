/**
 * @module this validates the data for step 1 of the database ticket tool
 */
export default {
    name: 'validate-step-1',
    template: `
    <div id="company-content" data="1" :class="{active: step === 1, complete: step > 1}">
        Business Name:<br>
        <input v-model="businessName" type="text" id="businessName" placeholder="Name of Company" />
        CRM:<br>
        <input v-model="storeID" type="text" id="storeID" placeholder="Store CRM" />
        Vertical:
        <select v-model="vertical" id="vertical">
            <option disabled selected value="">Select an Option</option>
            <option v-for="vertical in vertical_list" :value="vertical">{{ vertical }}</option>
        </select>
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
        }
    }
}