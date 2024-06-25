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
        default:
            break;
    }
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
}

$(window).ready(function (){
    $('div[work]').on('click',selectWork);
});