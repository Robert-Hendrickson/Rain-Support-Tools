import custom_dialogue from '../../modules/custom-dialogue/dialog-ctrl.js';
export default {
    name: 'step-1',
    props: {
        step: {
            type: Number,
            required: true
        },
        actions: {
            type: Object,
            required: true
        }
    },
    template: `
    <div id="basic-content" data="1"  :class="{'active': step === 1, 'complete': step > 1}">
        <p>Enter Domain being worked on:</p>
        <input id="domain" type="text" placeholder="websiteUrl.com" v-model="domain"/>
        <p>Select the action that needs to happen with Records:</p>
        <div choice-selector>
            <div action='add-record' :class="{'selected': actions.add_record}" @click="actions.add_record = !actions.add_record">Add Record(s)</div>
            <div action='correct-record' :class="{'selected': actions.correct_record}" @click="actions.correct_record = !actions.correct_record">Correct Existing Record(s)</div>
            <div action='remove-record' :class="{'selected': actions.remove_record}" @click="actions.remove_record = !actions.remove_record">Remove Record(s)</div>
        </div>
    </div>`,
    methods: {
        async validateData(resolve) {
            let error_list = {};
            if(!(/^(?:[\w\-]+\.)?[\w\-]+\.\w{2,}$/).test(this.domain)){
                error_list.domain = 'Domain is invalid';
            }
            
            if(this.actions.add_record === false && this.actions.correct_record === false && this.actions.remove_record === false){
                error_list.action_type = 'At least one action type is required';
            }
            if(Object.keys(error_list).length > 0){
                resolve({success: false, data: error_list});
            } else {
                resolve({success: true, data: {domain: this.domain}});
            }
        }
    }
}