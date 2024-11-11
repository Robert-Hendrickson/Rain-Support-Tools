
/*control displaying next step if validation passes*/
function nextStep(current_step){
    //Move to next step
    $(`[step='${current_step}']`)[0].classList.value = 'complete';
    $(`[step='${current_step + 1}']`)[0].classList.value = 'active';
    //move to next data set
    $(`[data='${current_step}']`)[0].classList.value = 'complete';
    $(`[data='${current_step + 1}']`)[0].classList.value = 'active';
    if(current_step === 1){//hide "Back" button if on step one
        $('button[prev]').removeClass('hide');
    }
    if(current_step === $('[step]').length -1){//switch out "Next" button for "Finish" if moving to last step
        $('button[next]').addClass('hide');
        $('button[finish]').removeClass('hide');
    }
    updateTabs(current_step,current_step+1);
}
/*moves to previous step from current display*/
function previousStep(){
    let current_step = parseInt($('#info-tabs .active')[0].getAttribute('step'));
    if(current_step === 2){
        $('button[prev]').addClass('hide');
    }
    if(current_step === $('[step]').length){
        $('button[finish]').addClass('hide');
        $('button[next]').removeClass('hide');
    }
    //set step display changes
    $(`[step='${current_step}']`)[0].classList.value = '';
    $(`[step='${current_step - 1}']`)[0].classList.value = 'active';
    //set data display changes
    $(`[data='${current_step}']`)[0].classList.value = 'in-active';
    $(`[data='${current_step - 1}']`)[0].classList.value = 'active';
    updateTabs(current_step,current_step-1);
}

function updateTabs(add_tab,remove_tab){
    $($(`[data="${add_tab}"]`)[0].querySelectorAll('input','textarea','select')).each((index, el)=>{
        el.setAttribute('tabindex','-1');
    });
    $($(`[data="${remove_tab}"]`)[0].querySelectorAll('input','textarea','select')).each((index, el)=>{
        el.removeAttribute('tabindex');
    });
}