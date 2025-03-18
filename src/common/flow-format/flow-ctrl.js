/*control displaying next step if validation passes*/
function nextStep(current_step){
    //Move to next step
    document.querySelector(`[step='${current_step}']`).classList.value = 'complete';
    document.querySelector(`[step='${current_step + 1}']`).classList.value = 'active';
    //move to next data set
    document.querySelector(`[data='${current_step}']`).classList.value = 'complete';
    document.querySelector(`[data='${current_step + 1}']`).classList.value = 'active';
    if(current_step === 1){//hide "Back" button if on step one
        document.querySelector('button[prev]').classList.remove('hide');
    }
    if(current_step === document.querySelectorAll('[step]').length -1){//switch out "Next" button for "Finish" if moving to last step
        document.querySelector('button[next]').classList.add('hide');
        document.querySelector('button[finish]').classList.remove('hide');
    }
    updateTabs(current_step,current_step+1);
}
/*moves to previous step from current display*/
function previousStep(){
    let current_step = parseInt(document.querySelector('#info-tabs .active').getAttribute('step'));
    if(current_step === 2){
        document.querySelector('button[prev]').classList.add('hide');
    }
    if(current_step === document.querySelectorAll('[step]').length){
        document.querySelector('button[finish]').classList.add('hide');
        document.querySelector('button[next]').classList.remove('hide');
    }
    //set step display changes
    document.querySelector(`[step='${current_step}']`).classList.value = '';
    document.querySelector(`[step='${current_step - 1}']`).classList.value = 'active';
    //set data display changes
    document.querySelector(`[data='${current_step}']`).classList.value = 'in-active';
    document.querySelector(`[data='${current_step - 1}']`).classList.value = 'active';
    updateTabs(current_step,current_step-1);
}

function updateTabs(add_tab,remove_tab){
    document.querySelector(`[data="${add_tab}"]`).querySelectorAll(['input','textarea','select']).forEach((el)=>{
        el.setAttribute('tabindex','-1');
    });
    document.querySelector(`[data="${remove_tab}"]`).querySelectorAll(['input','textarea','select']).forEach((el)=>{
        el.removeAttribute('tabindex');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('div[flow-controls] button').forEach((el)=>{
        if(el.hasAttribute('prev')){
            el.addEventListener('click', previousStep);
        }
        if(el.hasAttribute('next') || el.hasAttribute('finish')){
            el.addEventListener('click', validateData);
        }
    })
});