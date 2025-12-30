import { textareaComponent } from "../../components/textarea/textarea-component.js";
export default {
    name: 'validate-step-3',
    components: {
        textareaComponent,
    },
    props: {
        step: {
            type: Number,
            required: true
        }
    },
    template: `
    <div id="details-content" data="3" :class="{active: step === 3, complete: step > 3, 'in-active': step < 3}">
        Details:<br>
        <p class="warning-text">
            What specific changes are needed? We need dates, transaction ids, every piece of data that needs to be changed. Also, if we're working with transactions, does inventory need to be updated with the development changes?<br><br>
            If there is not enough information for us to know what needs done without needing to ask you further questions your ticket will be rejected!
        </p>
        <textarea-component
            placeholder="Details for Dev"
            :value="this.details"
            :tabindex="tabIndexEnabled"
            @updateValue="handleDetailsUpdate"
        />
    </div>`,
    data() {
        return {
            details: ''
        }
    },
    computed: {
        testData () {
            return location.host === 'localhost' || location.search === '?test'
        },
        tabIndexEnabled () {
            return this.$props.step === 3 ? 0 : -1;
        },
    },
    mounted() {
        if (this.testData) {
            this.details = 'Consignment ID 12345678 needs to be updated so that it has a correct status.';
        }
    },
    methods: {
        async validateStep3(resolve){
            if (this.details.length < 40){
                resolve({success: false, data: {details: "Not enough Details! Make sure to include all area's that are needing adjusted and include all id's so that nothing needs to be hunted down."}});
            } else {
                resolve({success: true, data: {details: this.details}});
            }
        },
        handleDetailsUpdate(value) {
            this.details = value;
        },
    }
}