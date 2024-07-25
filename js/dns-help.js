//set variables to be called and checked later
var action_type = [];
var target_row;
var domain_data;
/*function returns a boolean response to check that the domain entered passes the regex test*/
function domaincheck() {
    let domain = $('#domain')[0].value;
    return RegExp(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(domain);
}
/*returns an array that is used to set the value of domain_data, [(true/false),{the domain or sub domain beginning}]*/
function isSubDomain(){
    return [(/^[\w\-]+\.[\w\-]+\.\w{2,}$/).test($('#domain')[0].value),$('#domain')[0].value.match(/^[\w-]+/g)[0]];
}
/*delets the row that was clicked*/
function deleteRow(el){
    $(el).parent().parent().remove()
}
/*returns the element that is the parent of the parent of the element clicked on, used in editing a row of dns record data to pull full row regardless of which input box is clicked on*/
function getRow(el){
    return $(el).parent().parent()[0];
}
/*function is used in step two to check that each set of data (adding, removing, updating) has at least one row of data. If any active data set has no rows, returns an error*/
function checkForEmptyRows(){
    let potential_errors = {};
    //loop through active types and make sure no table is empty. If it is create a growl message.
    for(a=0;a<action_type.length;a++){
        if (!$(`#${action_type[a]}-table > tbody > tr`).length) {
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
    Close_error_growl();
    let bad_object = {
        type: 'generate',
        list: {}
    };
    //get current step number
    let current_step = parseInt($('[step].active').attr('step'));
    switch(current_step){
        case 1:
            //check the domain has been entered and is a valid domain
            if (!domaincheck()) {
                bad_object.list['domain_check'] = 'Please make sure that the domain is correct and not blank.'
            }
            //check an action has been selected
            if ($('[action].selected').length) {
                action_type = Array.from($('[action].selected'), (el) => el.attributes.action.value);
                console.log('actions: ' + action_type);
            } else {
                bad_object.list['action_check'] = 'Please select which record action(s) needs to be done.';
            }
            //if any errors were found display error popup
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {//else check subdomain and move to next step
                domain_data = isSubDomain();
                if (domain_data[0]) {
                    if (await customDialogResponse('Our system usually deals in hosting apex domains (testurl.com). The domain you have entered looks to be a sub domain (sub.testurl.com). Do you wish to continue?','Continue','Go Back')) {
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
                popup_error_growl(bad_object);
            } else {//else prep next step to display records added to confirm before copying
                if (action_type.includes('add-record')){
                    $('[compiled-results] [add-record]').show();
                } else {
                    $('[compiled-results] [add-record]').hide();
                }
                if (action_type.includes('correct-record')) {
                    $('[compiled-results] [correct-record]').show();
                } else {
                    $('[compiled-results] [correct-record]').hide();
                }
                if (action_type.includes('remove-record')){
                    $('[compiled-results] [remove-record]').show();
                } else {
                    $('[compiled-results] [remove-record]').hide();
                }
                //update step three with record data for confirmation
                compileRecords();
                nextStep(current_step);
            };
            break;
        case 3://build ticket, display text area for copying
            let ticket_text = `DNS Record Changes
Domain: ${$('#domain')[0].value}

`;
            //compile record data into ticket formatting
            ticket_text += appendRecordChanges();
            //after getting record changes from above line need to add text to the text container
            $('#ticket-container textarea')[0].value = ticket_text;
            $('#ticket-container').removeClass('hide');
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
        let record_rows = $(`#${action_type[i]}-table > tbody > tr`);
        if (action_type[i] != 'correct-record') {
            if (action_type[i] === 'add-record') {
                text_to_append += `-----Records to be Added-----

`;
            }
            if (action_type[i] === 'remove-record') {
                text_to_append += `-----Records to Remove-----

`;
            }
            for (r=0;r<record_rows.length;r++) {
                let row_inputs = $(record_rows[r]).find('div.data-input');
                text_to_append += `Record #${r+1}:
Type: ${row_inputs[0].innerText}
Name: ${row_inputs[1].innerText}
Value: ${row_inputs[2].innerText}
TTL: ${row_inputs[3].innerText}

`;
            }
        } else {
            text_to_append += `-----Records to Correct-----

`;
            for (r=0;r<record_rows.length;r++) {
                let row_inputs = $(record_rows[r]).find('div.data-input');
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
/*function controls moving to next step*/
function nextStep(step_number){
    $(`[step="${step_number}"]`)[0].classList = 'complete';
    $(`[step="${step_number + 1}"]`)[0].classList = 'active';
    $(`[data='${step_number}`).removeClass('active');
    $(`[data='${step_number + 1}`).addClass('active');
    switch(step_number){
        case 1:
            $('[flow-controls] button[prev]').removeClass('hide');
            break;
        case 2:
            $('[flow-controls] button[next]').addClass('hide');
            $('[flow-controls] button[finish]').removeClass('hide');
            break;
    }
}
/*function controls going back to last step*/
function previousStep(){
    let step_number = parseInt($('[step].active').attr('step'));
    $(`[step="${step_number}"]`)[0].classList = '';
    $(`[step="${step_number - 1}"]`)[0].classList = 'active';
    $(`[data='${step_number}`).removeClass('active');
    $(`[data='${step_number - 1}`).addClass('active');
    switch(step_number){
        case 3:
            $('[flow-controls] button[finish]').addClass('hide');
            $('[flow-controls] button[next]').removeClass('hide');
            break;
        case 2:
            $('[flow-controls] button[prev]').addClass('hide');
            break;
    }
}
/*function controls which fields are available for editing when making record changes based on record type*/
function updateFields(record_type){
    if (record_type === 'MX') {
        $('#record-entry-box div[value]').hide();
        $('#record-entry-box div[srv]').hide();
        $('#record-entry-box div[mx]').show();
    } else if(record_type === 'SRV') {
        $('#record-entry-box div[value]').hide();
        $('#record-entry-box div[mx]').hide();
        $('#record-entry-box div[srv]').show();
    } else {
        $('#record-entry-box div[srv]').hide();
        $('#record-entry-box div[mx]').hide();
        $('#record-entry-box div[value]').show();
    }
}
/*function opens record editor modal with existing values from the row that was selected to edit*/
function openRecordEditor(action,row){
    target_row = row;//hold on to row for later
    //if adding a new row, set empty modal
    if (action === 'add') {
        $('select.dns-selector')[0].value = 'Select Type';
        updateFields('Select Type');
        $('div[name] input')[0].value = '';
        $('div[value] input')[0].value = '';
        $('div[ttl] input')[0].value = '';
        $('div[priority] input')[0].value = '';
        $('div[mail-host-name] input')[0].value = '';
        $('div[weight] input')[0].value = '';
        $('div[port] input')[0].value = '';
        $('div[server-host] input')[0].value = '';
    }
    //if editing existing row open modal with existing values in their coresponding boxes to edit based on record type from row
    if (action === 'edit') {
        let row_inputs = $(row).find('td div.data-input');
        $('select.dns-selector')[0].value = row_inputs[0].innerText;
        updateFields(row_inputs[0].innerText);
        //if subdomain was entered in step one remove prepended subdomain from name value before adding it to editor modal
        if (domain_data[0]) {
            $('div[name] input')[0].value = row_inputs[1].innerText.split('.')[0];
        } else {//else add name value to edit box
            $('div[name] input')[0].value = row_inputs[1].innerText;
        }
        $('div[ttl] input')[0].value = row_inputs[3].innerText;
        //if record type is MX or SRV split out the record value into it's components and add each to their corresponding editor boxes
        if (row_inputs[0].innerText === 'MX') {
            let value_split = row_inputs[2].innerText.split(' ');
            $('div[priority] input')[0].value = value_split[0];
            $('div[mail-host-name] input')[0].value = value_split[1];
        } else if (row_inputs[0].innerText === 'SRV') {
            let value_split = row_inputs[2].innerText.split(' ');
            $('div[priority] input')[0].value = value_split[0];
            $('div[weight] input')[0].value = value_split[1];
            $('div[port] input')[0].value = value_split[2];
            $('div[server-host] input')[0].value = value_split[3];
        } else {
            $('div[value] input')[0].value = row_inputs[2].innerText;
            //clear unused boxes
            $('div[priority] input')[0].value = '';
            $('div[mail-host-name] input')[0].value = '';
            $('div[weight] input')[0].value = '';
            $('div[port] input')[0].value = '';
            $('div[server-host] input')[0].value = '';
        }
    }
    //display editor modal to user
    $('#record-entry-container').show()
}
/*function adds a row to the table being interacted with for each type of record aciton needed (Added, Corrected, Removed)*/
function addTableRow(table){
    //row formatting for adding and removing records
    if (table != 'correct-record') {
        $(`#${table}-table tbody`).append(`<tr>
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
        openRecordEditor('add',$(`#${table}-table > tbody > tr:last-child`)[0]);
    } else {
        //row formatting for correcting records table, Needs to have values for existing record and what they should be changed to
        $(`#${table}-table > tbody`).append(`<tr>
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
        openRecordEditor('add',$(`#correct-record-table > tbody > tr:last-child tr:first-child`)[0]);
    }
}
/*deletes last row from the table being interacted with*/
function removeTableRow(table){
    $(`#${table}-table tr:last-child`).remove();
}
/*function closes the editor model*/
function closeModal(modal){
    //if target row record type is empty when closing modal remove empty row(for newly added rows that weren't updated when created)
    if ($(target_row).find('div.data-input')[0].innerText === '') {
        //check we are editing the second line of a correct-record row
        if ($(target_row).parents('table[id]').attr('id') === 'correct-record-table') {
            if ($(target_row).parent().find('div.data-input')[0].innerText === '') {
                $(target_row).parents('table[id] > tbody > tr:last-child').remove()
            }
        } else {
            $(target_row).remove();
        }
    }
    $(`#${modal}`).hide();
    target_row = null;
    Close_error_growl();
}
/*function compiles record data and validates it meets requirements*/
function validateRecordData(){
    let record_type = $('.dns-selector')[0].value;
    if(record_type != 'Select Type'){//if a record type was selected move forward
        record_data = {
            row: target_row,
            type: $('select.dns-selector')[0].value,
            name: $('div[name] input')[0].value,
            value: $('div[value] input')[0].value,
            priority: $('div[priority] input')[0].value,
            mailhostname: $('div[mail-host-name] input')[0].value,
            weight: $('div[weight] input')[0].value,
            port: $('div[port] input')[0].value,
            serverhost: $('div[server-host] input')[0].value,
            ttl: $('div[ttl] input')[0].value
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
        //if errors found display errors
        if (Object.entries(bad_object.list).length) {
            popup_error_growl(bad_object);
        } else {//else update row with changes and close modal
            submit(record_data);
            closeModal('record-entry-container');
            Close_error_growl();
        };
    } else {//else display unique error for not selecting a record type
        popup_error_growl({
            type: 'generate',
            list: {
                record_type: {
                    text: 'Select a Record Type',
                    html: '<img style="width: 100%;" src="/Rain-Support-Tools/imgs/bad-record-type.jpeg" />'
                }
            }
        });
    }
}
/*this function takes the data from the editor modal and applies it to the necessary row*/
function submit(record_data){
    //assign row_inputs as the array of inputs from the table row to update
    let row_inputs = $(record_data.row).find('td div.data-input');
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
        $(`[${action_type[i]}] data`)[0].innerHTML = '';
        //build new html for action type for each row of data from step 2
        if (action_type[i] != 'correct-record') {
            let rows = $(`#${action_type[i]} tr`);
            rows.each(function (index, el) {
                let inputs =  $(el).find('td div.data-input');
                $(`[${action_type[i]}] data`).append(`<div class="value-display">
                    Record Type: ${inputs[0].innerText}<br>
                    Name: ${inputs[1].innerText}<br>
                    Value: ${inputs[2].innerText}<br>
                    TTL: ${inputs[3].innerText}</div>`);
            });
        } else {
            let rows = $(`#${action_type[i]} > table > tbody >  tr`);
            rows.each(function (index, el) {
                let inputs =  $(el).find('td div.data-input');
                $(`[${action_type[i]}] data`).append(`<div class="value-display">
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
/*function copies data from the generator popup to computer clipboard*/
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
/*function asks the user for confirmation on request before reloading page*/
async function start_new_ticket(){
    if(await customDialogResponse('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?','Continue','Cancel')){
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
        $(el.target).removeClass('selected');
        $(`#${el.target.attributes.action.value}`).hide();
    } else {
        $(el.target).addClass('selected');
        $(`#${el.target.attributes.action.value}`).show();
    }
}
/*waits for window to finish loading data then sets some event listeners on specific elements*/
$(window).ready(function (){
    $('div[action]').on('click',selectAction);
    $('div[ttl] input').on('keyup',ttlCharacterRestriction);
});
/*this sets a general event listener on the page for any time the mouse button was released, it then runs a specific function for each element that was clicked on potentially passing in necessary information to be used in funciton actions*/
addEventListener("mouseup", (event) =>{
    //used in opening the editor for any row of data that was clicked on in step 2
    if($(event.target).hasClass('data-input')){
        openRecordEditor('edit', getRow(event.target));
    };
    //used in deleting a row from step 2
    if($(event.target).hasClass('row-delete')){
        deleteRow(event.target)
    };
    //controls moving forward the steps of the webpage flow
    if(event.target.hasAttribute('next')||event.target.hasAttribute('finish')){
        validateData();
    }
    //controls moving backward the steps of the webpage flow
    if(event.target.hasAttribute('prev')){
        previousStep();
    }
});