export default {
    name: 'validate-template-work',
    template: `
    <div id="template" :class="{
        active: step === 2 && workType === 'template',
        complete: step > 2 && workType === 'template',
        'in-active': step < 2 || workType !== 'template'
    }">
        <h2>Template Update/Responsive Upgrade:</h2>
        <div>
            Update Type: <select tabindex="-1" v-model="type">
                <option disabled value="">Select an Option</option>
                <option value="Template Change">Template Change</option>
                <option value="Responsive Upgrade">Responsive Upgrade</option>
            </select><br>
            Template Number: <input tabindex="-1" id="number" placeholder="Template Number or Name" v-model="number"><br>
            Template CRM: <input tabindex="-1" placeholder="Template CRM ID" v-model="crm">
        </div>
        <div>
            Customer Request Notes:<textarea tabindex="-1" placeholder="Any notes about changes being made. Colors they want, fonts, etc." v-model="notes"></textarea>
        </div>
    </div>`,
    props: {
        step: {
            type: Number,
            required: true
        },
        workType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            type: '',
            number: '',
            crm: '',
            notes: ''
        }
    },
    methods: {
        validateData(resolve){
            let error_list = {};
            if(this.type === ''){
                error_list['type'] = 'Please select an update type.';
            }
            if(this.number === ''){
                error_list['number'] = 'Please enter a template number or name.';
            }
            if(this.crm === ''){
                error_list['crm'] = 'Please enter a template CRM ID.';
            }
            if(this.notes === ''){
                error_list['notes'] = 'Please enter any notes about changes being made.';
            }
            if(Object.keys(error_list).length > 0){
                resolve({success: false, data: error_list});
            } else {
                resolve({success: true, data: {type: this.type, number: this.number, crm: this.crm, notes: this.notes}});
            }
        }
    }
}