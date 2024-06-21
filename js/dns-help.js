var action_type = [];
var target_row;
var domain_data;
function domaincheck() {
    let domain = $('#domain')[0].value;
    return RegExp(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(domain);
}
function isSubDomain(){
    return [(/^[\w\-]+\.[\w\-]+\.\w{2,}$/).test($('#domain')[0].value),$('#domain')[0].value.match(/^[\w-]+/g)[0]];
}
function deleteRow(el){
    $(el).parent().parent().remove()
}
function getRow(el){
    return $(el).parent().parent()[0];
}
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
            if (record_data.name === '') {
                potential_errors['a_record_name'] = 'Enter a value for the record Name';
            };
            if (!(/^(?:\d{1,3}\.){3}\d{1,3}$/).test(record_data.value)) {
                potential_errors['a_record_value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
            };
            break;
        case 'AAAA':
            if (record_data.name === '') {
                potential_errors['aaaa_record_name'] = 'Enter a value for the record Name';
            };
            if (!(/^(?:\w{4}\:){7}\w{4}$/).test(record_data.value)) {
                potential_errors['aaaa_record_value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
            };
            break;
        case 'CNAME':
            if (record_data.name === '') {
                potential_errors['CNAME_record_name'] = 'Enter a value for the record Name';
            };
            if (!(/^\w+\.\w{2,}$/).test(record_data.value)) {
                potential_errors['CNAME_record_value'] = 'CNAME record value needs to be a domain. (domain.com)';
            };
            break;
        case 'MX':
            if (record_data.name === '') {
                potential_errors['MX_record_name'] = 'Enter a value for the record Name';
            };
            if (!(/^\d+$/).test(record_data.priority)) {
                potential_errors['MX_record_priority'] = 'MX record priority needs to be a number. (10)';
            };
            if (!(/^\w+\.\w+\.\w{2,}$/).test(record_data.mailhostname)) {
                potential_errors['MX_record_host'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
            };
            break;
        case 'TXT':
            if (record_data.name === '') {
                potential_errors['TXT_record_name'] = 'Enter a value for the record Name';
            };
            /*this will check for value on txt, need to determine what things we don't want to show in the record. will update at later time
            if (!(/^\d+/).test(record_data.value)) {
                potential_errors['TXT_record_value'] = 'TXT record value needs to be a number. (10)';
            };*/
            break;
        case 'PTR':
            if (record_data.name === '' || !(/(?:\d{1,3}\.){3}\d{1,3}$/).test(record_data.name)) {
                potential_errors['ptr_record_name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
            };
            if (!(/^\w+\.\w+\.\w{2,}$/).test(record_data.value)) {
                potential_errors['ptr_record_value'] = 'PTR needs to be a domain (www.domain.com)';
            };
            break;
        case 'SRV':
            if (record_data.name === '') {
                potential_errors['srv_record_name'] = 'Enter a value for the record Name';
            };
            if (!(/\d+$/).test(record_data.priority)) {
                potential_errors['srv_priority'] = 'Priority needs to be a number (10)';
            }
            if (!(/\d+$/).test(record_data.weight)) {
                potential_errors['srv_weight'] = 'Weight needs to be a number (10)';
            }
            if (!(/\d+$/).test(record_data.port)) {
                potential_errors['srv_port'] = 'Port needs to be a number (10)';
            }
            if (!(/^\w+\.\w+\.\w{2,}$/).test(record_data.serverhost)) {
                potential_errors['srv_host'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
            }
            break;
        default:
            console.error('Record type not usable');
            break;
    }
    return potential_errors;
}
function validateData(){
    Close_error_growl();
    let bad_object = {
        type: 'generate',
        list: {}
    };
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
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                domain_data = isSubDomain();
                nextStep(current_step);
            };
            break;
        case 2:
            bad_object.list = checkForEmptyRows();
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
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
                compileRecords();
                nextStep(current_step);
            };
            break;
        case 3:
            let ticket_text = `DNS Record Changes
Domain: ${$('#domain')[0].value}

`;
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

function openRecordEditor(action,row){
    target_row = row;//hold on to row for later
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
    if (action === 'edit') {
        let row_inputs = $(row).find('td div.data-input');
        $('select.dns-selector')[0].value = row_inputs[0].innerText;
        updateFields(row_inputs[0].innerText);
        if (domain_data[0]) {
            $('div[name] input')[0].value = row_inputs[1].innerText.split('.')[0];
        } else {
            $('div[name] input')[0].value = row_inputs[1].innerText;
        }
        $('div[ttl] input')[0].value = row_inputs[3].innerText;
        //create a collection function to get row data
        //might be good to also create a function to separate value data for srv and mx records
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
    $('#record-entry-container').show()
}
function addTableRow(table){
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
        openRecordEditor('add',$(`#${table}-table > tbody > tr:last-child`)[0]);
    } else {
        $(`#${table}-table > tbody`).append(`<tr>
	<td>
		<span class="row-delete">X</span>
		<table>
			<tbody>
				<tr>
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
        openRecordEditor('add',$(`#correct-record-table > tbody > tr:last-child tr:first-child`)[0]);
    }
}
function removeTableRow(table){
    $(`#${table}-table tr:last-child`).remove();
}
function closeModal(modal){
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
}
function validateRecordData(){
    let record_type = $('.dns-selector')[0].value;
    if(record_type != 'Select Type'){
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
        if (Object.entries(bad_object.list).length) {
            popup_error_growl(bad_object);
        } else {
            submit(record_data);
            closeModal('record-entry-container');
            Close_error_growl();
        };
    } else {
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
function submit(record_data){
    let row_inputs = $(record_data.row).find('td div.data-input');
    row_inputs[0].innerText = record_data.type;
    if(domain_data[0]){
        row_inputs[1].innerText = record_data.name + '.' + domain_data[1];
    } else {
        row_inputs[1].innerText = record_data.name;
    }
    row_inputs[2].innerText = record_data.value;
    if (record_data.ttl === '') {
        row_inputs[3].innerText = '3600';
    } else {
        row_inputs[3].innerText = record_data.ttl;
    }
}
function compileRecords(){
    for(i=0;i<action_type.length;i++){
        $(`[${action_type[i]}] data`)[0].innerHTML = '';
        if (action_type[i] != 'correct-record') {
            let rows = $(`#${action_type[i]} tr`);
            rows.each(function (index, el) {
                let inputs =  $(el).find('td div.data-input');
                $(`[${action_type[i]}] data`).append(`<div>Record Type: ${inputs[0].innerText}<br>Name: ${inputs[1].innerText}<br> Value: ${inputs[2].innerText}<br>TTL: ${inputs[3].innerText}</div>`);
            });
        } else {
            let rows = $(`#${action_type[i]} > table > tbody >  tr`);
            rows.each(function (index, el) {
                let inputs =  $(el).find('td div.data-input');
                $(`[${action_type[i]}] data`).append(`<div class="correct-record"><div>Record Type: ${inputs[0].innerText}<br>Name: ${inputs[1].innerText}<br> Value: ${inputs[2].innerText}<br>TTL: ${inputs[3].innerText}</div><div>Record Type: ${inputs[4].innerText}<br>Name: ${inputs[5].innerText}<br> Value: ${inputs[6].innerText}<br>TTL: ${inputs[7].innerText}</div></div>`);
            });
        }
        
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
function start_new_ticket(){
    if(window.confirm('This action is not reversible. Continuing will clear all current data and start a new ticket.\n\n Do you want to continue?')){
        window.location.reload();
    }
}
//restrict ttl box to only allow characters 0-9
function ttlCharacterRestriction(el){
    el.target.value = el.target.value.replaceAll(/[^0-9/]/g,'');
}
//update action selection
function selectAction(el){
    if (el.target.classList.value === 'selected') {
        $(el.target).removeClass('selected');
        $(`#${el.target.attributes.action.value}`).hide();
    } else {
        $(el.target).addClass('selected');
        $(`#${el.target.attributes.action.value}`).show();
    }
}
$(window).ready(function (){
    $('div[action]').on('click',selectAction);
    $('div[ttl] input').on('keyup',ttlCharacterRestriction);
});
//handle all common click events
addEventListener("mouseup", (event) =>{
    if($(event.target).hasClass('data-input')){
        openRecordEditor('edit', getRow(event.target));
    };
    if($(event.target).hasClass('row-delete')){
        deleteRow(event.target)
    };
    if(event.target.hasAttribute('next')||event.target.hasAttribute('finish')){
        validateData();
    }
    if(event.target.hasAttribute('prev')){
        previousStep();
    }
});
//sets test data through URL check
$(window).ready(function (){
    if ((/^\?test$/).test(location.search) ){
        setTestData();
    }
});