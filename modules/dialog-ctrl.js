function customDialogResponse(text_string_content, submit_button = "OK", close_button = 'Cancel'){
    return new Promise((resolve) => {
        $('body').prepend('<dialog></dialog>');
        let dialog_el = $('dialog')[0];
        
        let html = '<div id="dialog-text">{{content_text}}</div><div id="buttons"><button class="btn primary" id="submit-choice">{{submit_choice}}</button><button class="btn secondary" id="cancel-choice">{{cancel_choice}}</button></div>';
        dialog_build = Vue.createApp({
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

        const handleYes = () => {
            resolve(true);
            dialog_el.remove();
        }

        const handleNo = () => {
            resolve(false);
            dialog_el.remove();
        }

        document.getElementById('submit-choice').addEventListener("click",handleYes,{once: true})
        document.getElementById('cancel-choice').addEventListener("click",handleNo,{once: true})
        dialog_el.showModal();
    });
}