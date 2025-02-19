export default async function customDialogResponse(text_string_content, submit_button = "OK", close_button = 'Cancel'){
    return new Promise((resolve) => {
        document.querySelector('body').insertAdjacentHTML('beforebegin', '<dialog></dialog>');
        let dialog_el = document.querySelector('dialog');
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            dialog{
                margin: 0 auto;
                top: 60px;
                width: 450px;
                min-height: 60px;
                padding: 16px;
                background-color: #ffffff;
                border: 3px solid #000;
                border-radius: 16px;
            }
            dialog::backdrop{
                background-color: #5c5c5c;
                opacity: 60%;
            }
            dialog #modal-content{
                padding-bottom: 10px;
            }
            dialog #dialog-text{
                padding: 16px 8px;
            }
            dialog #dialog-text ul{
                list-style: decimal
            }
            dialog #dialog-text ul li{
                padding: 2px 0px;
            }
            dialog #buttons{
                text-align: right;
            }
            dialog #buttons button{
                margin: 0 4px;
            }
            dialog #buttons button.btn{
                border-color: #000000;
            }
        `;
        let html = `<div id="dialog-text">${text_string_content}</div><div id="buttons"><button class="btn primary" id="submit-choice">{{submit_choice}}</button><button class="btn secondary" id="cancel-choice">{{cancel_choice}}</button></div>`;
        let dialog_build = Vue.createApp({
            template: html,
            data() {
                return {
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

        document.getElementById('submit-choice').addEventListener("click",handleYes,{once: true});
        document.getElementById('cancel-choice').addEventListener("click",handleNo,{once: true});
        dialog_el.appendChild(styleElement);
        dialog_el.showModal();
    });
}