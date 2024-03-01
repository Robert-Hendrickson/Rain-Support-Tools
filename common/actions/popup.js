let error_growl;
function popup_error_growl(error_object){
    //set an empty html string to be edited later
    let template_html = 'These are the issues found with the data provided:<span onclick="Close_error_growl()">X</span><ul>';
    //loop through object to make the template based on object data
    for (const error in error_object) {
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
            return error_object
        }
    });
    //mount the vue app
    error_growl.mount('#error_message');
    $('#error_message').removeClass('hide');
};
function Close_error_growl(){
    error_growl.unmount();
    $('#error_message').addClass('hide');
};