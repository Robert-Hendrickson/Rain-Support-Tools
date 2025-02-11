/* function used to find current step at any time */
function getCurrentStep() {
    return parseInt($("#info-tabs .active")[0].getAttribute('step'));
}
function isNA(string) {
    return (/^n[\/\s]?a$/i).test($.trim(string));
}
function compileData(copyable = false) {
    let ticket_data = {};
    ticket_data.businessName = $('#businessName')[0].value;
    ticket_data.storeID = $('#storeID')[0].value;
    ticket_data.vertical = $('#vertical')[0].value;
    ticket_data.details = $('#details')[0].value;
    ticket_data.Salesforce_Ticket_ID = $('#ticketID')[0].value;
    ticket_data.Shortcut_Story_Link = $('#storyLink')[0].value;
    ticket_data.Approving_Agent_Name = $('#agentName')[0].value;
    ticket_data.Ticket_Reason = $('#ticketReason')[0].value;
    if (copyable) {
        let ticket = `**Data Fix**
**Company Info**
Business Name:
${ticket_data.businessName}

Store ID:
${ticket_data.storeID}

Store Vertical:
${ticket_data.vertical}

**Connected Bug**
Salesforce Ticket ID:
${ticket_data.Salesforce_Ticket_ID}

Shortcut Story Link:
${ticket_data.Shortcut_Story_Link}

**Case Info**
Approving Team Lead's Name:
${ticket_data.Approving_Agent_Name}

Ticket Approval Reason:
${ticket_data.Ticket_Reason}

**Fix Details**
Details:
${ticket_data.details}
`;
        $('#ticket-wrapper')[0].value = ticket;
        $('#ticket-container').removeClass('hide');
    } else {
        let html = `**Data Fix**<br>
**Company Info**<br>
Business Name:<br>
${ticket_data.businessName}<br>
<br>
Store ID:<br>
${ticket_data.storeID}<br>
<br>
Store Vertical:<br>
${ticket_data.vertical}<br>
<br>
**Connected Bug**<br>
Salesforce Ticket ID:<br>
${ticket_data.Salesforce_Ticket_ID}<br>
<br>
Shortcut Story Link:<br>
${ticket_data.Shortcut_Story_Link}<br>
<br>
**Case Info**<br>
Approving Team Lead's Name:<br>
${ticket_data.Approving_Agent_Name}<br>
<br>
Ticket Approval Reason:<br>
${ticket_data.Ticket_Reason}<br>
<br>
**Fix Details**<br>
Details:<br>
${ticket_data.details}`;
        $('#data-wrapper').html(html);
    }
}
async function validateData(){
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
    let current_step = getCurrentStep();
    switch(current_step){
        case 1:
            let check_list = [$('#businessName')[0].value,$('#storeID')[0].value,$('#vertical')[0].value]
            //check for business name can't be empty or na
            if (check_list[0] === '' || isNA(check_list[0])) {
                bad_object.list['buisness'] = 'Business Name is Required to move forward.';
            };
            if (!(/^(:?crm)?\d{2,}$/i).test($.trim(check_list[1]))) {
                bad_object.list['storeID'] = 'Make sure the Store ID matches expected out put (crm12381)';
            }
            if (check_list[2] === '') {
                bad_object.list['vertical'] = 'A Vertical Needs to be Selected From the Dropdown.';
            };
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 2:
            let link_fields = [];
            if ($.trim($('#ticketID')[0].value) === '') {
                link_fields.push('Ticket ID');
            }
            if ($.trim($('#storyLink')[0].value) === '') {
                link_fields.push('Shortcut Link');
            }
            if ($('#storyLink')[0].value != '' && !(/^https:\/\/app\.shortcut\.com\/rainretail\/story\/\d+/).test($.trim($('#storyLink')[0].value))) {
                bad_object.list['shortcut'] = 'Shortcut link should either be the Shortcut Story Link from the Parent Case in Salesforce or NULL.';
            }
            if (isNA($('#agentName')[0].value) || !(/^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/).test($.trim($('#agentName')[0].value))) {
                bad_object.list['agentName'] = 'Enter the name of the agent that approved this task.(First Last)';
            }
            if ($('#ticketReason')[0].value.length < 40) {
                bad_object.list['ticketReason'] = 'Please enter a detailed reason we are doing this data fix.';
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                if (!link_fields.length) {
                    nextStep(current_step);
                } else {
                    function getEmptyFields(){
                        let empty_fields_string = '';
                        for (i = 0; i < link_fields.length; i++) {
                            empty_fields_string += `${link_fields[i]}<br>`;
                        }
                        return empty_fields_string;
                    }let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
                    if (await custom_dialogue.default(`The below fields were left empty.<br><br>${getEmptyFields()}<br>If this was intentional click continue. Otherwise click cancel and enter the relavent info.`,'Continue','Cancel')) {
                        nextStep(current_step);
                    }
                }
            };
            break;
        case 3:
            if ($('#details')[0].value.length < 75) {
                bad_object.list['details'] = "Not enough Details! Make sure to include all area's that are needing adjusted and include all id's so that nothing needs to be hunted down."
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                compileData();
                nextStep(current_step);
            };
            break;
        default:
            console.error(`Something isn't working right. current_step value ${current_step}`);
    }
}

function copyTicket() {
    // Get the text field
    const copyText = $('#ticket-container > div > textarea')[0];

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //console.log("Copied the text: " + copyText.value);
};

async function start_new_ticket(){
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if(await custom_dialogue.default('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Go Back')){
        window.location.reload();
    }
}

$(document).ready(function(){
    let vertical_list = ["Rain","Like Sew","Jewel","Music","Dive","Outdoor"];
    $(vertical_list).each(function(index,el){
        $('#vertical').append(`<option value="${el}">${el}</option>`);
    });
})