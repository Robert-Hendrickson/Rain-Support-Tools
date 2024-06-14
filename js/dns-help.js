var action_type = [];
var target_row;
function domaincheck() {
    let domain = $('#domain')[0].value;
    return RegExp(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(domain);
}
function deleteRow(el){
    $(el).parent().parent().remove()
}
function getRow(el){
    return $(el).parent().parent()[0];
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
                nextStep(current_step);
            };
            break;
        case 2:
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
            break;
        default:
            console.error('Invalid Step ID');
            break;
    }
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
        $('div[name] input')[0].value = row_inputs[1].innerText;
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
                <span onclick="deleteRow(this)">X</span>
            </td>
            <td>
                Type:<br>
                <div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
            </td>
            <td>
                Name:<br>
                <div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
            </td>
            <td>
                Value:<br>
                <div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
            </td>
            <td style="width: 100px; text-align: center;">
                TTL:<br>
                <div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
            </td>
        </tr>`);
    } else {
        $(`#${table}-table > tbody`).append(`<tr>
	<td>
		<span onclick="deleteRow(this)">X</span>
		<table>
			<tbody>
				<tr>
					<td>
						Type:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						Name:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						Value:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						TTL:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
				</tr>
				<tr>
					<td>
						Type:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						Name:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						Value:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
					<td>
						TTL:<br>
						<div onclick="openRecordEditor('edit', getRow(this))" class="data-input"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</td>
</tr>`);
    }
    openRecordEditor('add',$(`#${table}-table tbody tr:last-child`)[0]);
}
function removeTableRow(table){
    $(`#${table}-table tr:last-child`).remove();
}
function closeModal(modal){
    $(`#${modal}`).hide();
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
        submit(record_data);
        closeModal('record-entry-container');
    } else {
        /*this is for the image. Need to build a new popup control to pass it in better
        '<img src="/Rain-Support-Tools/imgs/bad-record-type.jpeg" />'
        */
        popup_error_growl({
            type: 'generate',
            list: {
                record_type: {
                    text: 'Select a Record Type',
                    html: '<img src="/Rain-Support-Tools/imgs/bad-record-type.jpeg" />'
                }
            }
        });
    }
}
function submit(record_data){
    let row_inputs = $(record_data.row).find('td div.data-input');
    row_inputs[0].innerText = record_data.type;
    row_inputs[1].innerText = record_data.name;
    row_inputs[2].innerText = record_data.value;
    row_inputs[3].innerText = record_data.ttl;
}
function compileRecords(){
    let temp_object = {'add-record': {},'correct-record': {},'remove-record': {}};
    for(i=0;i<action_type.length;i++){
        let rows = $(`#${action_type[i]} tr`);
        rows.each(function (index, el) {
            let inputs =  $(el).find('td div.data-input');
            temp_object[action_type[i]][`record_${index + 1}`] = {
                type: inputs[0].innerText,
                name: inputs[1].innerText,
                value: inputs[2].innerText,
                ttl: inputs[3].innerText
            };
        });
    }
    console.log(temp_object);
    for(i=0;i<action_type.length;i++){
        $(`[${action_type[i]}] data`)[0].innerHTML = '';
        for(record in temp_object[action_type[i]]){
            //needs updated to handle correcting records view
            $(`[${action_type[i]}] data`).append(`<div>Record Type: ${temp_object[action_type[i]][record].type}<br>Name: ${temp_object[action_type[i]][record].name}<br> Value: ${temp_object[action_type[i]][record].value}<br>TTL: ${temp_object[action_type[i]][record].ttl}</div>`);
        }
    }
}
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
});
