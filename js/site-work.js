//variable to hold what work type is being done
var work_type_selected;
/*function handles moving through flow*/
function validateData(){
    //close any open errors
    Close_error_growl();
    //prep an object for any potential errors
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step user is working on
    let current_step = parseInt($('#info-tabs .active').attr('step'));
    //run check based on step user is on
    switch (current_step){
        //check site work is selected and a valid crm is entered
        case 1:
            if(!(/^(?:[Cc][Rr][Mm])?\d{3,}$/).test($('input#crm')[0].value)){
                bad_object.list['crm'] = 'Please enter a valid CRM {(crm)12381}';
            }
            if (!$('[choice-selector] .selected').length) {
                bad_object.list['work'] = 'Please select work type to be done.';
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        //run checks for data inputed based on work type selected in step 1
        case 2:
            if(work_type_selected === 'site'){
                bad_object.list = checkSiteWork();
                if (Object.entries(bad_object.list).length) {
                    popup_error_growl(bad_object);
                } else {
                    compileData(work_type_selected);
                    nextStep(current_step);
                };
            }
            if(work_type_selected === 'template'){
                bad_object.list = checkTemplateWork();
                if (Object.entries(bad_object.list).length) {
                    popup_error_growl(bad_object);
                } else {
                    compileData(work_type_selected);
                    nextStep(current_step);
                };
            }
            break;
        //compile data into ticket modal for user to copy
        case 3:
            let temp_text = `Store ID: ${$('#crm')[0].value}\n\n`;
            if (work_type_selected === 'site') {
                let rows = $('#work-table tr td:nth-child(2)');
                rows.each(function (index, el){
                    temp_text += `***Page ${index + 1}***\nWork: ${el.querySelector('select').value }\n\nPage: ${el.querySelector('#url').value}\nScreenshot ${el.querySelector('#screenshot').value}\n\n`;
                    if (el.querySelector('#video').value != '') {
                        temp_text += `Video: ${el.querySelector('#video').value}\n\n`;
                    }
                    temp_text += `Details: ${el.querySelector('textarea').value}\n\n\n`
                });
            }
            if (work_type_selected === 'template') {
                temp_text += `Update Type: ${$('#template select')[0].value}\n\nTemplate Number: ${$('#template #number')[0].value}\n\nTemplate CRM: ${$('#template #crm')[0].value}\n\nCustomer Notes: \n${$('#template textarea')[0].value}`;
            }
            $('#ticket-container > div > textarea')[0].value = temp_text;
            $('#ticket-container').removeClass('hide');
            break;
        default:
            break;
    }
}
/*function checks that values for site work to be done is good and isn't missing anything*/
function checkSiteWork(){
    let list_object = {};
    let rows = $('#work-table tr td:nth-child(2)');
    //loop through rows and make sure each part of the row has correct data for it's type, if misisng create an error object to be returned.
    rows.each(function (index, el){
        if (el.querySelector('select').value === 'Select an Option') {
            list_object['work_type'] = 'Please select a type of work for all rows.';
        }
        if (!(/^(?:https?\:\/\/)?(?:\w+\.)?(?:\w{2,}\/?)+\.\w{2,}(?:(?:\/[\w\-\_]+)+\.\w{2,})?\/?$/).test(el.querySelector('#url').value)) {
            list_object['url'] = 'Make sure each row has a url for the page that needs work done.';
        }
        if ((/rainadmin|quiltstorewebsites|musicshop360|jewel360/g).test(el.querySelector('#url').value)) {
            list_object['restricted_domain'] = 'Use domains from the customers site. Do not use admin domains. (i.e. rainadmin, jewel360, musicshop360)';
        }
        if (!(/^.*drive\.google\.com\/.*view/).test(el.querySelector('#screenshot').value)) {
            list_object['screenshot'] = 'Please enter a google drive screenshot link for each row.';
        }
        if (!(/^.*drive\.google\.com\/.*view/).test(el.querySelector('#video').value) && el.querySelector('#video').value != '') {
            list_object['video'] = 'Make sure any videos given are a google drive link.';
        }
        if (el.querySelector('textarea').value === '') {
            list_object['details'] = 'Please give some details of what work needs to be done for each row.';
        }
    });
    return list_object;
}
/*function checks data given for template work is good and isn't missing anything*/
function checkTemplateWork() {
    let list_object = {};
    if ($('#template select')[0].value === 'Select an Option') {
        list_object['update'] = 'Please select type of work to be done.';
    }
    if ($('#template #number')[0].value === '') {
        list_object['number'] = 'Enter a Template number';
    }
    if ($('#template #crm')[0].value === '') {
        list_object['crm'] = 'Enter the CRM of the template.';
    }
    if ($('#template textarea')[0].value === '') {
        list_object['notes'] = "Enter any notes from the customer about what they like or don't like, color requests, etc.";
    }
    return list_object;
}
/*function builds visible data for step three based on work type for user to confirm info before generating ticket*/
function compileData(type){
    let html = '';
    if (type === 'site') {
        let rows = $('#work-table tr td:nth-child(2)');
        rows.each(function (index, el){
            html += `***Page ${index + 1}***<br>
            Work: ${el.querySelector('select').value }<br><br>
            Page: ${el.querySelector('#url').value}<br><br>
            Screenshot ${el.querySelector('#screenshot').value}<br><br>`;
            if (el.querySelector('#video').value != '') {
                html += `Video: ${el.querySelector('#video').value}<br><br>`;
            }
            html += `Details: ${el.querySelector('textarea').value.replaceAll('\n','<br>')}<br><br><br>`
        });
    }
    if (type === 'template') {
        html = `Update Type: ${$('#template select')[0].value}<br><br>
        Template Number: ${$('#template #number')[0].value}<br><br>
        Template CRM: ${$('#template #crm')[0].value}<br><br>
        Customer Notes: <br>${$('#template textarea')[0].value.replaceAll('\n','<br>')}`;
    }
    $('#confirm-content data')[0].innerHTML = html;
}
/*function adds a new row to the table being interacted with(currently only for site work)*/
function addTableRow(table){
    $(`#${table}`).append(`<tr>
        <td>
            <span onclick='deleteRow(this)'>X</span>
        </td>
        <td>
            <div>
                <select>
                    <option>Select an Option</option>
                    <option value="fix">Site Fix</option>
                    <option value="custom">Custom Work</option>
                </select>
                <div><input id="url" type="text" placeholder="Page URL" /></div>
            </div>
            <div>
                <div><input id="screenshot" type="text" placeholder="screenshot" /></div>
                <div><input id="video" type="text" placeholder="video(optional)" /></div>
            </div>
            <textarea placeholder="details"></textarea>
        </td>
    </tr>`);
}
/*function removes the last row from the table being interacted with*/
function removeTableRow(table){
    $(`#${table} tr:last-child`).remove();
}
/*function deletes specific row being interacted with*/
function deleteRow(el){
    $(el).parent().parent().remove();
}
/*function updates which second step data displays from clicking work type on first step*/
function displayWorkContent(type){
    work_type_selected = type;
    $('#work-content > div').hide();
    $(`#${type}`).show();
}
/*function confirms with user they want to remove all data and start over before refreshing the page*/
async function start_new_ticket(){
    if(await customDialogResponse('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Cancel')){
        window.location.reload();
    }
}
/*function copies current ticket data in popup modal to computers clipboard*/
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
/*function handles work selector*/
function selectWork(el){
    $('div[work].selected').removeClass('selected');
    el.target.classList.value = 'selected';
    displayWorkContent($(el.target).attr('work'));
}
/*after window finishes loading this sets an event listener on the selector elements*/
$(window).ready(function (){
    $('div[work]').on('click',selectWork);
});