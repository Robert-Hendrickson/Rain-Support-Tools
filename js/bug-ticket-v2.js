function nextStep(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    //set step display changes
    $(`[step='${current_step}']`)[0].classList.value = 'complete';
    $(`[step='${current_step + 1}']`)[0].classList.value = 'active';
    //set data display changes
    $(`[data='${current_step}']`)[0].classList.value = '';
    $(`[data='${current_step + 1}']`)[0].classList.value = 'active';
    if(current_step === 1){
        $('button[prev]').attr('disabled',false);
    }
    if(current_step === 4){
        $('button[next]').addClass('hide');
        $('button[finish]').removeClass('hide');
    }
}

function previousStep(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    if(current_step === 2){
        $('button[prev]').attr('disabled',true);
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