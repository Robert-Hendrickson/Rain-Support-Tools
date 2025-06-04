/**
 * @module validate-step-3
 * @description This module is used to validate the data entered on step 3 of the bug ticket form.
 */
import {regexController} from '/Rain-Support-Tools/src/modules/regex-patterns/patterns.js';
export default {
    name: 'validate-step-3',
    template: `
        <div style="z-index: 3;" id="description-content" data="3" :class="{active: this.$props.step === 3, 'in-active': this.$props.step < 3, complete: this.$props.step > 3}">
            <div title="Please provide a detailed description of the bug behavior and what issue it is causing." class="note-wrapper">
                <h2>Description</h2>
                <span class="fa-solid fa-question"></span>
            </div>
            <textarea tabindex="-1" placeholder="Enter a Description" id="description"></textarea>
        </div>`,
    props: {
        brand: String,
        step: Number
    },
    methods: {
        async validate(returnData){
            //create object to store any errors found in the form
            let bad_data_list = {};
            let description = document.getElementById('description').value;
            //check if there is a description
            if(description === '' || RegExp(/^[n|N](?:\/|\\)?[a|A]\s?$/).test(description)){
                bad_data_list['description'] = 'Description cannot be empty or n/a. Please describe in detail what is happening.';
            }
            if (regexController.regexPatterns.slack.test(description)) {
                bad_data_list['descriptionSlack'] = "Please don't use slack links in your description. Instead describe in your own words the details of the issue that is happening.";
            }
            if (regexController.regexPatterns.salesforce.test(description)) {
                bad_data_list['descriptionSalesforce'] = "Don't include salesforce links in your description. Development teams do not have access to Salesforce. If there is info in a case that needs to be given to the development team, please include a screenshot of the data or include it in your video.";
            }
            //if there are any errors, return the errors
            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                //if there are no errors, return the steps
                returnData({success: true, data: description});
            };
        }
    }
}