import { dropdownSelectComponent } from '../../components/dropdown-select/dropdown-select-component.js'
import { textInputComponent } from '../../components/text-input/text-input-component.js'
import { textareaComponent } from '../../components/textarea/textarea-component.js'
export default {
    name: 'validate-template-work',
    components: {
        dropdownSelectComponent,
        textInputComponent,
        textareaComponent,
    },
    template: `
    <div id="template" :class="{
        active: step === 2 && workType === 'Template Work',
        complete: step > 2 && workType === 'Template Work',
        'in-active': step < 2 || workType !== 'Template Work'
    }">
        <h2>Template Update/Responsive Upgrade:</h2>
        <div>
            <dropdown-select-component
                label="Update Type:"
                id="templateWorkType"
                :options="templateTypeOptions"
                :value="this.type"
                :tabindex="tabIndex"
                emptyOption="Select an Option"
                @updateValue="updateTemplateWorkType"
            />
            <text-input-component
                placeholder="Template Number or Name"
                id="number"
                label="Template Number:"
                :value="this.number"
                :tabindex="tabIndex"
                @updateValue="updateTemplateNumber"
            />
            <text-input-component
                placeholder="Template CRM ID"
                id="templateCRM"
                label="Template CRM:"
                :value="this.crm"
                :tabindex="tabIndex"
                @updateValue="updateTemplateCRM"
            />
        </div>
        <div>
            <textarea-component
                label="Customer Request Notes:"
                id="templateNotes"
                placeholder="Any notes about changes being made. Colors they want, fonts, etc."
                resize="none"
                :value="this.notes"
                :tabindex="tabIndex"
                @updateValue="updateTemplateNotes"
            />
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
            templateTypeOptions: ['Template Change', 'Responsive Upgrade'],
            type: '',
            number: '',
            crm: '',
            notes: ''
        }
    },
    computed: {
        tabIndex() {
            return (this.$props.step === 2 && this.$props.workType === "Template Work") ? 0 : -1;
        },
    },
    mounted() {
        if (location.host == 'localhost' || location.search == '?test') {
            this.type = "Template Change";
            this.number = "110067";
            this.crm = "11607";
            this.notes = "Test notes";
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
        },
        updateTemplateWorkType(value) {
            try {
                this.type = value;
            } catch (error) {
                console.error('Failed to update Work Type');
            }
        },
        updateTemplateNumber(value) {
            try {
                this.number = value;
            } catch (error) {
                console.error('Failed to update Template Number');
            }
        },
        updateTemplateCRM(value) {
            try {
                this.crm = value;
            } catch (error) {
                console.error('Failed to update Template CRM');
            }
        },
        updateTemplateNotes(value) {
            try {
                this.notes = value;
            } catch (error) {
                console.error('Failed to update Work Notes');
            }
        },
    }
}
