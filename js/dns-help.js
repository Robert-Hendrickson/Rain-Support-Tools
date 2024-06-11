let action_type = [];
function domaincheck() {
    let domain = $('#domain')[0].value;
    return RegExp(/^[\w\-]+\.\w{2,}$/).test(domain);
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

function openRecordEditor(action,row,table){
    $('input[edit-type]')[0].value = action;
    $('input[row]')[0].value = row;
    $('input[table]')[0].value = table;
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
        let row_inputs = $(`#${table}-table tr:nth-child(${row})`).find('td input');
        $('select.dns-selector')[0].value = row_inputs[0].value;
        updateFields(row_inputs[0].value);
        $('div[name] input')[0].value = row_inputs[1].value;
        $('div[ttl] input')[0].value = row_inputs[3].value;
        //create a collection function to get row data
        //might be good to also create a function to separate value data for srv and mx records
        if (row_inputs[0].value === 'MX') {
            let value_split = row_inputs[2].value.split(' ');
            $('div[priority] input')[0].value = value_split[0];
            $('div[mail-host-name] input')[0].value = value_split[1];
        } else if (row_inputs[0].value === 'SRV') {
            let value_split = row_inputs[2].value.split(' ');
            $('div[priority] input')[0].value = value_split[0];
            $('div[weight] input')[0].value = value_split[1];
            $('div[port] input')[0].value = value_split[2];
            $('div[server-host] input')[0].value = value_split[3];
        } else {
            $('div[value] input')[0].value = row_inputs[2].value;
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
    let row_number = $(`#${table}-table tr`).length +1
    $(`#${table}-table tbody`).append(`<tr>
        <td>
            Type:<br>
            <div>
                <input type="text" disabled />
            </div>
        </td>
        <td>
            Name:<br>
            <div>
                <input type="text" disabled />
            </div>
        </td>
        <td>
            Value:<br>
            <div>
                <input type="text" disabled />
            </div>
        </td>
        <td style="width: 100px; text-align: center;">
            TTL:<br>
            <div>
                <input type="text" disabled />
            </div>
        </td>
        <td>
            <a onclick="openRecordEditor('edit', '${row_number}', 'add-record')">Edit</a>
        </td>
    </tr>`);
    openRecordEditor('add',row_number,table);
}
function closeModal(modal){
    $(`#${modal}`).hide();
}
function validateRecordData(){
    let record_type = $('.dns-selector')[0].value;
    if(record_type != 'Select Type'){
        record_data = {
            action: $('input[edit-type]')[0].value,
            row: $('input[row]')[0].value,
            table: $('input[table]')[0].value,
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
        //error: need a record type
    }
}
function submit(record_data){
    let row_inputs = $(`#${record_data.table}-table tr:nth-child(${record_data.row})`).find('td input');
    row_inputs[0].value = record_data.type;
    row_inputs[1].value = record_data.name;
    row_inputs[3].value = record_data.ttl;
    row_inputs[2].value = record_data.value;
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
