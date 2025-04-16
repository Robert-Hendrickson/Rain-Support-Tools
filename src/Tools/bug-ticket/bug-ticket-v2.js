/**
 * @module bug-ticket-v2
 * @description This module is used to generate bug tickets for the Rain Support Team.
 */
window.regexController = (await import('/Rain-Support-Tools/src/modules/regex-patterns/patterns.js')).regexController;
/**
 * @type {string}
 * @description This variable is used to store the brand the user is under. This will be used to determine some settings for the bug ticket generator.
 */
let brand;

/**
 * @param {string} url_string - The url to build a regular expression object from
 * @returns {RegExp} - A regular expression object
 * @description This function builds a regular expression object out of a url so that we can check for duplicate links being provided in the checkLinkList function
*/
function _urlRegEx(url_string){
    //replace characters '\/' and '?' so that they are searched correctly by the new regex expression
    url_string = url_string.replace(/[\?\\\/]/g,"\\\$&");
    //return the new regex expression to be used with a global search attached
    return new RegExp(url_string, 'g');
}
//this function will return true if the provided link is not a valid google drive or one drive link
function imageVideoLink(url_string){
    return (
            url_string === '' 
            || 
            (
                !regexController.regexPatterns.googleDrive.test(url_string) 
                &&
                !regexController.regexPatterns.oneDrive.test(url_string)
            )
        );
    /*
    good links
    image
    https://quiltsoftware-my.sharepoint.com/:i:/p/david_vandersluis/EWo5q-V1MB9DqxBQmFNw87YBX430MdWX3N-HzL8V1TghEg?e=Fpia10

    video
    https://quiltsoftware-my.sharepoint.com/:v:/p/david_vandersluis/EbR3Bar75tVEp4GBKUYrIMUBtvnbBAkUd9L9vzY7ASC6cA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=U49V57

    bad link - leads to a folder instead of a file
    https://quiltsoftware-my.sharepoint.com/:f:/p/david_vandersluis/EtJUFCiLE6RMiVD5AlmC8GEBvmlKwzDVIDjQt8EGoV01_A?e=7LKReI

    */
}
/*this function checks the list of screenshot or video links to make sure they all meet a specific url requirement and that none are either empty or have a duplicate link in them*/
function checkLinkList(list_content, list_type){
    let error_array = [];
    //check that there are rows to look through
    if (list_content.length < 1 && !['frameready','tritech'].includes(brand)) {
        error_array.push(`${list_type} list is empty. Please make sure that the list has at least one ${list_type} link provided.`);
    } else {
        //if list is longer than 0, loop through each element in the list with the below function, this checks that there isn't more than one link in a row. If a duplicate link is found in the row then it is removed, if the second link found isn't a duplicate an error is thrown to the user to make sure they delete any extra data out of the row
        list_content.forEach(function (element, index){
            //set current loop row value to be called on
            if(element.value != ''){//if there is data in the row, check how many links are in it
                let row_data = element.value.match(/https?/g) || [];
                //if the array returned is longer than 1 then there is a duplicate
                if(row_data.length > 1){
                    //let's find where second link starts in the string
                    let dup_link_check = {//object created to find duplicate links
                        times_iterated: 0,
                        iterator: element.value.matchAll(/https?/g),
                        _constructor: () => {
                            for(let match of dup_link_check.iterator){
                                dup_link_check.times_iterated ++;
                                dup_link_check[`match_${dup_link_check.times_iterated}`] = match.index;
                            }
                        }
                    }
                    dup_link_check._constructor();
                    //find part of url string that is the first link
                    let first_link = element.value.substr(0, dup_link_check.match_2);
                    //check full string to see if the first link is found more than one time in fullness
                    if (element.value.match(_urlRegEx(first_link)).length > 1) {
                        //if first link string is seen more than one time, set string value of the element to be just the first link
                        element.value = first_link;
                    } else {
                        //otherwise set return value as true for a potentially issue
                        error_array.push(`${list_type} ${index + 1} has more than one link.`);
                    }
                }
            }
        });
        //loop through each link given again
        list_content.forEach(function (element, index){
            //remove all white space from each link string, (spaces, tabs, etc.)
            element.value = element.value.trim();
            //make sure that each link meets the expected criteria of being a google drive or one drive link
            if(imageVideoLink(element.value)){
                error_array.push(`${list_type} ${index + 1} isn't a valid google drive or one drive link.`);
            }
        });
    }
    //return value of checks. A false return means no issues were found, a true return means we found an issue
    return error_array;
}
/*function checks the list of screenshots and video links to make sure the same link isn't being used twice in the list*/
function duplicateLinksFound(){
    let duplicates = [];
    let link_list = '';
    //build link list by getting each input and making a string comma delimited (link_1,link_2,etc)
    document.querySelectorAll('#links-content tr input').forEach(function (element){
        link_list += element.value + ',';
    })
    //loop through each input and check it's input as a regex test on the string to make sure it doesn't find more than one instance of a link
    document.querySelectorAll('#links-content tr input').forEach(function (element){
        let temp_regex = new RegExp(element.value.replace(/[\?\\\/]/g,"\\\$&"), 'g');
        if(link_list.match(temp_regex).length > 1 && element.value != ''){
            //if test finds more than 1 instance of a link add it to the list to display
            duplicates.push(element.value);
        }
    })
    //return true if duplicates found, false if no duplicates found
    return [... new Set(duplicates)];
}
/*this function is used to when clicking the "Next" and "Finish" buttons on the bug ticket generator. It validates that the data on the current step the user is making edits to has passed specific validations. If they don't an error message is generated. If it passes then the display moves to the next step for inputs

the async keyword was added to this function so that it could be used along side the custom confirmation modal in /modules/dialog-ctrl.(js|css). Async allows it to wait for a response from the dialog-ctrl.js function before moving forward where necessary
*/
window.validateData = async function () {
    //close any error popups currently open
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
    let error_popup = await import('../../modules/error-popup/popup.js');
    //create object to be passed to error popup if needing to display an error error_popup.default(bad_object);
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step number from web page
    let current_step = parseInt(document.querySelector('#info-tabs .active').getAttribute('step'));
    //compare current_step value against potential cases, complete the actions for any case that results as true
    switch (current_step) {
        case 1://Support Rep, Store Name, CRM, system area, and is replicable (yes or no) check
            if(document.getElementById('Support-Rep').value === ''){
                bad_object.list['SupportRep'] = 'Please enter the name of the Support Rep submitting the ticket.';
            }
            if(document.getElementById('Store-Name').value === ''){
                bad_object.list['StoreName'] = 'Please enter the name of the store reporting an issue.';
            }
            if(document.getElementById('crm').value === '' || !RegExp(/^(?:[c|C][r|R][m|M])?\d{2,}$/).test(document.getElementById('crm').value)){
                bad_object.list['crm'] = 'The CRM needs to be a valid CRM.(2 digits or more)';
            }
            if (document.getElementById('systemArea').value === '') {
                bad_object.list['system'] = 'Please enter the area of the system that is affected.';
            }
            if (!document.querySelectorAll('[replicable].selected').length) {
                bad_object.list['replicable'] = 'Please select if this is replicable or not.';
            }
            if (document.querySelector('[replicable].selected').textContent === 'Yes' && !document.querySelectorAll('[where].selected').length) {
                bad_object.list['where'] = 'Make sure to select at least one place where replication happened.';
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;                           
        case 2://steps for replication
            let steps_true = true;
            if(document.querySelectorAll('#steps-table tbody tr').length < 1){
                bad_object.list['steps'] = 'Please list the steps taken to reproduce the issue.';
                steps_true = false;
            }
            let uncertain_steps = {
                value: false,
                reg: new RegExp(/^[iI][fF]\s/)
            }
            document.querySelectorAll('#steps-table tbody tr input').forEach(function (element){
                if(element.value === '' || uncertain_steps.reg.test(element.value)){
                    if(element.value === '' && steps_true){
                        bad_object.list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                        steps_true = false;
                    }
                    if(uncertain_steps.reg.test(element.value) && uncertain_steps.value != true){
                        bad_object.list['uncertain'] = 'One or more of the steps provided start with the word "If". Please use concise language and list only steps that you have taken or were taken to produce the behavior being reported. If you have concerns about a step please speak with an L2 or L3.';
                        uncertain_steps.value = true;
                    }
                }
            });
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 3://Description
            if(document.getElementById('description').value === '' || RegExp(/^[n|N](?:\/|\\)?[a|A]\s?$/).test(document.getElementById('description').value)){
                bad_object.list['description'] = 'Description cannot be empty or n/a. Please describe in detail what is happening.';
            }
            if (regexController.regexPatterns.slack.test(document.getElementById('description').value)) {
                bad_object.list['descriptionSlack'] = "Please don't use slack links in your description. Instead describe in your own words the details of the issue that is happening.";
            }
            if (regexController.regexPatterns.salesforce.test(document.getElementById('description').value)) {
                bad_object.list['descriptionSalesforce'] = "Don't include salesforce links in your description. Development teams do not have access to Salesforce. If there is info in a case that needs to be given to the development team, please include a screenshot of the data or include it in your video.";
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 4://screenshot and video link lists
            let image_problems = checkLinkList(document.querySelectorAll('#screenshot-table tr input') , 'Image');
            if (image_problems.length) {
                for (let i=0;i<image_problems.length;i++) {
                    bad_object.list[`image_${i}`] = image_problems[i];
                }
            };
            let video_problems = checkLinkList(document.querySelectorAll('#video-table tr input'), 'Video');
            if (video_problems.length) {
                for (let i=0;i<video_problems.length;i++) {
                    bad_object.list[`video_${i}`] = video_problems[i];
                }
            };
            let duplicate_links = duplicateLinksFound();
            if (duplicate_links.length) {
                for (let i=0;i<duplicate_links.length;i++) {
                    bad_object.list[`dupLink_${i}`] = `${duplicate_links[i]} was found more than one time.`;
                };
            };
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 5://Examples and Errors
            let examples = document.getElementById('examples').value;
            if(regexController.regexPatterns.admin_domains.test(examples)){
                bad_object.list['examples_links'] = 'Please make sure that all links do not point to an admin domain such as rainadmin.com. If there is a report or a product that has an issue please write the report name and filters used to find the issue or and unique ids needed to find the data.';
            }
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(examples) || examples === ''){
                bad_object.list['examples_blank'] = 'Examples cannot be blank or say n/a.';
            }
            if (regexController.regexPatterns.salesforce.test(examples)) {
                bad_object.list['examplesSalesforce'] = "Don't include salesforce links in your examples. Development teams do not have access to Salesforce. If there is info in a case that needs to be given to the development team, please include a screenshot of the data or include it in your video.";
            }
            let errors = document.getElementById('errors').value;
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(errors) || errors === ''){
                bad_object.list['errors'] = 'Errors box cannot be blank or n/a. If there are no visible errors associated with the problem behavior, please write "No Console Errors Seen".';
            }
            if(RegExp(/(see|look at).*(video|screenshot(s)?)/i).test(errors)){
                bad_object.list['errors'] = 'If errors are seen in the console, copy and paste the errors seen into the errors box.';
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                //before completing generating ticket check if the description has enough keywords about a website problem and that there isn't a link given in the example. Wait fro response from checkDescriptionNeedsLinkExamples function before progressing
                if (await checkDescriptionNeedsLinkExamples() && await checkUnnecessaryErrors()) {
                    generateTicket();
                    newCookieData();
                }
            };
            break;
        default:
            break;
    }
}
/*some special characters are used in Shortcut (where our devs and product team work on bugs) as unique markdown identifiers. This can make a case saying Layaway #123 instead try to link to a story with the id 123 because the '#' character is used in markdown. This function is used to update any characters that could cause trouble when generating a string to be used in the end Ticket data*/
function markdownScrubbing(string_data){//currently this finds any '#' characters and adds a space to them so it looks like '# ' so it doesn't try to link the following data and says a normal '#'
    let characters_to_adjust = new RegExp(/#/g);
    return string_data.replaceAll(characters_to_adjust, "$& ");
}
//this function returns the selected where or both if both where's are selected
function getWhereData(){
    let where_list = Array.from(document.querySelectorAll('[where].selected'));
    let return_text = `Where did replication happen?
`;
    if (where_list.length === 1) {
        return_text += `${where_list[0].getAttribute('where')} Site`;
    } else if (where_list.length > 1) {
        return_text += 'Test Site and Customer Site';
    } else {
        return '';
    }
    return return_text;
}
/*this compiles all of the data and builds the ticket info and displays it to the user to copy*/
function generateTicket(passed_object = {}){
    //due to new updates to allow old ticket info to be accessible from saved cookies, this takes info as an object that get's passed in. If no data was passed in (we are using current page data, not old ticket data) then passed_object is set as a default of an empty object.
    if(passed_object != null){
        let data;
        if (!Object.keys(passed_object).length) {
            //if the passed object has nothing in it, then data is set to be the below object
            data = {
                supportRep: document.getElementById('Support-Rep').value,
                storeName: document.getElementById('Store-Name').value,
                crm: document.getElementById('crm').value,
                area: document.getElementById('systemArea').value,
                replicable: document.querySelector('[replicable].selected').getAttribute('replicable'),
                steps: () => {
                    //function that loops through the steps table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    document.querySelectorAll('#steps-table tr input').forEach(function (el, index){
                        string += `${index + 1}. ` + el.value + '\n';
                    });
                    return string;
                },
                description: document.getElementById('description').value,
                screenshots: () => {
                    //function that loops through the screenshot table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    document.querySelectorAll('#screenshot-table tr input').forEach(function (el, index){
                        string += `[Screenshot_${index + 1}](${el.value})\n`;
                    });
                    return string;
                },
                videos: () => {
                    //function that loops through the video table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    document.querySelectorAll('#video-table tr input').forEach(function (el, index){
                        string += `[Video_${index + 1}](${el.value})\n`;
                    });
                    return string;
                },
                examples: document.getElementById('examples').value,
                errors: document.getElementById('errors').value
            };
            if (data.replicable === 'yes') {
                data['where'] = getWhereData();
            }
        } else {
            //if passed_object has data in it, then data is set to the below object to use the old ticket data
            data = {
                supportRep: passed_object.supportRep || '',
                storeName: passed_object.storeName || '',
                crm: passed_object.crm || '',
                area: passed_object.area || '',
                replicable: passed_object.replicable || '',
                steps: () => {
                    //function that loops through the old ticket data steps and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (let row in passed_object.steps) {
                        string += `${index}. ` + passed_object.steps[row] + '\n';
                        index++;
                    }
                    return string;
                },
                description: passed_object.description,
                expected: passed_object.expected,
                screenshots: () => {
                    //function that loops through the old ticket data screenshots and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (let row in passed_object.screenshots) {
                        string += `[Screenshot_${index}](${passed_object.screenshots[row]})\n`;
                        index++;
                    }
                    return string;
                },
                videos: () => {
                    //function that loops through the old ticket data videos and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (let row in passed_object.videos) {
                        string += `[Video_${index}](${passed_object.videos[row]})\n`;
                        index++;
                    }
                    return string;
                },
                examples: passed_object.examples,
                errors: passed_object.errors
            };
            if (passed_object.where) {
                data['where'] = passed_object.where;
            }
        }
    //this sets a string as the value of the textarea container when generating a ticket using the object values created from above '${}' formatting is in-line accessing for variable data.
    document.querySelector('#ticket-container > div > textarea').value = `**LOCATION:**
**Bug Submission:**
Reporting Tech:
${data.supportRep}

Store:
${data.storeName}

Store ID:
${data.crm}

System Area:
${data.area}

Can you recreate the problem on your demo site or Customers Site?
${data.replicable}

` +

(data.where ? data.where : ``)

+ `

STEPS TO REPRODUCE:
${data.steps()}

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:
${markdownScrubbing(data.description)}

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${markdownScrubbing(data.examples)}

Screenshot:
${data.screenshots()}

Video:
${data.videos()}

Expected Results:

CONSOLE ERRORS:
\`\`\`
${data.errors}
\`\`\`
`;
    //display generated ticket
    document.getElementById('ticket-container').classList.remove('hide');
    //set focus on text box for easy copying
    document.querySelector('#ticket-container > div > textarea').focus();
}
}
/*this function adds a row to what ever table is being interacted with*/
function addTableRow(table){
    let row_label;//switch statement finds the correct row label
    switch(table) {
        case 'steps-table':
            row_label = 'Step';
            break;
        case 'screenshot-table':
            row_label = 'Image';
            break;
        case 'video-table':
            row_label = 'Video';
            break;
        default:
            console.error('Something went wrong. Passed table type was not of an expected value: ' + table);
    }
    //finds what row is being added by how many already exist
    let new_row_number = document.querySelectorAll(`#${table} tbody tr`).length + 1;
    //create a new table row and append it to the table
    document.querySelector(`#${table} tbody`).insertAdjacentHTML('beforeend', `<tr><td>${row_label} ${new_row_number}<input placeholder="Enter ${row_label} ${new_row_number}" type="text" /></td></tr>`);
}
/*removes the last row from the table being interacted with*/
function removeTableRow(table){
    document.querySelector(`#${table} tbody tr:last-child`)?.remove();
}
/*this function is used in the last step validation to make sure that if there is enough mention of website trouble that the examples include a link or ask if it was intentionally left out*/
async function checkDescriptionNeedsLinkExamples(){
    //function returns true if there is no need to add more data
    //find out how many times the description uses any of the listed keywords by matching them in an array for each instance
    let description_check_array = document.getElementById('description').value.match(/website|cart|checkout|add to cart/gi) || [];
    //check if there is a link in the examples data
    let example_check_for_links = (/(?:https?:\/\/)?(?:\w+\.)?(\w+\.)+\w{3,}/g).test(document.getElementById('examples').value);
    let check = true;
    if (description_check_array.length > 2 && !example_check_for_links) {
        //if array has 3 or more matches and there isn't a link in the example use custom modal popup to ask if user wants to continue without adding a link
        let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
        check = await custom_dialogue.default(`It looks like there was mention of website issues, but there were no links provided in the examples. Do you want to continue without adding links to website issue areas?`,'Continue','Go Back');
    }
    return check;
}
//asks user if the errors found were actually from system break or just ones they noticed afterwards
async function checkUnnecessaryErrors(){
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
    if((/POST http:\/\/127.0.0.1:8090\/api\/status net::ERR_CONNECTION_REFUSED/).test(errors)) {
        bad_error_array.push(`127.0.0.1 : This refers to the system connecting to the print Proxy.`);
    }
    if (bad_error_array.length) {
        errors_string = () => {
            let html = `<div class="dialog-error-list">
            <div class="dialog-error-header"><strong>Error : Usual Reason</strong></div><br />
            `;
            for (i=0;i<bad_error_array.length;i++){
                html += `<div class="dialog-error-item">${bad_error_array[i]}</div>`;
            }
            html += '</div>'
            return html;
        }
        let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
        check = await custom_dialogue.default(
            `There were some errors found that might not be system problems. Please remember that during testing:<ul><li>You should have the console open and only include errors that appear at the time of the bad behavior you are noticing</li><li>Console logs that are yellow usually do not indicate a problem</li></ul> If any of the below errors did not happen at the time of bad behavior remove them from the list of errors before continuing.<br>
            <br>
            ${errors_string()}`,
            'Continue',
            'Cancel'
        )
    }
    return check;
}
/*this function refreshes the page and deletes all current data. Ask the user if they are sure before reloading page*/
async function start_new_ticket(){
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if(await custom_dialogue.default('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Go Back')){
        window.location.reload();
    }
}
/*this function is set as a listener to the replicable steps button and executes when either one is clicked*/
function selectReplicability(el){//el = clicked on element in html, update the classes to make the one that triggered the function to be the selected option
    if(document.querySelector('div[replicable].selected')){
        document.querySelector('div[replicable].selected').classList.remove('selected');
    }
    el.target.classList.add('selected');
}
/*this function is set as a listener to the where steps button and executes when either one is clicked*/
function selectWhere(el){//el = clicked on element in html, toggle the clicked on option to have or not have the class 'selected'
    if (!el.target.classList.contains('selected')) {
        el.target.classList.add('selected');
    } else {
        el.target.classList.remove('selected');
    }
}
/*this function takes the data from the current ticket and sets it as a cookie to be accessed at a future date potentially*/
function newCookieData(){
    //this function removes problem characters for saving new cookie
    function scrubBadJsonChar(string){
        return string.replaceAll(/[\"\\\;]/g,'');
    }
    //this function is accessed later to create an object of the steps, screenshots, and videos
    function subObjectCreator(table){
        let temp_object = {};
        document.querySelectorAll(`#${table}-table tr`).forEach(function(el,index){
            temp_object[`line_${index + 1}`] = scrubBadJsonChar(el.querySelector('input').value);
        })
        return temp_object;
    }
    //creates a js object out of the current ticket data
    let bug_object = {
        supportRep: scrubBadJsonChar(document.getElementById('Support-Rep').value),
        storeName: scrubBadJsonChar(document.getElementById('Store-Name').value),
        crm: scrubBadJsonChar(document.querySelector('input#crm').value),
        area: scrubBadJsonChar(document.querySelector('input#systemArea').value),
        replicable: document.querySelector('[choice-selector][replicable-selector] .selected').getAttribute('replicable'),
        steps: subObjectCreator('steps'),
        description: scrubBadJsonChar(document.getElementById('description').value),
        screenshots: subObjectCreator('screenshot'),
        videos: subObjectCreator('video'),
        examples: scrubBadJsonChar(document.getElementById('examples').value),
        errors: scrubBadJsonChar(document.getElementById('errors').value)
    }
    if (document.querySelectorAll('[where].selected').length) {
        bug_object['where'] = getWhereData();
    }
    let now = Date.now();
    //turns the js object into a string of data and saves it as the value of a new cookie using the current time stamp as a unique id
    setCookie(`bug_${now}`,JSON.stringify(bug_object));
    //update existing list
    if (!document.querySelector('past-tickets').children.length) {
        document.querySelector('#past-ticket-container').removeAttribute('style');
    }
    //updates number
    document.getElementById('list-toggle').innerText = parseInt(document.getElementById('list-toggle').innerText) + 1;
    //appends new ticket to list
    document.querySelector('past-tickets').insertAdjacentHTML('beforeend', `<div data="${JSON.stringify(bug_object).replaceAll(`"`,"&quot;")}"><span class="close"></span>${Date(now).substring(0,24)}<br>CRM: ${bug_object.crm}<br>Description: ${bug_object.description}</div>`);
    document.querySelector('past-tickets > div:last-child').addEventListener('click',oldTicketDataPrint);
    document.querySelector('past-tickets > div:last-child span.close').addEventListener('click',() => deletePastTicketLine(`bug_${now}`,document.querySelector('past-tickets > div:last-child')));
}
/*This function builds a list out of the data passed in the array, the array comes from displayPastTickets function*/
function buildPastTicketDivs(array){
    document.getElementById('list-toggle').innerText = array.length;//update the toggle to display the number of past tickets available
    for (let i=0;i<array.length;i++) {//loop through the array and build a div for each using data from the cookie
        let bug_date_string = array[i].substring(0,array[i].indexOf('='));
        let bug_details_string = array[i].substring(array[i].indexOf('=') +1 );
        let date = new Date(parseInt(bug_date_string.split("_")[1])).toString().substring(0,24);
        let bug_data = bug_details_string.replaceAll(/"/g,'&quot;');
        let temp_json = JSON.parse(bug_details_string);
        document.querySelector('past-tickets').insertAdjacentHTML('beforeend', `<div data="${bug_data}"><span class="close"></span>${date}<br>CRM: ${temp_json.crm}<br>Description: ${temp_json.description}</div>`);
        //document.querySelector('past-tickets > div:last-child').addEventListener('click',oldTicketDataPrint);
        document.querySelector('past-tickets > div:last-child span.close').addEventListener('click',() => deletePastTicketLine(bug_date_string,document.querySelector('past-tickets > div:last-child')));
    }
}
/*this takes the div of a old ticket from the list and displays it in the ticket generator area so that it can be copied again if necessary*/
function oldTicketDataPrint(el){
    //get ticket data from clicked element and pass to generateTicket function
    let ticket_data = el.target.getAttribute('data');
    generateTicket(JSON.parse(ticket_data));
}
/*this function looks for all cookies with past tickets created and collects their data into an array to be passed to the buildPastTicketDivs function*/
function displayPastTickets(){
    let bug_array = document.cookie.split('; ').filter((value) => (/^bug\_\d+/).test(value));
    if (bug_array.length > 0) {
        buildPastTicketDivs(bug_array);
        document.querySelectorAll('past-tickets > div').forEach(el => el.addEventListener('click',oldTicketDataPrint));
        document.querySelector('#past-ticket-container').removeAttribute('style');
    }
}
/*allows deleting past tickets from the list*/
async function deletePastTicketLine(cookie,line){
    //waits for confirmation
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if (await custom_dialogue.default('Delete this past ticket?')) {
        //deletes existing cookie
        deleteCookie(cookie);
        //removes visible line
        line.remove();
        //updates number
        document.getElementById('list-toggle').innerText = parseInt(document.getElementById('list-toggle').innerText)-1;
        //if last line is deleted, hide the panel entirely.
        if (!document.querySelector('past-tickets')?.children.length) {
            document.querySelector('#past-ticket-container').style.display = 'none';
        }
    }
    if (document.getElementById('list-toggle').innerText === '0') {
        document.getElementById('list-toggle').click();
    }
}
/*this waits for the window to finish loading everything then executes a set of commands for the page on initial load*/
window.addEventListener('load', () => {
    //sets event listener on replicable buttons
    document.querySelectorAll('div[replicable]').forEach(el => el.addEventListener('click',selectReplicability));
    //sets event listener on where buttons
    document.querySelectorAll('div[where]').forEach(el => el.addEventListener('click',selectWhere));
    //this sets the toggle functionality of the past tickets toggle
    document.getElementById('list-toggle').addEventListener('click', function (){
        document.querySelector('past-tickets').classList.toggle('active');
    });
    //this runs the function to check for any old tickets still saved in cookies
    displayPastTickets();
    //this sets the event listener on the copy button
    document.querySelector('.copy-btn').addEventListener('click', async () =>{
        const copyText =  await import('/Rain-Support-Tools/src/modules/copy-data/copy-data.js');
        copyText.default(document.querySelector('#ticket-container > div > textarea'));
    });
    //this sets the event listener on the sf-tips button
    document.querySelector('.sf-tips').addEventListener('click', () =>{
        document.querySelector('#salesforce-bug-calc-tips').classList = '';
    });
    //this sets the event listener on the sf-tips close button
    document.querySelector('#salesforce-bug-calc-tips .close').addEventListener('click', () =>{
        document.querySelector('#salesforce-bug-calc-tips').classList = 'hide';
    });
    //these sets the event listener for the table controls
    document.querySelectorAll('div[table-controls] button:first-child').forEach(
        (el,index) => {
            if(index === 0){
                el.addEventListener('click',() => addTableRow('steps-table'));
            }
            if(index === 1){
                el.addEventListener('click',() => addTableRow('screenshot-table'));
            }
            if(index === 2){
                el.addEventListener('click',() => addTableRow('video-table'));
            }
        }
    );
    document.querySelectorAll('div[table-controls] button:last-child').forEach(
        (el,index) => {
            if(index === 0){
                el.addEventListener('click',() => removeTableRow('steps-table'));
            }
            if(index === 1){
                el.addEventListener('click',() => removeTableRow('screenshot-table'));
            }
            if(index === 2){
                el.addEventListener('click',() => removeTableRow('video-table'));
            }
        }
    );
    //this sets the event listener for the ticket modal buttons
    document.querySelector('div[ticket-buttons] button:first-child').addEventListener('click',start_new_ticket);
    document.querySelector('div[ticket-buttons] button:nth-child(2)').addEventListener('click',() => document.getElementById('ticket-container').classList.add('hide'));
    //this sets the event listener for the brand selector
    document.querySelectorAll('#brand-selector-list .brand-selector-item').forEach(el => el.addEventListener('click',(e) => {
        document.querySelector('.brand-selector-item.selected')?.classList.remove('selected');
        e.target.classList.add('selected');
    }));
    document.querySelector('#brand-selector button').addEventListener('click',() => {
        if(document.querySelector('.brand-selector-item.selected')){
            brand = document.querySelector('.brand-selector-item.selected').id;
            setCookie('brand',brand, 7);
            document.querySelector('#brand-selector').classList.add('hide');
        }
    });
    //this will set the brand value if it already exists
    if(getCookie('brand')){
        brand = getCookie('brand');
        setCookie('brand',brand, 7);
    } else {
        document.querySelector('#brand-selector').classList.remove('hide');
    }
    //this sets the event listener for the brand selector
    document.querySelectorAll('#brand-selector-list .brand-selector-item').forEach(el => el.addEventListener('click',(e) => {
        document.querySelector('.brand-selector-item.selected')?.classList.remove('selected');
        e.target.classList.add('selected');
    }));
    document.querySelector('#brand-selector button').addEventListener('click',() => {
        if(document.querySelector('.brand-selector-item.selected')){
            brand = document.querySelector('.brand-selector-item.selected').id;
            setCookie('brand',brand, 7);
            document.querySelector('#brand-selector').classList.add('hide');
        }
    });
    //add event listener for validateData custom event
    document.addEventListener('validateData', validateData);
    //this will set the brand value if it already exists
    if(getCookie('brand')){
        brand = getCookie('brand');
        setCookie('brand',brand, 7);
    } else {
        document.querySelector('#brand-selector').classList.remove('hide');
    }
});
