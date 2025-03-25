//set variables to be called and checked later
let action_type = [];
let target_row;
let domain_data;
/*function returns a boolean response to check that the domain entered passes the regex test*/
function domaincheck() {
    let domain = document.getElementById('domain').value;
    return RegExp(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(domain);
}
/*returns an array that is used to set the value of domain_data, [(true/false),{the domain or sub domain beginning}]*/
function isSubDomain(){
    return [(/^[\w\-]+\.[\w\-]+\.\w{2,}$/).test(document.getElementById('domain').value),document.getElementById('domain').value.match(/^[\w-]+/g)[0]];
}
/*deletes the row that was clicked*/
function deleteRow(el){
    el.parentElement.parentElement.remove()
}
/*returns the element that is the parent of the parent of the element clicked on, used in editing a row of dns record data to pull full row regardless of which input box is clicked on*/
function getRow(el){
    return el.parentElement.parentElement;
}
/*function is used in step two to check that each set of data (adding, removing, updating) has at least one row of data. If any active data set has no rows, returns an error*/
function checkForEmptyRows(){
    let potential_errors = {};
    //loop through active types and make sure no table is empty. If it is create a growl message.
    for(a=0;a<action_type.length;a++){
        if (!document.querySelectorAll(`#${action_type[a]}-table > tbody > tr`).length) {
            potential_errors[action_type[a].replace('-','_')] = `The ${action_type[a].replace('-',' ').toUpperCase()} section doesn't have any data. Please make sure there is at least one record for each action type selected in first step. If incorrect options are listed, click previous button to edit which actions need to be considered for ticket progression.`;
        }
    }
    return potential_errors;
}
/*function is used to validate saving edits to record rows based on the record type it is*/
function checkValues(record_data){
    let potential_errors = {};
    //check record name value exists
    if (record_data.name === ''){
        potential_errors['record_name'] = 'Enter a value for the record Name.';
        if(!domain_data[0]){
            potential_errors['record_name'] += ' If the data given to you by a customer has no value for the Name, please confirm with the customer that this is intentional. If confirmed please enter "@" as the value.';
        }
    }
    //check entered data is usable for record type selected
    switch (record_data.type){
        case 'A':
            /*name is being checked at the beginning before switch. May update in future
            if (record_data.name === '') {
                potential_errors['a_record_name'] = 'Enter a value for the record Name';
            };*/
            if (!(/^(?:\d{1,3}\.){3}\d{1,3}$/).test(record_data.value)) {
                potential_errors['a_record_value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
            };
            break;
        case 'AAAA':
            /*name is being checked at the beginning before switch. May update in future
            if (record_data.name === '') {
                potential_errors['aaaa_record_name'] = 'Enter a value for the record Name';
            };*/
            if (!(/^(?:[a-zA-z0-9]{4}\:){7}[a-zA-z0-9]{4}$/).test(record_data.value)) {
                potential_errors['aaaa_record_value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
            };
            break;
        case 'CNAME':
            /*name is being checked at the beginning before switch. May update in future
            if (record_data.name === '') {
                potential_errors['CNAME_record_name'] = 'Enter a value for the record Name';
            };*/
            if (!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(record_data.value)) {
                potential_errors['CNAME_record_value'] = 'CNAME record value needs to be a domain similar to the following pattern. (_data-string.(sub.)domain.com)';
            };
            break;
        case 'MX':
            /*name is being checked at the beginning before switch. May update in future
            if (record_data.name === '') {
                potential_errors['MX_record_name'] = 'Enter a value for the record Name';
            };*/
            if (!(/^\d+$/).test(record_data.priority)) {
                potential_errors['MX_record_priority'] = 'MX record priority needs to be a number. (10)';
            };
            if (!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(record_data.mailhostname)) {
                potential_errors['MX_record_host'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
            };
            break;
        case 'TXT':
            /*
            if (record_data.name === '') {
                potential_errors['TXT_record_name'] = 'Enter a value for the record Name';
            };*/
            /*this will check for value on txt, need to determine what things we don't want to show in the record. will update at later time
            if (!(/^\d+/).test(record_data.value)) {
                potential_errors['TXT_record_value'] = 'TXT record value needs to be a number. (10)';
            };*/
            break;
        case 'PTR':
            if (record_data.name === '' || !(/(?:\d{1,3}\.){3}\d{1,3}$/).test(record_data.name)) {
                potential_errors['ptr_record_name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
            };
            if (!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(record_data.value)) {
                potential_errors['ptr_record_value'] = 'PTR needs to be a domain (www.domain.com)';
            };
            break;
        case 'SRV':
            /*
            if (record_data.name === '') {
                potential_errors['srv_record_name'] = 'Enter a value for the record Name';
            };*/
            if (!(/\d+$/).test(record_data.priority)) {
                potential_errors['srv_priority'] = 'Priority needs to be a number (10)';
            }
            if (!(/\d+$/).test(record_data.weight)) {
                potential_errors['srv_weight'] = 'Weight needs to be a number (10)';
            }
            if (!(/\d+$/).test(record_data.port)) {
                potential_errors['srv_port'] = 'Port needs to be a number (10)';
            }
            if (!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(record_data.serverhost)) {
                potential_errors['srv_host'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
            }
            break;
        default:
            console.error('Record type not usable');
            break;
    }
    return potential_errors;
}
/*function used to move through flow from step to step*/
async function validateData(){
    //close any open error messages and prep for any possible errors found
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
    let error_popup = await import('../../modules/error-popup/popup.js');
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step number
    let current_step = parseInt(document.querySelector('[step].active').getAttribute('step'));
    switch(current_step){
        case 1:
            //check the domain has been entered and is a valid domain
            if (!domaincheck()) {
                bad_object.list['domain_check'] = 'Please make sure that the domain is correct and not blank.'
            }
            //check an action has been selected
            if (document.querySelectorAll('[action].selected').length) {
                action_type = Array.from(document.querySelectorAll('[action].selected'), (el) => el.attributes.action.value);
                console.log('actions: ' + action_type);
            } else {
                bad_object.list['action_check'] = 'Please select which record action(s) needs to be done.';
            }
            //if any errors were found display error popup
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {//else check subdomain and move to next step
                domain_data = isSubDomain();
                if (domain_data[0]) {
                    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
                    if (await custom_dialogue.default('Our system usually deals in hosting apex domains (testurl.com). The domain you have entered looks to be a sub domain (sub.testurl.com). Do you wish to continue?','Continue','Go Back')) {
                        nextStep(current_step);
                    }
                } else {
                    nextStep(current_step);
                }
            };
            break;
        case 2:
            //check list of records provided don't have problems
            bad_object.list = checkForEmptyRows();
            //if issues found, display error message
            if (Object.entries(bad_object.list).length) {
                error_popup.default(bad_object);
            } else {//else prep next step to display records added to confirm before copying
                if (action_type.includes('add-record')){
                    document.querySelector('[compiled-results] [add-record]').style.display = '';
                } else {
                    document.querySelector('[compiled-results] [add-record]').style.display = 'none';
                }
                if (action_type.includes('correct-record')) {
                    document.querySelector('[compiled-results] [correct-record]').style.display = '';
                } else {
                    document.querySelector('[compiled-results] [correct-record]').style.display = 'none';
                }
                if (action_type.includes('remove-record')){
                    document.querySelector('[compiled-results] [remove-record]').style.display = '';
                } else {
                    document.querySelector('[compiled-results] [remove-record]').style.display = 'none';
                }
                //update step three with record data for confirmation
                compileRecords();
                nextStep(current_step);
            };
            break;
        case 3://build ticket, display text area for copying
            let ticket_text = `DNS Record Changes
Domain: ${document.getElementById('domain').value}

`;
            //compile record data into ticket formatting
            ticket_text += appendRecordChanges();
            //after getting record changes from above line need to add text to the text container
            document.querySelector('#ticket-container textarea').value = ticket_text;
            document.querySelector('#ticket-container').classList.remove('hide');
            break;
        default:
            console.error('Invalid Step ID');
            break;
    }
}
/*funciton compiles ticket info for dns records and returns them as a string formatted for ticket generation*/
function appendRecordChanges(){
    let text_to_append = '';
    for (i=0;i<action_type.length;i++) {
        let record_rows = document.querySelectorAll(`#${action_type[i]}-table > tbody > tr`);
        if (action_type[i] === 'add-record' || action_type[i] === 'remove-record') {
            if (action_type[i] === 'add-record') {
                text_to_append += `-----Records to be Added-----

`;
            }
            if (action_type[i] === 'remove-record') {
                text_to_append += `-----Records to Remove-----

`;
            }
            for (r=0;r<record_rows.length;r++) {
                let row_inputs = record_rows[r].querySelectorAll('td div.data-input');
                text_to_append += `Record #${r+1}:
Type: ${row_inputs[0].innerText}
Name: ${row_inputs[1].innerText}
Value: ${row_inputs[2].innerText}
TTL: ${row_inputs[3].innerText}

`;
            }
        }
        if (action_type[i] === 'correct-record') {
            text_to_append += `-----Records to Correct-----

`;
            for (r=0;r<record_rows.length;r++) {
                let row_inputs = record_rows[r].querySelectorAll('td div.data-input');
                text_to_append += `Record #${r+1}:
**Original Values**
Type: ${row_inputs[0].innerText}
Name: ${row_inputs[1].innerText}
Value: ${row_inputs[2].innerText}
TTL: ${row_inputs[3].innerText}

**New Values**
Type: ${row_inputs[4].innerText}
Name: ${row_inputs[5].innerText}
Value: ${row_inputs[6].innerText}
TTL: ${row_inputs[7].innerText}

`;
            }
        }
    }
    return text_to_append;
}
/*function controls which fields are available for editing when making record changes based on record type*/
function updateFields(record_type){
    if (record_type === 'MX') {
        document.querySelectorAll('#record-entry-box div[srv]').forEach(el => {el.style.display = 'none';});
        document.querySelector('#record-entry-box div[value]').style.display = '';
        document.querySelectorAll('#record-entry-box div[mx]').forEach(el => {el.style.display = '';});
    } else if(record_type === 'SRV') {
        document.querySelector('#record-entry-box div[value]').style.display = 'none';
        document.querySelectorAll('#record-entry-box div[mx]').forEach(el => {el.style.display = 'none';});
        document.querySelectorAll('#record-entry-box div[srv]').forEach(el => {el.style.display = '';});
    } else {
        document.querySelectorAll('#record-entry-box div[srv]').forEach(el => {el.style.display = 'none';});
        document.querySelectorAll('#record-entry-box div[mx]').forEach(el => {el.style.display = 'none';});
        document.querySelector('#record-entry-box div[value]').style.display = '';
    }
}
/*function opens record editor modal with existing values from the row that was selected to edit*/
function openRecordEditor(action,row){
    target_row = row;//hold on to row for later
    //if adding a new row, set empty modal
    if (action === 'add') {
        document.querySelector('select.dns-selector').value = 'Select Type';
        updateFields('Select Type');
        document.querySelector('div[name] input').value = '';
        document.querySelector('div[value] input').value = '';
        document.querySelector('div[ttl] input').value = '';
        document.querySelector('div[priority] input').value = '';
        document.querySelector('div[mail-host-name] input').value = '';
        document.querySelector('div[weight] input').value = '';
        document.querySelector('div[port] input').value = '';
        document.querySelector('div[server-host] input').value = '';
    }
    //if editing existing row open modal with existing values in their coresponding boxes to edit based on record type from row
    if (action === 'edit') {
        let row_inputs = row.querySelectorAll('td div.data-input');
        document.querySelector('select.dns-selector').value = row_inputs[0].innerText;
        updateFields(row_inputs[0].innerText);
        //if subdomain was entered in step one remove prepended subdomain from name value before adding it to editor modal
        if (domain_data[0]) {
            document.querySelector('div[name] input').value = row_inputs[1].innerText.split('.')[0];
        } else {//else add name value to edit box
            document.querySelector('div[name] input').value = row_inputs[1].innerText;
        }
        document.querySelector('div[ttl] input').value = row_inputs[3].innerText;
        //if record type is MX or SRV split out the record value into it's components and add each to their corresponding editor boxes
        if (row_inputs[0].innerText === 'MX') {
            let value_split = row_inputs[2].innerText.split(' ');
            document.querySelector('div[priority] input').value = value_split[0];
            document.querySelector('div[mail-host-name] input').value = value_split[1];
        } else if (row_inputs[0].innerText === 'SRV') {
            let value_split = row_inputs[2].innerText.split(' ');
            document.querySelector('div[priority] input').value = value_split[0];
            document.querySelector('div[weight] input').value = value_split[1];
            document.querySelector('div[port] input').value = value_split[2];
            document.querySelector('div[server-host] input').value = value_split[3];
        } else {
            document.querySelector('div[value] input').value = row_inputs[2].innerText;
            //clear unused boxes
            document.querySelector('div[priority] input').value = '';
            document.querySelector('div[mail-host-name] input').value = '';
            document.querySelector('div[weight] input').value = '';
            document.querySelector('div[port] input').value = '';
            document.querySelector('div[server-host] input').value = '';
        }
    }
    //display editor modal to user
    document.getElementById('record-entry-container').style.display = '';
}
/*function adds a row to the table being interacted with for each type of record aciton needed (Added, Corrected, Removed)*/
function addTableRow(table){
    //row formatting for adding and removing records
    if (table != 'correct-record') {
        document.querySelector(`#${table}-table tbody`).insertAdjacentHTML('beforeend',`<tr>
            <td>
                <span class="row-delete">X</span>
            </td>
            <td>
                Type:<br>
                <div class="data-input"></div>
            </td>
            <td>
                Name:<br>
                <div class="data-input"></div>
            </td>
            <td>
                Value:<br>
                <div class="data-input"></div>
            </td>
            <td style="width: 100px;">
                TTL:<br>
                <div class="data-input"></div>
            </td>
        </tr>`);
        //open editor for newly added row
        openRecordEditor('add',document.querySelector(`#${table}-table > tbody > tr:last-child`));
    } else {
        //row formatting for correcting records table, Needs to have values for existing record and what they should be changed to
        document.querySelector(`#${table}-table > tbody`).insertAdjacentHTML('beforeend',`<tr>
		<td>
			<span class="row-delete">X</span>
			<table>
				<tbody>
				<tr>
                    <td>
                        Original Values
                    </td>
					<td>
						Type:<br>
						<div class="data-input"></div>
					</td>
					<td>
						Name:<br>
						<div class="data-input"></div>
					</td>
					<td>
						Value:<br>
						<div class="data-input"></div>
					</td>
					<td>
						TTL:<br>
						<div class="data-input"></div>
					</td>
				</tr>
				<tr>
                    <td>
                        New Values
                    </td>
					<td>
						Type:<br>
						<div class="data-input"></div>
					</td>
					<td>
						Name:<br>
						<div class="data-input"></div>
					</td>
					<td>
						Value:<br>
						<div class="data-input"></div>
					</td>
					<td>
						TTL:<br>
						<div class="data-input"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</td>
</tr>`);
        //open editor modal with newly added row
        openRecordEditor('add',document.querySelector(`#correct-record-table > tbody > tr:last-child tr:first-child`));
    }
}
/*deletes last row from the table being interacted with*/
function removeTableRow(table){
    if(document.querySelector(`#${table}-table tr:last-child`)){
        document.querySelector(`#${table}-table tr:last-child`).remove();
    }
}
/*function closes the editor model*/
function closeModal(modal){
    //function to get parent elements
    function getParents(element, selector) {
        let parents = [];
        while (element.parentElement) {
            element = element.parentElement;
            if (element.matches(selector)) {
                parents.push(element);
            }
        }
        return parents;
    }
    //if target row record type is empty when closing modal remove empty row(for newly added rows that weren't updated when created)
    if (target_row.querySelectorAll('div.data-input')[0].innerText === '') {
        //check we are editing the second line of a correct-record row
        if (getParents(target_row,'table[id]').length === 1 && getParents(target_row,'table[id]')[0].getAttribute('id') === 'correct-record-table') {
            if (getParents(target_row,'table[id] > tbody > tr:last-child')[0].querySelectorAll('div.data-input')[0].innerText === '') {
                getParents(target_row,'table[id] > tbody > tr:last-child')[0].remove();
            }
        } else {
            target_row.remove();
        }
    }
    document.querySelector(`#${modal}`).style.display = 'none';
    target_row = null;
    //will clear any previous error message
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
}
/*function compiles record data and validates it meets requirements*/
async function validateRecordData(){
    //will clear any previous error message
    if(document.getElementById('error_message')) {
        document.getElementById('error_message').remove();
    }
    //will import the error popup module
    let error_popup = await import('../../modules/error-popup/popup.js');
    let record_type = document.querySelector('.dns-selector').value;
    if(record_type != 'Select Type'){//if a record type was selected move forward
        record_data = {
            row: target_row,
            type: document.querySelector('.dns-selector').value,
            name: document.querySelector('div[name] input').value,
            value: document.querySelector('div[value] input').value,
            priority: document.querySelector('div[priority] input').value,
            mailhostname: document.querySelector('div[mail-host-name] input').value,
            weight: document.querySelector('div[weight] input').value,
            port: document.querySelector('div[port] input').value,
            serverhost: document.querySelector('div[server-host] input').value,
            ttl: document.querySelector('div[ttl] input').value
        };
        if (record_type === 'MX') {
            record_data.value = `${record_data.priority} ${record_data.mailhostname}`;
        } else if (record_type === 'SRV') {
            record_data.value = `${record_data.priority} ${record_data.weight} ${record_data.port} ${record_data.serverhost}`;
        }
        bad_object = {
            type: 'generate',
            list: checkValues(record_data)
        };
        if (bad_object.list.CNAME_record_value && (/^[\w\-]+\.\w{2,}$/).test(record_data.value)) {
            let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
            if (await custom_dialogue.default(`The given Record Value is pointed to an apex domain. If this was intentional click Continue. If not, please cancel and go check the values before submitting.`, 'Continue', 'Cancel')) {
                delete bad_object.list.CNAME_record_value;
            }
        }
        //if errors found display errors
        if (Object.entries(bad_object.list).length) {
            error_popup.default(bad_object);
        } else {//else update row with changes and close modal
            submit(record_data);
            closeModal('record-entry-container');
        };
    } else {//else display unique error for not selecting a record type
        error_popup.default({
            type: 'generate',
            list: {
                record_type: {
                    text: 'Select a Record Type',
                    html: '<img style="width: 100%;" src="/Rain-Support-Tools/src/media/imgs/bad-record-type.jpeg" />'
                }
            }
        });
    }
}
/*this function takes the data from the editor modal and applies it to the necessary row*/
function submit(record_data){
    //assign row_inputs as the array of inputs from the table row to update
    let row_inputs = record_data.row.querySelectorAll('td div.data-input');
    //update row data
    row_inputs[0].innerText = record_data.type;
    //check if subdomain and record name doesn't match subdomain
    if(domain_data[0] && record_data.name != domain_data[1]){
        row_inputs[1].innerText = record_data.name + '.' + domain_data[1];
    } else {
        row_inputs[1].innerText = record_data.name;
    }
    row_inputs[2].innerText = record_data.value;
    if (record_data.ttl === '') {//if the given ttl in the editor was empty auto assign 3600 as it's value
        row_inputs[3].innerText = '3600';
    } else {//else assign the given value
        row_inputs[3].innerText = record_data.ttl;
    }
}
/*function compiles the record data from active actions on the third page for visibility in step three for confirmation*/
function compileRecords(){
    //loop through all action types that were assigned in step 1
    for(i=0;i<action_type.length;i++){
        //remove any existing html for the confirmation page for each action type
        document.querySelector(`[${action_type[i]}] data`).innerHTML = '';
        //build new html for action type for each row of data from step 2
        if (action_type[i] != 'correct-record') {
            let rows = document.querySelectorAll(`#${action_type[i]} tr`);
            rows.forEach(function (el) {
                let inputs =  el.querySelectorAll('td div.data-input');
                document.querySelector(`[${action_type[i]}] data`).insertAdjacentHTML('beforeend', `<div class="value-display">
                    Record Type: ${inputs[0].innerText}<br>
                    Name: ${inputs[1].innerText}<br>
                    Value: ${inputs[2].innerText}<br>
                    TTL: ${inputs[3].innerText}</div>`);
            });
        } else {
            let rows = document.querySelectorAll(`#${action_type[i]} > table > tbody >  tr`);
            rows.forEach(function (el) {
                let inputs =  el.querySelectorAll('td div.data-input');
                document.querySelector(`[${action_type[i]}] data`).insertAdjacentHTML('beforeend', `<div class="value-display">
                    <div class="value-header">
                        <div>Original Values</div>
                        <div>New Values</div>
                    </div>
                    <div class="correct-record">
                        <div class="value-display">
                            Record Type: ${inputs[0].innerText}<br>
                            Name: ${inputs[1].innerText}<br>
                            Value: ${inputs[2].innerText}<br>
                            TTL: ${inputs[3].innerText}
                        </div>
                        <div class="value-display">
                            Record Type: ${inputs[4].innerText}<br>
                            Name: ${inputs[5].innerText}<br>
                            Value: ${inputs[6].innerText}<br>
                            TTL: ${inputs[7].innerText}
                        </div>
                    </div>
                </div>`);
            });
        }
        
    }
}
/*function asks the user for confirmation on request before reloading page*/
async function start_new_ticket(){
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if(await custom_dialogue.default('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Cancel')){
        window.location.reload();
    }
}
/*function watchs the ttl box in the editor modal and deletes any character that isn't 0-9*/
function ttlCharacterRestriction(el){
    el.target.value = el.target.value.replaceAll(/[^0-9/]/g,'');
}
/*function controls which of the actions in step one is selected or not selected (add record, correct record, remove record*/
function selectAction(el){
    if (el.target.classList.value === 'selected') {
        el.target.classList.remove('selected');
        document.getElementById(`${el.target.attributes.action.value}`).style.display = 'none';
    } else {
        el.target.classList.add('selected');
        document.getElementById(`${el.target.attributes.action.value}`).style.display = '';
    }
}
/*waits for window to finish loading data then sets some event listeners on specific elements*/
window.addEventListener('load', () => {
    document.querySelectorAll('div[action]').forEach(el => {
        el.addEventListener('click',selectAction);
    });
    document.querySelectorAll('div[ttl] input').forEach(el => {
        el.addEventListener('keyup',ttlCharacterRestriction);
    });
    //sets event listener on copy button
    document.querySelector('.btn-copy').addEventListener('click', async () =>{
        const copyText =  await import('/Rain-Support-Tools/src/modules/copy-data/copy-data.js');
        copyText.default(document.querySelector('#ticket-container > div > textarea'));
    });
});
/*this sets a general event listener on the page for any time the mouse button was released, it then runs a specific function for each element that was clicked on potentially passing in necessary information to be used in funciton actions*/
addEventListener("mouseup", (event) =>{
    //used in opening the editor for any row of data that was clicked on in step 2
    if(Array.from(event.target.classList).includes('data-input')){
        openRecordEditor('edit', getRow(event.target));
    };
    //used in deleting a row from step 2
    if(Array.from(event.target.classList).includes('row-delete')){
        deleteRow(event.target)
    };
});
document.addEventListener('DOMContentLoaded',function(){
        //add event listeners for add row buttons
        document.querySelectorAll('[table-controls] button:first-child').forEach((el,index) => {
            if(index === 0){
                el.addEventListener('click',() =>{addTableRow('add-record');});
            } else if (index === 1) {
                el.addEventListener('click',() =>{removeTableRow('correct-record');});
            } else if (index === 2) {
                el.addEventListener('click',() =>{removeTableRow('remove-record');});
            }

        });
        //add event listeners for remove row buttons
        document.querySelectorAll('[table-controls] button:last-child').forEach((el,index) => {
            if(index === 0){
                el.addEventListener('click',() =>{removeTableRow('add-record');});
            } else if (index === 1) {
                el.addEventListener('click',() =>{removeTableRow('correct-record');});
            } else if (index === 2) {
                el.addEventListener('click',() =>{removeTableRow('remove-record');});
            }
        });
        //add event listener for close X
        document.querySelector('.close').addEventListener('click',() =>{closeModal('record-entry-container');});
        //add event listener for type selector
        document.querySelector('.dns-selector').addEventListener('change',() =>{updateFields(event.target.value);});
        //add event listener for cancel entry button
        document.querySelector('#record-entry-box button.secondary').addEventListener('click',() =>{closeModal('record-entry-container');});
        //add event listener for submit entry button
        document.querySelector('#record-entry-box button.primary').addEventListener('click',validateRecordData);
        //add event listner for reset button
        document.querySelector('div[ticket-buttons] button:first-child').addEventListener('click',start_new_ticket);
        //add event listener for close button
        document.querySelector('div[ticket-buttons] button:nth-child(2)').addEventListener('click',() =>{document.getElementById('ticket-container').classList.add('hide');});
});
