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
    ticket_data.associatedInfo = {};
    if ($('#associated-check')[0].checked) {
        ticket_data.associatedInfo.Salesforce_Ticket_ID = $('#ticketID')[0].value;
        ticket_data.associatedInfo.Shortcut_Story_Link = $('#storyLink')[0].value;
    } else {
        ticket_data.associatedInfo.Approving_Agent_Name = $('#agentName')[0].value;
        ticket_data.associatedInfo.Ticket_Reason = $('#ticketReason')[0].value;
    }
    if (copyable) {
        let ticket = `**Data Fix**
Business Name:
${ticket_data.businessName}

Store ID:
${ticket_data.storeID}

Store Vertical:
${ticket_data.vertical}

`;
        for (data in ticket_data.associatedInfo) {
            ticket += `${data.replaceAll('_',' ')}: 
${ticket_data.associatedInfo[data]}

`;
        };
        ticket += `Details:
${ticket_data.details}`;
        $('#ticket-wrapper')[0].value = ticket;
        $('#ticket-container').removeClass('hide');
    } else {
        let html = `**Data Fix**<br>
        Business Name:<br>
        ${ticket_data.businessName}<br>
        <br>
        Store ID:<br>
        ${ticket_data.storeID}<br>
        <br>
        Store Vertical:<br>
        ${ticket_data.vertical}<br>
        <br>
        `;
        for (data in ticket_data.associatedInfo) {
            html += `${data.replaceAll('_',' ')}:<br>
            ${ticket_data.associatedInfo[data]}<br>
            <br>
            `;
        };
        html += `Details:<br>
        ${ticket_data.details}`;
        $('#data-wrapper').html(html);
    }
}
function validateData(){
    //close any error popups currently open
    Close_error_growl();
    //create object to be passed to error popup if needing to display an error /common/actions/popup.js - popup_error_growl() function
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
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 2:
            if ($('#associated-check')[0].checked) {
                if (!(/^\d+$/).test($.trim($('#ticketID')[0].value))) {
                    bad_object.list['ticketID'] = 'Ticket ID needs to be entered. Alpha characters should not be present here.'
                }
                if (!(/^https:\/\/app\.shortcut\.com\/rainretail\/story\/\d+$/).test($.trim($('#storyLink')[0].value)) && $('#storyLink')[0].value != 'None Assigned') {
                    bad_object.list['storyLink'] = `Copy and paste the story link from Salesforce here. If there isn't one enter "None Assigned" as the value.`;
                }
            } else {
                if (isNA($('#agentName')[0].value) || !(/^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/).test($.trim($('#agentName')[0].value))) {
                    bad_object.list['agentName'] = 'Enter the name of the agent that approved this task.(First Last)';
                }
                if ($('#ticketReason')[0].value.length < 40) {
                    bad_object.list['ticketReason'] = 'Please enter a detailed reason we are doing this data fix.';
                }
            };
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        case 3:
            if ($('#details')[0].value.length < 75) {
                bad_object.list['details'] = "Not enough Details! Make sure to include all area's that are needing adjusted and include all id's so that nothing needs to be hunted down."
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                compileData();
                nextStep(current_step);
            };
            break;
        default:
            console.error(`Something isn't working right. current_step value ${current_step}`);
    }
}

function displayTicketFields(event){
    let associated_ticket = event.target.checked;
    if (associated_ticket) {
        $('#associated-ticket')[0].classList = 'visible';
        $('#ticket-reason')[0].classList = 'hidden';
    } else {
        $('#associated-ticket')[0].classList = 'hidden';
        $('#ticket-reason')[0].classList = 'visible';
    }
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

async function start_new_ticket(){
    if(await customDialogResponse('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Go Back')){
        window.location.reload();
    }
}

$(document).ready(function(){
    let vertical_list = ["Rain","Like Sew","Jewel","Music","Dive","Outdoor"];
    $(vertical_list).each(function(index,el){
        $('#vertical').append(`<option value="${el}">${el}</option>`);
    });
    $('#associated-check').on('change',displayTicketFields);
})