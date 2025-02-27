//variable to hold what work type is being done
let work_type_selected;
/*function handles moving through flow*/
async function validateData(){
    //close any open errors
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
    let error_popup = await import('../../modules/error-popup/popup.js');
    //prep an object for any potential errors
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step user is working on
    let current_step = parseInt(document.querySelector('#info-tabs .active').getAttribute('step'));
    //run check based on step user is on
    switch (current_step){
        //check site work is selected and a valid crm is entered
        case 1:
            if(!(/^(?:[Cc][Rr][Mm])?\d{3,}$/).test(document.querySelector('input#crm').value)){
                bad_object.list['crm'] = 'Please enter a valid CRM {(crm)12381}';
            }
            if (!document.querySelectorAll('[choice-selector] .selected').length) {
                bad_object.list['work'] = 'Please select work type to be done.';
            }
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
        //run checks for data inputed based on work type selected in step 1
        case 2:
            if(work_type_selected === 'site'){
                bad_object.list = checkSiteWork();
                if (Object.entries(bad_object.list).length) {
                    error_popup.default(bad_object);
                } else {
                    compileData(work_type_selected);
                    nextStep(current_step);
                };
            }
            if(work_type_selected === 'template'){
                bad_object.list = checkTemplateWork();
                if (Object.entries(bad_object.list).length) {
                    error_popup.default(bad_object);
                } else {
                    compileData(work_type_selected);
                    nextStep(current_step);
                };
            }
            break;
        //compile data into ticket modal for user to copy
        case 3:
            let temp_text = `Store ID: ${document.querySelector('#crm').value}\n\n`;
            if (work_type_selected === 'site') {
                let rows = document.querySelectorAll('#work-table tr td:nth-child(2)');
                rows.forEach(function (el, index){
                    temp_text += `***Page ${index + 1}***\nWork: ${el.querySelector('select').value }\n\nPage: ${el.querySelector('#url').value}\nScreenshot ${el.querySelector('#screenshot').value}\n\n`;
                    if (el.querySelector('#video').value != '') {
                        temp_text += `Video: ${el.querySelector('#video').value}\n\n`;
                    }
                    temp_text += `Details: ${el.querySelector('textarea').value}\n\n\n`
                });
            }
            if (work_type_selected === 'template') {
                temp_text += `Update Type: ${document.querySelector('#template select').value}\n\nTemplate Number: ${document.querySelector('#template #number').value}\n\nTemplate CRM: ${document.querySelector('#template #crm').value}\n\nCustomer Notes: \n${document.querySelector('#template textarea').value}`;
            }
            document.querySelector('#ticket-container > div > textarea').value = temp_text;
            document.querySelector('#ticket-container').classList.remove('hide');
            break;
        default:
            break;
    }
}
/*function checks that values for site work to be done is good and isn't missing anything*/
function checkSiteWork(){
    let list_object = {};
    let rows = document.querySelectorAll('#work-table tr td:nth-child(2)');
    //loop through rows and make sure each part of the row has correct data for it's type, if misisng create an error object to be returned.
    rows.forEach(function (el){
        if (el.querySelector('select').value === 'Select an Option') {
            list_object['work_type'] = 'Please select a type of work for all rows.';
        }
        if (!(/^(https?\:\/\/)?(\w+\.)?([\w\-\_]{2,}\/?)+\.\w{2,}((\/[\w\-\_]+)+(\.\w{2,})?)?\/?(\?[\w=&]+)?$/).test(el.querySelector('#url').value)) {
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
    if (document.querySelector('#template select').value === 'Select an Option') {
        list_object['update'] = 'Please select type of work to be done.';
    }
    if (document.querySelector('#template #number').value === '') {
        list_object['number'] = 'Enter a Template number';
    }
    if (document.querySelector('#template #crm').value === '') {
        list_object['crm'] = 'Enter the CRM of the template.';
    }
    if (document.querySelector('#template textarea').value === '') {
        list_object['notes'] = "Enter any notes from the customer about what they like or don't like, color requests, etc.";
    }
    return list_object;
}
/*function builds visible data for step three based on work type for user to confirm info before generating ticket*/
function compileData(type){
    let html = '';
    if (type === 'site') {
        let rows = document.querySelectorAll('#work-table tr td:nth-child(2)');
        rows.forEach(function (el, index){
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
        html = `Update Type: ${document.querySelector('#template select').value}<br><br>
        Template Number: ${document.querySelector('#template #number').value}<br><br>
        Template CRM: ${document.querySelector('#template #crm').value}<br><br>
        Customer Notes: <br>${document.querySelector('#template textarea').value.replaceAll('\n','<br>')}`;
    }
    document.querySelector('#confirm-content data').innerHTML = html;
}
/*function adds a new row to the table being interacted with(currently only for site work)*/
function addTableRow(table){
    document.querySelector(`#${table}`).insertAdjacentHTML('beforeend', `<tr>
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
    document.querySelector(`#${table} tr:last-child`).remove();
}
/*function deletes specific row being interacted with*/
function deleteRow(el){
    el.parentElement.parentElement.remove();
}
/*function updates which second step data displays from clicking work type on first step*/
function displayWorkContent(type){
    work_type_selected = type;
    document.querySelectorAll('#work-content > div').forEach(el => el.style.display = 'none');
    document.querySelector(`#${type}`).style.display = '';
}
/*function confirms with user they want to remove all data and start over before refreshing the page*/
async function start_new_ticket(){
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if(await custom_dialogue.default('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Cancel')){
        window.location.reload();
    }
}
/*function handles work selector*/
function selectWork(el){
    document.querySelector('div[work].selected')?.classList.remove('selected');
    el.target.classList.add('selected');
    displayWorkContent((el.target).attributes.work.value);
}
/*after window finishes loading this sets an event listener on the selector elements*/
window.addEventListener('load', function() {
    document.querySelectorAll('div[work]').forEach(el => el.addEventListener('click',selectWork));
    //sets event listener on copy button
    document.querySelector('.btn-copy').addEventListener('click', async () =>{
        const copyText =  await import('/Rain-Support-Tools/src/modules/copy-data/copy-data.js');
        copyText.default(document.querySelector('#ticket-container > div > textarea'));
    });
});