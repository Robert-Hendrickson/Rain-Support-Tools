let test_el = document.getElementsByTagName('dialog')[0];
function showDialog(text_string_content, submit_button = 'OK', close_button = 'Close'){
    let dialog_el = document.createElement('dialog');
    
    let html = '<div id="modal-content">{{content_text}}</div><div id="buttons"><button class="btn primary">{{submit_choice}}</button><button class="btn secondary" onclick="closeDialogModal()">{{cancel_choice}}</button></div>';
    let dialog_build = Vue.createApp({
        template : html,
        data() {
            return {
                'content_text': text_string_content,
                'submit_choice': submit_button,
                'cancel_choice': close_button
            }
        }
    });
    if(dialog_el.__vue_app__){
        dialog_el.__vue_app__.unmount();
    };
    dialog_build.mount(dialog_el);
    $('body').append(dialog_el);
    dialog_el.showModal();
}
function closeDialogModal(){
    $('dialog')[0].close();
    $('dialog')[0].remove();
}

//export list
//export {test_el, showDialog, closeDialogModal};