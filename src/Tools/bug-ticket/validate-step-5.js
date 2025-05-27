/**
 * @module validate-step-5
 * @description This module is used to validate the data entered on step 5 of the bug ticket form.
 */
import {regexController} from '/Rain-Support-Tools/src/modules/regex-patterns/patterns.js';
export default {
    name: 'validate-step-5',
    props: {
        brand: String
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
                returnData({success: true, data: examples_data});
                /*
                if (await checkDescriptionNeedsLinkExamples() && await checkUnnecessaryErrors()) {
                    generateTicket();
                    newCookieData();
                }
                */
            };
        }
    }
}