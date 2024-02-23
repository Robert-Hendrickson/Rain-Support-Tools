let growl;
function test(value){
    if($('#test')[0].__vue_app__){
        growl.unmount();
    };
    growl= Vue.createApp({
        template:`<div>{{test}}</div>`,
        data() {
            return {
                test: value
            }
        }
    });
    growl.mount('#test');
};