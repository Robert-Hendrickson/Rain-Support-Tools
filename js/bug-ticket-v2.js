function validateData(){
    Close_error_growl();
    let bad_object = {
        type: 'generate',
        list: {}
    };
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    switch (current_step) {
        case 1:
            let crm = $('#crm')[0].value != '' && $('#crm')[0].value.match(/^(?:[c|C][r|R][m|M])?\d{3,}$/);
            let system = $('#systemArea')[0].value != '' && $('#systemArea')[0].value.match(/^\w{4,}$/);
            let replicable = $('[replicable].selected').length;

            if(crm && system && replicable) {
                nextStep(current_step);
            } else {
                let bad_object = {
                    type: 'generate',
                    list: {}
                };
                if(!crm){
                    bad_object.list['crm'] = 'The CRM needs to be a valid CRM.(3 digits or more)';
                }
                if(!system){
                    bad_object.list['system'] = 'Please enter the area of the system that is affected.';
                }
                if(!replicable){
                    bad_object.list['replicable'] = 'Please select if this is replicable or not.';
                }
                popup_error_growl(bad_object);
                //this will pass the elements that didn't succeed to another function to list the area's needing fixed before moving on
            };
            break;
        case 2:
            let number_of_steps = $('#steps-table tbody tr').length > 0;
            let steps_true = true;
            $('#steps-table tbody tr input').each(function (){
                if($(this)[0].value === ''){
                    steps_true = false;
                }
            });
            if(number_of_steps && steps_true){
                nextStep(current_step);
            } else {
                bad_object.list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                popup_error_growl(bad_object);
            };
            break;
        case 3:
            let description = {
                el :$('#description')[0],
                value: true
            };
            let expected = {
                el: $('#expected')[0],
                value: true
            };
            if(description.el.value === '' || description.el.value.match(/^[n|N](?:\/|\\)?[a|A]/) != null){
                description.value = false;
            }
            if(expected.el.value === '' || expected.el.value.match(/^[n|N](?:\/|\\)?[a|A]/) != null){
                expected.value = false;
            }
            if(description.value && expected.value){
                nextStep(current_step);
            } else {
                if(!description.value){
                    bad_object.list['description'] = 'Description cannot be empty or n/a. Please describe in detail what is happening.';
                }
                if(!expected.value){
                    bad_object.list['expected'] = 'Expectation cannot be empty or n/a. Please describe the expected outcome that is not being met.';
                }
                popup_error_growl(bad_object);
            }
            break;
        case 4:
            let screenshot_ready = false;
            if($('#screenshot-table tr input').length > 0){
                screenshot_ready = true;
            }
            $('#screenshot-table tr input').each(function (){
                if($(this)[0].value === '' || $(this)[0].value.match(/^(?:https?:\/\/)?drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/) === null){
                    screenshot_ready = false;
                }
            });
            let video_ready = false;
            if($('#video-table tr input').length > 0){
                video_ready = true;
            }
            $('#video-table tr input').each(function (){
                if($(this)[0].value === '' || $(this)[0].value.match(/^(?:https?:\/\/)?drive\.google\.com\/file\/d\/.*\/view(?:\?.+)?$/) === null){
                    video_ready = false;
                }
            });
            let duplicates = false;
            let link_list = '';
            $('#links-content tr input').each(function (){
                link_list += $(this)[0].value + ',';
            })
            $('#links-content tr input').each(function (){
                
                let temp_regex = new RegExp($(this)[0].value.replaceAll('?','\\\?'),'g');
                if(link_list.match(temp_regex).length > 1){
                    duplicates = true;
                }
            })
            if(screenshot_ready && video_ready && !duplicates){
                nextStep(current_step);
            } else {
                if(!screenshot_ready){
                    bad_object.list['screenshot'] = 'Please make sure you have at least one screenshot of the trouble area showing what is wrong.';
                }
                if(!video_ready){
                    bad_object.list['video'] = 'Please make sure you have at least one video of the trouble area showing what is wrong.';
                }
                if(duplicates){
                    bad_object.list['duplicates'] = 'One or more of the links provided is being used twice, or you have a blank row. Please make sure all links are unique and that there are no blank rows before moving on.';
                }
                bad_object.list['reminder'] = 'Make sure that all links point to a google drive file that is shared with all Rain Emails so that they can be seen by the Dev/Prod teams.';
                popup_error_growl(bad_object);
            };
            break;
        case 5:
            //check examples box
            let examples = $('#examples')[0].value;
            let examples_ready = true;
            if(examples.match(/rainadmin|quiltstorewebsites|jewel360|musicshop360/) != null){
                examples_ready = false;
            }
            if(examples.match(/^[nN](?:\\|\/)?[aA]/) != null || examples === ''){
                examples_ready = false;
            }
            //check errors box
            let errors = $('#errors')[0].value;
            let errors_ready = true;
            if(errors.match(/^[nN](?:\\|\/)?[aA]/) != null || errors === ''){
                errors_ready = false;
            }
            if(examples_ready && errors_ready){
                generateTicket();
            } else {
                if(!examples_ready){
                    bad_object.list['examples'] = 'Examples cannot be blank or say n/a. Please make sure that all links do not point to an admin domain such as rainadmin.com. If there is a report or a product that is an issue please write the report name and filters used to find the issue or any unique ids needed to find the data.';
                }
                if(!errors_ready){
                    bad_object.list['errors'] = 'Errors box cannot be blank or n/a. If there are no visible errors associated with the problem behavior, please write "No Console Errors Seen".';
                }
                popup_error_growl(bad_object);
            }
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

function generateTicket(){
    let data = {
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
    $('#ticket-container > div > textarea')[0].value = `**LOCATION**
Store ID:
${data.crm}

System Area:
${data.replicable}

Can you recreate the problem on your demo site (if yes please continue, if no use the "Bug - non reproducible" macro)?

STEPS TO REPRODUCE:
${data.steps()}

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:
${data.description}

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${data.examples}

Screenshot:
${data.screenshots()}

Video:
${data.videos()}

Console Info:

EXPECTED RESULTS:
${data.expected}

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
    let new_row_number = $(`#${table} tbody tr`).length + 1;
    $(`#${table} tbody`).append(`<tr><td>Step ${new_row_number}<input placeholder="Enter Step ${new_row_number}" type="text" /></td></tr>`)
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

function start_new_ticket(){
    if(window.confirm('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?')){
        window.location.reload();
    }
}

function selectReplicability(el){
    $('div[replicable].selected').removeClass('selected');
    el.target.classList.value = 'selected';
}

$(window).ready(function (){
    $('div[replicable]').on('click',selectReplicability);
});
