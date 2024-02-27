function test(error_object){
    let growl;
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

/*
This change will require a new set of checks for each field that will potentially prompt this new script.
thoughts:
CRM field should require one of two formats crm1234 or 1234. This regex will check that values match one of those two types ^((c|C)(r|R)(m|M)){0,1}\d{3,}
*/