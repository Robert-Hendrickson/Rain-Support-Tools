var work_type_selected;
//handle moving through flow
function validateData(){
    Close_error_growl();
    let bad_object = {
        type: 'generate',
        list: {}
    };
    let current_step = parseInt($('#info-tabs .active').attr('step'));
    switch (current_step){
        case 1:
            if(!(/^(?:[Cc][Rr][Mm])?\d{3,}$/).test($('input#crm')[0].value)){
                bad_object.list['crm'] = 'Please enter a valid CRM {(crm)12381}';
            }
            if (!$('[work-selector] .selected').length) {
                bad_object.list['work'] = 'Please select work type to be done.';
            }
            if (Object.entries(bad_object.list).length) {
                popup_error_growl(bad_object);
            } else {
                nextStep(current_step);
            };
            break;
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
        default:
            break;
    }
}
function checkSiteWork(){
    let list_object = {};
    let rows = $('#work-table tr td:nth-child(2)');
    //loop through rows and make sure each part of the row has correct data for it's type, if misisng create an error object to be returned.
    rows.each(function (index, el){
        if (el.querySelector('select').value === 'Select an Option') {
            list_object['work_type'] = 'Please select a type of work for all rows.';
        }
        if (!(/^(?:https?\:\/\/)?(?:\w+\.)?\w+\.\w{2,}\/?$/).test(el.querySelector('#url').value)) {
            list_object['url'] = 'Make sure each row has a url for the page that needs work done.';
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
function compileData(type){
    let html = '';
    if (type === 'site') {
        let rows = $('#work-table tr td:nth-child(2)');
        rows.each(function (index, el){
            html += `***Page ${index + 1}***<br>
            Work: ${el.querySelector('select').value }<br>
            Page: ${el.querySelector('#url').value}<br>
            Screenshot ${el.querySelector('#screenshot').value}<br>`;
            if (el.querySelector('#video').value != '') {
                html += `Video: ${el.querySelector('#video').value}<br>`;
            }
            html += `Details: ${el.querySelector('textarea').value.replaceAll('\n','<br>')}<br><br><br>`
        });
    }
    if (type === 'template') {
        html = `Update Type: ${$('#template select')[0].value}<br>
        Template Number: ${$('#template #number')[0].value}<br>
        Template CRM: ${$('#template #crm')[0].value}<br>
        Customer Notes: <br>${$('#template textarea')[0].value.replaceAll('\n','<br>')}`;
    }
    $('#confirm-content data')[0].innerHTML = html;
}
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
function removeTableRow(table){
    $(`#${table} tr:last-child`).remove();
}
function deleteRow(el){
    $(el).parent().parent().remove();
}
//update which second step data displays from clicking work type on first step
function displayWorkContent(type){
    work_type_selected = type;
    $('#work-content > div').hide();
    $(`#${type}`).show();
}
//handle moving flow to next step
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
//handle moving to previous step in flow
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
//handle work selector
function selectWork(el){
    $('div[work].selected').removeClass('selected');
    el.target.classList.value = 'selected';
    displayWorkContent($(el.target).attr('work'));
}

$(window).ready(function (){
    $('div[work]').on('click',selectWork);
});