/*this function builds a regular expresion object out of a url so that we can check for duplicate links being provided in the checkLinkList function*/
function _urlRegEx(url_string){
    //replace characters '\/' and '?' so that they are searched correctly by the new regex expression
    url_string = url_string.replace(/[\?\\\/]/g,"\\\$&");
    //return the new regex expresion to be used with a global search attached
    return new RegExp(url_string, 'g');
}
//this function checks to see if a string has a slack link in it
function hasSlackLink(string){
    //returns the result of running a regex test on the passed string, true if it matches false if it doesn't
    return new RegExp(/(?:https?\/\/)?raindev\.slack\.com\/archives\//).test(string);    
}
/*this function checks the list of screenshot or video links to make sure they all meet a specific url requirement and that none are either empty or have a duplicate link in them*/
function checkLinkList(list){
    return_value = false;
    //check that there are rows to look through
    if (list.length < 1) {
        return_value = true;
    } else {
        //if list is longer than 0, loop through each element in the list with the below function, this checks that there isn't more than one link in a row. If a duplicate link is foundin the row then it is removed, if the second link found isn't a duplicate an error is thrown to the user to make sure they delete any extra data out of the row
        list.each(function (){
            //set current loop row value to be called on
            let row_data = $(this)[0].value;
            if(row_data != ''){//if there is data in the row, check how many links are in it
                row_data = row_data.match(/https?/g) || [];
                //if the array returned is longer than 1 then there is a duplicate
                if(row_data.length > 1){
                    //let's find where second link starts in the string
                    let dup_link_check = {//object created to find duplicate links
                        times_iterated: 0,
                        itterator: $(this)[0].value.matchAll(/https?/g),
                        _constructor: () => {
                            for(match of dup_link_check.itterator){
                                dup_link_check.times_iterated ++;
                                dup_link_check[`match_${dup_link_check.times_iterated}`] = match.index;
                            }
                        }
                    }
                    dup_link_check._constructor();
                    //find part of url string that is the first link
                    let first_link = $(this)[0].value.substr(0, dup_link_check.match_2);
                    //check full string to see if the first link is found more than one time in fullness
                    if ($(this)[0].value.match(_urlRegEx(first_link)).length > 1) {
                        //if first link string is seen more than one time, set string value of the element to be just the first link
                        $(this)[0].value = first_link;
                    } else {
                        //otherwise set return value as true for a potentially issue
                        return_value = true;
                    }
                }
            }
        });
        //loop through each link given again
        list.each(function (){
            //remove all white space from each link string, (spaces, tabs, etc.)
            $(this)[0].value = $(this)[0].value.replaceAll(/\s/g,'');
            //make sure that each link meets the expected criteria of being a google drive link
            if($(this)[0].value === '' || !RegExp(/^(?:https?:\/\/)drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/).test($(this)[0].value)){
                //if not, change return value to reflect a potential issue
                return_value = true;
            }
        });
    }
    //return value of checks. A false return means no issues were found, a true return means we found an issue
    return return_value;
}
/*function checks the list of screenshots and video links to make sure the same link isn't being used twice in the list*/
function duplicateLinksFound(){
    let duplicates = false;
    let link_list = '';
    //build link list by getting each input and making a string comma delminated (link_1,link_2,etc)
    $('#links-content tr input').each(function (){
        link_list += $(this)[0].value + ',';
    })
    //loop through each input and check it's input as a regex test on the string to make sure it doesn't find more than one instance of a link
    $('#links-content tr input').each(function (){
        let temp_regex = new RegExp($(this)[0].value.replace(/[\?\\\/]/g,"\\\$&"), 'g');
        if(link_list.match(temp_regex).length > 1){
            //if test finds more than 1 instance of a link return true for issue
            duplicates = true;
        }
    })
    //return true if duplicates found, false if no duplicates found
    return duplicates;
}
/*this function is used to when clicking the "Next" and "Finish" buttons on the bug ticket generator. It validates that the data on the current step the user is making edits to has passed specific validations. If they don't an error message is generated. If it passes then the display moves to the next step for inputs

the async keyword was added to this function so that it could be used along side the custom confirmation modal in /modules/dialog-ctrl.(js|css). Async allows it to wait for a response from the dialog-ctrl.js function before moving forward where necessary
*/
async function validateData(){
    //close any error popups currently open
    Close_error_growl();
    //create object to be passed to error popup if needing to display an error /common/actions/popup.js - popup_error_growl() function
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step number from web page
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    //compare current_step value against potential cases, complete the actions for any case that results as true
    switch (current_step) {
        case 1://crm, system area, and is replicable (yes or no) check
            if($('#crm')[0].value === '' || !RegExp(/^(?:[c|C][r|R][m|M])?\d{2,}$/).test($('#crm')[0].value)){
                bad_object.list['crm'] = 'The CRM needs to be a valid CRM.(2 digits or more)';
            }
            if ($('#systemArea')[0].value === '') {
                bad_object.list['system'] = 'Please enter the area of the system that is affected.';
            }
            if (!$('[replicable].selected').length) {
                bad_object.list['replicable'] = 'Please select if this is replicable or not.';
            }
            if ($('[replicable].selected').text() === 'Yes' && !$('[where].selected').length) {
                bad_object.list['where'] = 'Make sure to select at least one place where replication happened.';
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;                           
        case 2://steps for replication
            let steps_true = true;
            if($('#steps-table tbody tr').length < 1){
                bad_object.list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                steps_true = false;
            }
            let uncertain_steps = {
                value: false,
                reg: new RegExp(/^[iI][fF]\s/)
            }
            $('#steps-table tbody tr input').each(function (){
                if($(this)[0].value === '' || uncertain_steps.reg.test($(this)[0].value)){
                    if($(this)[0].value === '' && steps_true){
                        bad_object.list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                        steps_true = false;
                    }
                    if(uncertain_steps.reg.test($(this)[0].value) && uncertain_steps.value != true){
                        bad_object.list['uncertain'] = 'One or more of the steps provided start with the word "If". Please use concise language and list only steps that you have taken or were taken to produce the behavior being reported. If you have concerns about a step please speak with an L2 or L3.';
                        uncertain_steps.value = true;
                    }
                }
            });
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 3://Description
            if($('#description')[0].value === '' || RegExp(/^[n|N](?:\/|\\)?[a|A]\s?$/).test($('#description')[0].value)){
                bad_object.list['description'] = 'Description cannot be empty or n/a. Please describe in detail what is happening.';
            }
            if (hasSlackLink($('#description')[0].value)) {
                bad_object.list['descriptionSlack'] = "Please don't use slack links in your description. Instead describe in your own words the details of the issue that is happening.";
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 4://screenshot and video link lists
            if(checkLinkList($('#screenshot-table tr input'))){
                bad_object.list['screenshot'] = 'One (or more) of the screenshots provided are not an expected domain, is empty, or there are potentially more than one link in the same line.';
            }
            if(checkLinkList($('#video-table tr input'))){
                bad_object.list['video'] = 'One (or more) of the videos provided are not an expected domain, is empty, or there are potentially more than one link in the same line.';
            }
            if(duplicateLinksFound()){
                bad_object.list['duplicates'] = 'One or more of the links provided is being used twice. Please make sure all links are unique.';
            }
            if (Object.entries(bad_object.list).length) {
                bad_object.list['reminder'] = 'Make sure that all links point to a google drive file that is shared with all Rain Emails so that they can be seen by the Dev/Prod teams.';
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 5://Examples and Errors
            let examples = $('#examples')[0].value;
            if(RegExp(/rainadmin|quiltstorewebsites|jewel360|musicshop360/).test(examples)){
                bad_object.list['examples_links'] = 'Please make sure that all links do not point to an admin domain such as rainadmin.com. If there is a report or a product that has an issue please write the report name and filters used to find the issue or and unique ids needed to find the data.';
            }
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(examples) || examples === ''){
                bad_object.list['examples_blank'] = 'Examples cannot be blank or say n/a.';
            }
            let errors = $('#errors')[0].value;
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(errors) || errors === ''){
                bad_object.list['errors'] = 'Errors box cannot be blank or n/a. If there are no visible errors associated with the problem behavior, please write "No Console Errors Seen".';
            }
            if(RegExp(/(see|look at).*(video|screenshot(s)?)/i).test(errors)){
                bad_object.list['errors'] = 'If errors are seen in the console, copy and paste the errors seen into the errors box.';
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                //before completing generating ticket check if the description has enough keywords about a website problem and that there isn't a link given in the example. Wait fro response from checkDescriptionNeedsLinkExamples function before progressing
                if (await checkDescriptionNeedsLinkExamples()) {
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
    let where_list = Array.from($('[where].selected'));
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
function generateTicket(passed_object = {}){//due to new updates to allow old ticket info to be accesible from saved cookies, this takes info as an object that get's passed in. If no data was passed in (we are using current page data, not old ticket data) then passed_object is set as a default of an empty object.
    if(passed_object != null){
        let data;
        if (!Object.keys(passed_object).length) {
            //if the passed object has nothing in it, then data is set to be the below object
            data = {
                crm: $('#crm')[0].value,
                area: $('#systemArea')[0].value,
                replicable: $('[replicable].selected').attr('replicable'),
                steps: () => {//the part of the object is a function that loops through the steps table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    $('#steps-table tr input').each(function (index){
                        let step = index + 1;
                        string += `${index + 1}. ` + $(this)[0].value + '\n';
                    });
                    return string;
                },
                description: $('#description')[0].value,
                screenshots: () => {//the part of the object is a function that loops through the screenshot table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    $('#screenshot-table tr input').each(function (){
                        string += $(this)[0].value + '\n\n';
                    });
                    return string;
                },
                videos: () => {//the part of the object is a function that loops through the video table and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    $('#video-table tr input').each(function (){
                        string += $(this)[0].value + '\n\n';
                    });
                    return string;
                },
                examples: $('#examples')[0].value,
                errors: $('#errors')[0].value
            };
            if (data.replicable === 'yes') {
                data['where'] = getWhereData();
            }
        } else {
            //if passed_object has data in it, then data is set to the below object to use the old ticket data
            data = {
                crm: passed_object.crm,
                area: passed_object.area,
                replicable: passed_object.replicable,
                steps: () => {//the part of the object is a function that loops through the old ticket data steps and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (row in passed_object.steps) {
                        string += `${index}. ` + passed_object.steps[row] + '\n';
                        index++;
                    }
                    return string;
                },
                description: passed_object.description,
                expected: passed_object.expected,
                screenshots: () => {//the part of the object is a function that loops through the old ticket data screenshots and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (row in passed_object.screenshots) {
                        string += `${index}. ` + passed_object.screenshots[row] + '\n';
                        index++;
                    }
                    return string;
                },
                videos: () => {//the part of the object is a function that loops through the old ticket data videos and builds a string then returns the string value as it's resolution when called
                    let string = '';
                    let index = 1;
                    for (row in passed_object.videos) {
                        string += `${index}. ` + passed_object.videos[row] + '\n';
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
    $('#ticket-container > div > textarea')[0].value = `**LOCATION:**
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
    $('#ticket-container').removeClass('hide');//display generated ticket
    $('#ticket-container > div > textarea')[0].focus();//set focus on text box for easy copying
}
}
/*this function auto copies the data from the textarea to the computers clipboard*/
function copyTicket() {
    // Get the text field
    var copyText = $('#ticket-container > div > textarea')[0];

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //console.log("Copied the text: " + copyText.value);
};
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
    let new_row_number = $(`#${table} tbody tr`).length + 1;//finds what row is being added by how many already exist
    //create a new table row and append it to the table
    $(`#${table} tbody`).append(`<tr><td>${row_label} ${new_row_number}<input placeholder="Enter ${row_label} ${new_row_number}" type="text" /></td></tr>`)
}
/*removes the last row from the table being interacted with*/
function removeTableRow(table){
    $(`#${table} tbody tr:last-child`).remove();
}
/*this function is used in the last step validation to make sure that if there is enough mention of website trouble that the examples include a link or ask if it was intentionally left out*/
async function checkDescriptionNeedsLinkExamples(){
    //function returns true if there is no need to add more data
    let description_check_array = $('#description')[0].value.match(/website|cart|checkout|add to cart/gi);//find out how many times the description uses any of the listed keywords by matching them in an array for each instance
    if (description_check_array === null) {//if no keywords are found set the variable to an empty array
        description_check_array = [];
    }
    let example_check_for_links = (/(?:https?:\/\/)?(?:\w+\.)?(\w+\.)+\w{3,}/g).test($('#examples')[0].value);//check if there is a link in the examples data
    let check = true;
    if (description_check_array.length > 2 && !example_check_for_links) {//if array has 3 or more matches and there isn't a link in the example use custom modal popup to ask if user wants to continue without adding a link
        check = await customDialogResponse(`It looks like there was mention of website issues, but there were no links provided in the examples. Do you want to continue without adding links to website issue areas?`,'Continue','Go Back');
    }
    return check;
}
/*this function refreshes the page and deletes all current data. Ask the user if they are sure before reloading page*/
async function start_new_ticket(){
    if(await customDialogResponse('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Go Back')){
        window.location.reload();
    }
}
/*this function is set as a listener to the replicable steps button and executes when either one is clicked*/
function selectReplicability(el){//el = clicked on element in html, update the classes to make the one that triggered the function to be the selected option
    $('div[replicable].selected').removeClass('selected');
    el.target.classList.value = 'selected';
}
/*this function is set as a listener to the where steps button and executes when either one is clicked*/
function selectWhere(el){//el = clicked on element in html, toggle the clicked on option to have or not have the class 'selected'
    if (!el.target.classList.contains('selected')) {
        el.target.classList.value = 'selected';
    } else {
        el.target.classList.value = '';
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
        $(`#${table}-table tr`).each(function(index,el){
            temp_object[`line_${index + 1}`] = scrubBadJsonChar(el.querySelector('input').value);
        })
        return temp_object;
    }
    //creates a js object out of the current ticket data
    let bug_object = {
        crm: scrubBadJsonChar($('input#crm')[0].value),
        area: scrubBadJsonChar($('input#systemArea')[0].value),
        replicable: $('[choice-selector][replicable-selector] .selected').attr('replicable'),
        steps: subObjectCreator('steps'),
        description: scrubBadJsonChar($('#description')[0].value),
        screenshots: subObjectCreator('screenshot'),
        videos: subObjectCreator('video'),
        examples: scrubBadJsonChar($('#examples')[0].value),
        errors: scrubBadJsonChar($('#errors')[0].value)
    }
    if ($('[where].selected').length) {
        bug_object['where'] = getWhereData();
    }
    let now = Date.now();
    //turns the js object into a string of data and saves it as the value of a new cookie using the current time stamp as a unique id
    setCookie(`bug_${now}`,JSON.stringify(bug_object));
    //update existing list
    if (!$('past-tickets').children().length) {
        $('#past-ticket-container').show();
    }
    //updates number
    $('#list-toggle').text(parseInt($('#list-toggle').text()) + 1);
    //appends new ticket to list
    $('past-tickets').append(`<div data="${bug_object}"><span class="close" onclick="deletePastTicketLine('bug_${now}',this)"></span>${Date(now).substring(0,24)}<br>CRM: ${bug_object.crm}<br>Description: ${bug_object.description}</div>`);
}
/*This function bulds a list out of the data passed in the array, the array comes from displayPastTickets function*/
function buildPastTicketDivs(array){
    $('#list-toggle')[0].innerText = array.length;//update the toggle to display the number of past tickets available
    for (i=0;i<array.length;i++) {//loop through the array and build a div for each using data from the cookie
        bug_date_string = array[i].substring(0,array[i].indexOf('='));
        bug_details_string = array[i].substring(array[i].indexOf('=') +1 );
        let date = new Date(parseInt(bug_date_string.split("_")[1])).toString().substring(0,24);
        let bug_data = bug_details_string.replaceAll(/"/g,'&quot;');
        let temp_json = JSON.parse(bug_details_string);
        $('past-tickets').append(`<div data="${bug_data}"><span class="close" onclick="deletePastTicketLine('${bug_date_string}',this)"></span>${date}<br>CRM: ${temp_json.crm}<br>Description: ${temp_json.description}</div>`);
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
        $('past-tickets > div').on('click',oldTicketDataPrint);
        $('#past-ticket-container').show();
    }
}
/*allows deleting past tickets from the list*/
async function deletePastTicketLine(cookie,line){
    //waits for confirmation
    if (await customDialogResponse('Delete this past ticket?')) {
        //deletes existing cookie
        deleteCookie(cookie);
        //removes visible line
        $(line).parent().remove();
        //updates number
        $('#list-toggle').text(parseInt($('#list-toggle').text())-1)
        //if last line is deleted, hide the panel entirely.
        if (!$('past-tickets').children().length) {
            $('#past-ticket-container').hide();
        }
    }
}
/*this waits for the window to finish loading everything then executes a set of commands for the page on initial load*/
$(window).ready(function (){
    //sets event listener on replicable buttons
    $('div[replicable]').on('click',selectReplicability);
    //sets event listener on where buttons
    $('div[where]').on('click',selectWhere);
    //this sets the toggle functionality of the past tickets toggle
    $('#list-toggle').on('click', function (){
        $('past-tickets').toggleClass('active');
    });
    //this runs the function to check for any old tickets still saved in cookies
    displayPastTickets();
});
