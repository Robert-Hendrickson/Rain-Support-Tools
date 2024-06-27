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
                    nextStep(current_step);
                };
            }
            if(work_type_selected === 'template'){
                
                if (Object.entries(bad_object.list).length) {
                    popup_error_growl(bad_object);
                } else {
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
    return list_object;
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
                <div id="url"><input type="text" placeholder="Page URL" /></div>
            </div>
            <div>
                <div><input type="text" placeholder="screenshot" /></div>
                <div><input type="text" placeholder="video(optional)" /></div>
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