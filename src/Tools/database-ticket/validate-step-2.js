import { textInputComponent } from "../../components/text-input/text-input-component.js";
import { textareaComponent } from "../../components/textarea/textarea-component.js";
export default {
    name: 'validate-step-2',
    components: {
        textInputComponent,
        textareaComponent,
    },
    template: `
    <div id="associated-info-content" data="2" :class="{active: step === 2, complete: step > 2, 'in-active': step < 2}">
        <div id="associated-ticket">
            <h2>Associated Bug Ticket (If applicable)</h2>
            <p class="warning-text">
                This data should only be filled out if there is a bug ticket. Please don't put id's or links for the database ticket.
            </p>
            <text-input-component
                placeholder="Ticket Number"
                label="Salesforce Ticket ID:"
                id="SFID"
                :value="this.salesforce_ticket_id"
                :tabindex="tabIndexEnabled"
                @updateValue="handleSFIDUpdate"
            />
            <text-input-component
                placeholder="URL"
                label="Shortcut Story Link:"
                id="shortcutLink"
                :value="this.shortcut_story_link"
                :tabindex="tabIndexEnabled"
                @updateValue="handleShortcutUpdate"
            />
        </div>
        <div id="ticket-reason">
            <h2>Other Info</h2>
            <text-input-component
                placeholder="Team Lead Name"
                label="Name of Team Lead who approved:"
                id="approver"
                :value="this.approving_agent_name"
                :tabindex="tabIndexEnabled"
                @updateValue="handleApproverUpdate"
            />
            Reason for Approval:
            <p class="warning-text">
                This field should ONLY list the reason for the ticket being approved by a team lead.
            </p>
            <textarea-component
                placeholder="Reason for Data Fix"
                :value="this.approval_reason"
                :tabindex="tabIndexEnabled"
                @updateValue="handleReasonUpdate"
            />
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
            salesforce_ticket_id: '',
            shortcut_story_link: '',
            approving_agent_name: '',
            approval_reason: '',
        }
    },
    computed: {
        testData () {
            return location.host === 'localhost' || location.search === '?test'
        },
        tabIndexEnabled () {
            return this.$props.step === 2 ? 0 : -1;
        },
    },
    mounted() {
        if (this.testData) {
            this.salesforce_ticket_id = '123456789';
            this.shortcut_story_link = 'https://app.shortcut.com/rainretail/story/310515';
            this.approving_agent_name = 'Robert Hendrickson';
            this.approval_reason = 'The customer is escalated over the issue.';
        }
    },
    methods: {
        isNA(string) {
            return (/^n[\/\s]?a$/i).test(string.trim());
        },
        async validateStep2(resolve){
            let bad_data_list = {};
            //add fields to bad_data_list if they are not valid
            if (this.salesforce_ticket_id != '' && !(/^\d+$/).test(this.salesforce_ticket_id)){
                bad_data_list['salesforce_ticket_id'] = 'Please enter the associated bug ticket ID.';
            }
            if (this.shortcut_story_link != '' && !(/^https:\/\/app\.shortcut\.com\/rainretail\/story\/\d+/).test(this.shortcut_story_link)){
                bad_data_list['short_story_link'] = 'Shortcut link should either be the Shortcut Story Link from the Parent Case in Salesforce or Empty.';
            }
            if (this.isNA(this.approving_agent_name) || !(/^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/).test(this.approving_agent_name)){
                bad_data_list['approving_agent_name'] = 'Please enter the name of the team lead who approved.(First Last)';
            }
            if (this.approval_reason.length < 40){
                bad_data_list['approval_reason'] = 'Please enter the reason for the ticket being approved.';
            }
            if (Object.entries(bad_data_list).length){
                resolve({success: false, data: bad_data_list});
            } else {
                resolve({success: true, data: {salesforce_ticket_id: this.salesforce_ticket_id, shortcut_story_link: this.shortcut_story_link, approving_agent_name: this.approving_agent_name, approval_reason: this.approval_reason}});
            }
        },
        handleSFIDUpdate(value) {
            this.salesforce_ticket_id = value;
        },
        handleShortcutUpdate(value) {
            this.short_story_link = value;
        },
        handleApproverUpdate(value) {
            this.approving_agent_name = value;
        },
        handleReasonUpdate(value) {
            this.approval_reason = value;
        },
    }
}