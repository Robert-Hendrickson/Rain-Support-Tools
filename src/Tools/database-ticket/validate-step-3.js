export default {
    name: 'validate-step-3',
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
        <textarea v-model="details" tabindex="-1" id="details" placeholder="Details for Dev"></textarea>
    </div>`,
    data() {
        return {
            details: ''
        }
    },
    methods: {
        async validateStep3(resolve){
            if (this.details.length < 40){
                resolve({success: false, data: {details: "Not enough Details! Make sure to include all area's that are needing adjusted and include all id's so that nothing needs to be hunted down."}});
            } else {
                resolve({success: true, data: {details: this.details}});
            }
        }
    }
}