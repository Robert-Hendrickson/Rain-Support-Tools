/**
 * @description This app searches for the error message in the textarea and adds the appropriate class to the results wrapper
 */
const salesforce_errors = Vue.createApp({
    template: `<div id="search-wrapper">
    <span class="fa-solid fa-magnifying-glass"></span>
    <textarea id="searchbar" placeholder="Paste error message here" @input="search"></textarea>
</div>
<div id="results">
    <div class="results-wrapper" id="no-contact" v-show="show_no_contact">
        <h2>No Contact Assigned</h2>
        <p>
            Issue is most often caused by missing a contact assigned to the case. Add a contact to the case, then continue with solving the case.
        </p>
    </div>
    <div class="results-wrapper" id="template-issue" v-show="show_template_issue">
        <h2>Template Issue</h2>
        <p>
            Issue is most often caused by expected values not matching. Check the following values in the case are correct from the list below.
            <ul>
                <li>Case Reason -> Software</li>
                <li>Case Issue -> Bug - Parent OR Bug - Incident</li>
                <li>Case Details -> Contain the string **Bug Submission:**</li>
            </ul>
        </p>
    </div>
    <div class="results-wrapper" id="default" v-show="show_default">
        <h2>Not Found</h2>
        <p>
            Error code not found in common results. Please seek further help.
        </p>
    </div>
</div>`,
    data(){
        return {
            show_no_contact: false,
            show_template_issue: false,
            show_default: false
        }
    },
    methods: {
        search(){
            //get error message from user
            let error_message = document.getElementById('searchbar').value;
            if(error_message === ''){
                this.show_no_contact = false;
                this.show_template_issue = false;
                this.show_default = false;
                return;
            }
            //likely a template issue of expected fields or formatting
            if((/You must use the Bug Ticket Form Generator and insert the template to the Description field and set the Issue field to an acceptable value/).test(error_message)){
                this.show_template_issue = true;
            } else {
                this.show_template_issue = false;
            }
            //no contact assigned to case
            if ((/Probably Limit Exceeded or 0 recipients/).test(error_message)){
                this.show_no_contact = true;
            } else {
                this.show_no_contact = false;
            }
            //default if no match
            if(this.show_no_contact || this.show_template_issue){
                this.show_default = false;
            } else {
                this.show_default = true;
            }
        }
    }
});
salesforce_errors.mount('#app');