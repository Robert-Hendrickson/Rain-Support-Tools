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
            if($('#crm')[0].value === '' || !RegExp(/^(?:[c|C][r|R][m|M])?\d{3,}$/).test($('#crm')[0].value)){
                bad_object.list['crm'] = 'The CRM needs to be a valid CRM.(3 digits or more)';
            }
            if ($('#systemArea')[0].value === '') {
                bad_object.list['system'] = 'Please enter the area of the system that is affected.';
            }
            if (!$('[replicable].selected').length) {
                bad_object.list['replicable'] = 'Please select if this is replicable or not.';
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
        case 3://Description and Expected Outcome
            if($('#description')[0].value === '' || RegExp(/^[n|N](?:\/|\\)?[a|A]/).test($('#description')[0].value)){
                bad_object.list['description'] = 'Description cannot be empty or n/a. Please describe in detail what is happening.';
            }
            if (hasSlackLink($('#description')[0].value)) {
                bad_object.list['descriptionSlack'] = "Please don't use slack links in your description. Instead describe in your own words the details of the issue that is happening.";
            }
            if($('#expected')[0].value === '' || RegExp(/^[n|N](?:\/|\\)?[a|A]/).test($('#expected')[0].value)){
                bad_object.list['expected'] = 'Expectation cannot be empty or n/a. Please describe the expected outcome that is not being met.';
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
/*control displaying next step if validation passes*/
function nextStep(current_step){
    //Move to next step
    $(`[step='${current_step}']`)[0].classList.value = 'complete';
    $(`[step='${current_step + 1}']`)[0].classList.value = 'active';
    //move to next data set
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step + 1}']`)[0].classList.value = 'active';
    if(current_step === 1){//hide "Back" button if on step one
        $('button[prev]').removeClass('hide');
    }
    if(current_step === 4){//switch out "Next" button for "Finish" if moving to last step
        $('button[next]').addClass('hide');
        $('button[finish]').removeClass('hide');
    }
}
/*some special characters are used in Shortcut (where our devs and product team work on bugs) as unique markdown identifiers. This can make a case saying Layaway #123 instead try to link to a story with the id 123 because the '#' character is used in markdown. This function is used to update any characters that could cause trouble when generating a string to be used in the end Ticket data*/
function markdownScrubbing(string_data){//currently this finds any '#' characters and adds a space to them so it looks like '# ' so it doesn't try to link the following data and says a normal '#'
    let characters_to_adjust = new RegExp(/#/g);
    return string_data.replaceAll(characters_to_adjust, "$& ");
}
/*this compiles all of the data and builds the ticket info and displays it to the user to copy*/
function generateTicket(passed_object = {}){//due to new updates to allow old ticket info to be accesible from saved cookies, this takes info as an object that get's passed in. If no data was passed in (we are using current page data, not old ticket data) then passed_object is set as a default of an empty object.
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
            expected: $('#expected')[0].value,
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
    }
    //this sets a string as the value of the textarea container when generating a ticket using the object values created from above '${}' formatting is in-line accessing for variable data.
    $('#ticket-container > div > textarea')[0].value = `**LOCATION:**
Store ID:
${data.crm}

System Area:
${data.area}

Can you recreate the problem on your demo site (if yes please continue, if no use the "Bug - non reproducible" macro)?
${data.replicable}

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

Console Info:

EXPECTED RESULTS:
${markdownScrubbing(data.expected)}

CONSOLE ERRORS:
\`\`\`
${data.errors}
\`\`\`
`;
    $('#ticket-container').removeClass('hide');//display generated ticket
    $('#ticket-container > div > textarea')[0].focus();//set focus on text box for easy copying
}

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

function addTableRow(table){
    let row_label;
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
    let new_row_number = $(`#${table} tbody tr`).length + 1;
    $(`#${table} tbody`).append(`<tr><td>${row_label} ${new_row_number}<input placeholder="Enter ${row_label} ${new_row_number}" type="text" /></td></tr>`)
}

function removeTableRow(table){
    $(`#${table} tbody tr:last-child`).remove();
}

function previousStep(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    if(current_step === 2){
        $('button[prev]').addClass('hide');
    }
    if(current_step === 5){
        $('button[finish]').addClass('hide');
        $('button[next]').removeClass('hide');
    }
    //set step display changes
    $(`[step='${current_step}']`)[0].classList.value = '';
    $(`[step='${current_step - 1}']`)[0].classList.value = 'active';
    //set data display changes
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step - 1}']`)[0].classList.value = 'active';
}

async function checkDescriptionNeedsLinkExamples(){
    //function returns true if there is no need to add more data
    let description_check_array = $('#description')[0].value.match(/website|cart|checkout|add to cart/gi);
    if (description_check_array === null) {
        description_check_array = [];
    }
    let example_check_for_links = (/(?:https?:\/\/)?(?:\w+\.)?(\w+\.)+\w{3,}/g).test($('#examples')[0].value);
    let check = true;
    if (description_check_array.length > 2 && !example_check_for_links) {
        check = await customDialogResponse(`It looks like there was mention of website issues, but there were no links provided in the examples. Do you want to continue without adding links to website issue areas?`,'Continue','Go Back');
    }
    return check;
}

async function start_new_ticket(){
    if(await customDialogResponse('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Go Back')){
        window.location.reload();
    }
}

function selectReplicability(el){
    $('div[replicable].selected').removeClass('selected');
    el.target.classList.value = 'selected';
}

function newCookieData(){
    //use Date.now() to get current unix time stamp. Can be accessed later as a date by using new Date({{timestamp}})
    function scrubBadJsonChar(string){
        return string.replaceAll(/[\"\\\;]/g,'');
    }
    function subObjectCreator(table){
        let temp_object = {};
        $(`#${table}-table tr`).each(function(index,el){
            temp_object[`line_${index + 1}`] = scrubBadJsonChar(el.querySelector('input').value);
        })
        return temp_object;
    }
    let bug_object = {
        crm: scrubBadJsonChar($('input#crm')[0].value),
        area: scrubBadJsonChar($('input#systemArea')[0].value),
        replicable: $('[choice-selector] .selected').attr('replicable'),
        steps: subObjectCreator('steps'),
        description: scrubBadJsonChar($('#description')[0].value),
        expected: scrubBadJsonChar($('#expected')[0].value),
        screenshots: subObjectCreator('screenshot'),
        videos: subObjectCreator('video'),
        examples: scrubBadJsonChar($('#examples')[0].value),
        errors: scrubBadJsonChar($('#errors')[0].value)
    }
    setCookie(`bug_${Date.now()}`,JSON.stringify(bug_object));
}

function buildPastTicketDivs(array){
    $('#list-toggle')[0].innerText = array.length;
    for (i=0;i<array.length;i++) {
        bug_array_split = array[i].split('=');
        let date = new Date(parseInt(bug_array_split[0].split("_")[1])).toString().substring(0,24);
        let bug_data = bug_array_split[1].replaceAll(/"/g,'&quot;');
        let temp_json = JSON.parse(bug_array_split[1]);
        $('past-tickets').append(`<div data="${bug_data}">${date}<br>CRM: ${temp_json.crm}<br>Description: ${temp_json.description}</div>`);
    }
}

function oldTicketDataPrint(el){
    //get ticket data from clicked element and pass to generateTicket function
    let ticket_data = el.target.getAttribute('data');
    generateTicket(JSON.parse(ticket_data));
}

function displayPastTickets(){
    let bug_array = document.cookie.split('; ').filter((value) => (/^bug\_\d+/).test(value));
    if (bug_array.length > 0) {
        buildPastTicketDivs(bug_array);
        $('past-tickets > div').on('click',oldTicketDataPrint);
        $('#past-ticket-container').show();
    }
}

$(window).ready(function (){
    $('div[replicable]').on('click',selectReplicability);
    $('#list-toggle').on('click', function (){
        $('past-tickets').toggleClass('active');
    });
    displayPastTickets();
});
