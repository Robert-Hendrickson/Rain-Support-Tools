let growl;
function test(error_object){
    //set an empty html string to be edited later
    let template_html = '';
    //loop through object to make the template based on object data
    for (const error in error_object) {
        template_html += `<div>{{${error}}}</div><br />`;
    };
    //if the target element has a mount running, unmount it (likely to be moved to a different function later for closing popup)
    if($('#error_message')[0].__vue_app__){
        growl.unmount();
    };
    //create vue app with template and data return points
    growl = Vue.createApp({
        template: template_html,
        data() {
            return error_object
        }
    });
    //mount the vue app
    growl.mount('#error_message');
};