export default {
    name: 'validate-step-1',
    template: `
    <div id="basic-data" data="1"  :class="{active: step === 1, complete: step > 1}">
        Store ID<br>
        <input id="crm" type="text" placeholder="Enter a CRM" v-model="storeID" />
        <br>
        Type of work to be done<br>
        <div choice-selector>
            <div 
                v-for="option in workOptions" 
                :key="option.value"
                :class="{ 'selected': workType === option.value }"
                @click="workType = option.value"
                class="work-option"
            >
                {{ option.label }}
            </div>
        </div>
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
            workType: '',
            workOptions: [
                { value: 'site', label: 'Site Work' },
                { value: 'template', label: 'Template Work' }
            ]
        }
    },
    methods: {
        validateStep1(resolve){
            let error_list = {};
            if(this.storeID === '' || !(/^(?:[Cc][Rr][Mm])?\d{3,}$/).test(this.storeID)){
                error_list['storeID'] = 'Please enter a valid CRM {(crm)12381}';
            }
            if (this.workType === ''){
                error_list['workType'] = 'Please enter a work type.';
            }
            if (Object.keys(error_list).length > 0){
                resolve({success: false, data: error_list});
            } else {
                resolve({success: true, data: {storeID: this.storeID, workType: this.workType}});
            }
        }
    }
}