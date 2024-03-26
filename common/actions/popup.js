//change error growl so that it has a bunch of v-if statements and only displays lines that we want based on passed in info. This should allow for more dynamic error messages so that it can be utalized for other things too.
let error_growl;
function popup_error_growl(error_object){
    if(error_object.type === 'generate'){
        //set an empty html string to be edited later
        let template_html = 'These are the issues found with the data provided:<span onclick="Close_error_growl()">X</span><ul>';
        //loop through object to make the template based on object data
        for (const error in error_object.list) {
            if(error === 'example'){
                template_html +=`<li v-if='example'>Please make sure that the data in examples meet the expected criteria.<ul><li>Cannot be blank</li><li>Cannot be N/A</li><li>Given links cannot point back to admin domains (rainadmin.com/quiltstorewebsites.com)</li></ul></li>`
            }else{
                template_html += `<li>{{${error}}}</li>`;
            };
        };
        //close ul element
        template_html += `</ul>`;
        //if the target element has a mount running, unmount it (likely to be moved to a different function later for closing popup)
        if($('#error_message')[0].__vue_app__){
            error_growl.unmount();
        };
        //create vue app with template and data return points
        error_growl = Vue.createApp({
            template: template_html,
            data() {
                return error_object.list
            }
        });
        //mount the vue app
        error_growl.mount('#error_message');
        $('#error_message').removeClass('hide');
    };
    if(error_object.type === 'list'){
        let message = `<strong>Input Warning:</strong><span onclick="Close_error_growl()">X</span><br /><div v-if='message'>You are approaching a large number of rows for this set of data. Please make sure that you are being clear, concise, and direct with your given data.</div>`;
        //if the target element has a mount running, unmount it (likely to be moved to a different function later for closing popup)
        if($('#error_message')[0].__vue_app__){
            error_growl.unmount();
        };
        //create vue app with template and data return points
        error_growl = Vue.createApp({
            template: message,
            data() {
                return error_object.message
            }
        });
        //mount the vue app
        error_growl.mount('#error_message');
        $('#error_message').removeClass('hide')
    };
};
function Close_error_growl(){
    error_growl.unmount();
    $('#error_message').addClass('hide');
};