/**
 * @module validate-step-5
 * @description This module is used to validate the data entered on step 5 of the bug ticket form.
 */
import {regexController} from '/Rain-Support-Tools/src/modules/regex-patterns/patterns.js';
import customDialogue from '/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js';
export default {
    name: 'validate-step-5',
    template: `
        <div style="z-index: 5;" id="examples-errors-content" data="5" :class="{active: this.$props.step === 5, 'in-active': this.$props.step < 5, complete: this.$props.step > 5}">
            <div title="Data that is currently showing the issue that can be referenced for investigation." class="note-wrapper">
                <h2>Examples</h2>
                <span class="fa-solid fa-question"></span>
            </div><br>
            <span class="sub-text">Enter example data. This can be links to web pages where things are wrong or id's of products, RTO's, etc.</span>
            <br>
            <span v-if="brand === 'rain'" class="sub-text" style="color: red;">If you have an example from their website, please provide a link to the live page!</span>
            <textarea :tabIndex="this.$props.step === 5 ? '0' : '-1'" placeholder="Enter example data. This can be links to web pages where things are wrong or id's of products, RTO's, etc." id="examples"></textarea>
            <br>
            <div title="Errors found in the browser console when the bug happened." class="note-wrapper">
                <h2>Console Errors</h2>
                <span class="fa-solid fa-question"></span>
            </div>
            <span class="sub-text">Copy the console error from the console then paste the info into the below box. Do not enter this box with "See Video" or similar options.</span>
            <textarea :tabIndex="this.$props.step === 5 ? '0' : '-1'" placeholder="Enter any console errors that appear during the issue" id="errors"></textarea>
        </div>`,
    props: {
        brand: String,
        step: Number
    },
    methods: {
        async validate(returnData){
            let examples = document.getElementById('examples').value;
            let errors = document.getElementById('errors').value;
            let bad_data_list = {};
            //check example data
            if(regexController.regexPatterns.admin_domains.test(examples)){
                bad_data_list['examples_links'] = 'Please make sure that all links do not point to an admin domain such as rainadmin.com. If there is a report or a product that has an issue please write the report name and filters used to find the issue or and unique ids needed to find the data.';
            }
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(examples) || examples === ''){
                bad_data_list['examples_blank'] = 'Examples cannot be blank or say n/a.';
            }
            if (regexController.regexPatterns.salesforce.test(examples)) {
                bad_data_list['examplesSalesforce'] = "Don't include salesforce links in your examples. Development teams do not have access to Salesforce. If there is info in a case that needs to be given to the development team, please include a screenshot of the data or include it in your video.";
            }
            //check errors data
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(errors) || errors === ''){
                bad_data_list['errors'] = 'Errors box cannot be blank or n/a. If there are no visible errors associated with the problem behavior, please write "No Console Errors Seen".';
            }
            if(RegExp(/(see|look at).*(video|screenshot(s)?)/i).test(errors)){
                bad_data_list['errors'] = 'If errors are seen in the console, copy and paste the errors seen into the errors box.';
            }
            //if there are any errors, return the errors
            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                //before completing generating ticket check if the description has enough keywords about a website problem and that there isn't a link given in the example. Wait fro response from checkDescriptionNeedsLinkExamples function before progressing
                let examples_data = {
                    examples: examples,
                    errors: errors
                }
                if (await this.checkDescriptionNeedsLinkExamples() && await this.checkUnnecessaryErrors()) {
                    returnData({success: true, data: examples_data});
                } else {
                    returnData({success: false, data: null});
                }
            };
        },
        async checkDescriptionNeedsLinkExamples(){
            //function returns true if there is no need to add more data
            //find out how many times the description uses any of the listed keywords by matching them in an array for each instance
            let description_check_array = document.getElementById('description').value.match(/website|cart|checkout|add to cart/gi) || [];
            //check if there is a link in the examples data
            let example_check_for_links = (/(?:https?:\/\/)?(?:\w+\.)?(\w+\.)+\w{3,}/g).test(document.getElementById('examples').value);
            let check = true;
            if (description_check_array.length > 2 && !example_check_for_links) {
                //if array has 3 or more matches and there isn't a link in the example use custom modal popup to ask if user wants to continue without adding a link
                check = await customDialogue(`It looks like there was mention of website issues, but there were no links provided in the examples. Do you want to continue without adding links to website issue areas?`,'Continue','Go Back');
            }
            return check;
        },
        async checkUnnecessaryErrors(){
            let errors = document.querySelector('textarea#errors').value;
            let check = true;
            let bad_error_array = [];
            if ((/Blocked aria-hidden/i).test(errors)) {
                bad_error_array.push(`Blocked aria-hidden : Browser stopped an element from using attribute aria-hidden`);
                //Usually caused by us loading or building an element that has the attribute aria-hidden. This is supposed to hide it from screen readers. Browsers sometimes stop this hiding as either the element is seen by the browser as necessary for something or it has a child element that isn't hidden.
            }
            if ((/\[DOM\] Found \d{1,} elements? with non-unique id/i).test(errors)) {
                bad_error_array.push(`non-unique id : There are multiple elements with the same id`);
            }
            if ((/127.0.0.1:\d{1,}\/api\/status/).test(errors)) {
                bad_error_array.push(`127.0.0.1 : This refers to the system connecting to the print Proxy.`);
            }
            if ((/\$position is now deprecated/i).test(errors)) {
                bad_error_array.push(`$position is now deprecated : This refers to the use of a function that needs updated but isn't causing an issue.`);
            }
            if ((/Initializing Beamer\./i).test(errors)) {
                bad_error_array.push(`Initializing Beamer : This states that beamer is being initialized. This is used to display system notifications to users.`);
            }
            if (bad_error_array.length) {
                let errors_string = () => {
                    let html = `<div class="dialog-error-list">
                    <div class="dialog-error-header"><strong>Message : Usual Reason</strong></div><br />
                    `;
                    for (let i=0;i<bad_error_array.length;i++){
                        html += `<div class="dialog-error-item">${bad_error_array[i]}</div>`;
                    }
                    html += '</div>'
                    return html;
                }
                check = await customDialogue(
                    `There were some errors found that might not be system problems. Please remember that during testing:<ul><li>You should have the console open and only include errors that appear at the time of the bad behavior you are noticing</li><li>Console logs that are yellow usually do not indicate a problem</li></ul> If any of the below errors did not happen at the time of bad behavior remove them from the list of errors before continuing.<br>
                    <br>
                    ${errors_string()}`,
                    'Continue',
                    'Cancel'
                )
            }
            return check;
        }
    }
}