function _urlRegEx(url_string){
    url_string = url_string.replace(/[\?\\\/]/g,"\\\$&");
    return new RegExp(url_string, 'g');
}
function hasSlackLink(string){
    return new RegExp(/(?:https?\/\/)?raindev\.slack\.com\/archives\//).test(string);    
}
function checkLinkList(list){
    return_value = false;
    //check that there are rows to look through
    if (list.length < 1) {
        return_value = true;
    } else {
        list.each(function (){
            let row_data = $(this)[0].value;
            if(row_data != ''){//if there is data in the row, check how many links are in it
                //set row_data to either an empty array or return array from match check
                row_data = row_data.match(/https?/g) || [];
                if(row_data.length > 1){
                    //found more than one potential link in a line
                    //get index for second beginning
                    let dup_link_check = {
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
                    let first_link = $(this)[0].value.substr(0, dup_link_check.match_2);
                    if ($(this)[0].value.match(_urlRegEx(first_link)).length > 1) {
                        $(this)[0].value = first_link;
                    } else {
                        return_value = true;
                    }
                }
            }
        });
        list.each(function (){
            $(this)[0].value = $(this)[0].value.replaceAll(/\s/g,'');
            if($(this)[0].value === '' || !RegExp(/^(?:https?:\/\/)drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/).test($(this)[0].value)){
                return_value = true;
            }
        });
    }
    return return_value;
}
function duplicateLinksFound(){
    let duplicates = false;
    let link_list = '';
    $('#links-content tr input').each(function (){
        link_list += $(this)[0].value + ',';
    })
    $('#links-content tr input').each(function (){
        let temp_regex = new RegExp($(this)[0].value.replace(/[\?\\\/]/g,"\\\$&"), 'g');
        if(link_list.match(temp_regex).length > 1){
            duplicates = true;
        }
    })
    return duplicates;
}
async function validateData(){
    Close_error_growl();
    let bad_object = {
        type: 'generate',
        list: {}
    };
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    switch (current_step) {
        case 1:
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
        case 2:
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
                    if($(this)[0].value === '' && steps_true != false){
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
        case 3:
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
        case 4:
            //This still needs refactored!
            //screenshot
            if(checkLinkList($('#screenshot-table tr input'))){
                bad_object.list['screenshot'] = 'One (or more) of the screenshots provided are not an expected domain, is empty, or there are potentially more than one link in the same line.';
            }
            //video
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
        case 5:
            //check examples box
            let examples = $('#examples')[0].value;
            if(RegExp(/rainadmin|quiltstorewebsites|jewel360|musicshop360/).test(examples)){
                bad_object.list['examples_links'] = 'Please make sure that all links do not point to an admin domain such as rainadmin.com. If there is a report or a product that has an issue please write the report name and filters used to find the issue or and unique ids needed to find the data.';
            }
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(examples) || examples === ''){
                bad_object.list['examples_blank'] = 'Examples cannot be blank or say n/a.';
            }
            //check errors box
            let errors = $('#errors')[0].value;
            if(RegExp(/^[nN](?:\\|\/)?[aA]/).test(errors) || errors === ''){
                bad_object.list['errors'] = 'Errors box cannot be blank or n/a. If there are no visible errors associated with the problem behavior, please write "No Console Errors Seen".';
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
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

function nextStep(current_step){
    //Move to next step
    $(`[step='${current_step}']`)[0].classList.value = 'complete';
    $(`[step='${current_step + 1}']`)[0].classList.value = 'active';
    //move to next data set
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step + 1}']`)[0].classList.value = 'active';
    if(current_step === 1){
        $('button[prev]').removeClass('hide');
    }
    if(current_step === 4){
        $('button[next]').addClass('hide');
        $('button[finish]').removeClass('hide');
    }
}

function markdownScrubbing(string_data){
    let characters_to_adjust = new RegExp(/#/g);
    return string_data.replaceAll(characters_to_adjust, "$& ");
}

function generateTicket(passed_object = {}){
    let data;
    if (!Object.keys(passed_object).length) {
        data = {
            crm: $('#crm')[0].value,
            area: $('#systemArea')[0].value,
            replicable: $('[replicable].selected').attr('replicable'),
            steps: () => {
                let string = '';
                $('#steps-table tr input').each(function (index){
                    let step = index + 1;
                    string += `${index + 1}. ` + $(this)[0].value + '\n';
                });
                return string;
            },
            description: $('#description')[0].value,
            expected: $('#expected')[0].value,
            screenshots: () => {
                let string = '';
                $('#screenshot-table tr input').each(function (){
                    string += $(this)[0].value + '\n\n';
                });
                return string;
            },
            videos: () => {
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
        //build object similar to above from passed object data
        data = {
            crm: passed_object.crm,
            area: passed_object.area,
            replicable: passed_object.replicable,
            steps: () => {
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
            screenshots: () => {
                let string = '';
                let index = 1;
                for (row in passed_object.screenshots) {
                    string += `${index}. ` + passed_object.screenshots[row] + '\n';
                    index++;
                }
                return string;
            },
            videos: () => {
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
    $('#ticket-container').removeClass('hide');
    $('#ticket-container > div > textarea')[0].focus();
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
