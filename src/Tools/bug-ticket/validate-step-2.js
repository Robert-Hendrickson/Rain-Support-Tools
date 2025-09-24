/**
 * @module validate-step-2
 * @description This module is used to validate the data entered on step 2 of the bug ticket form.
 */
import { nextTick } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';

export default {
    name: 'validate-step-2',
    template: `
    <div style="z-index: 2;" id="steps-content" data="2" :class="{active: this.$props.step === 2, 'in-active': this.$props.step < 2, complete: this.$props.step > 2}">
        <h2 class="header-center">
            <div title="Step by step instructions on how to reproduce the issue." class="note-wrapper">
                Steps to Reproduce
                <span class="fa-solid fa-question"></span>
            </div>
        </h2>
        <div table-controls>
            <button :tabIndex="this.$props.step === 2 ? '0' : '-1'" class="btn secondary" @click="addTableRow">Add Row</button>
            <button :tabIndex="this.$props.step === 2 ? '0' : '-1'" class="btn secondary" @click="removeTableRow">Remove Row</button>
        </div>
        <table id="steps-table">
            <tbody>
                <tr v-for="(step, index) in steps" :key="index">
                    <td>
                        Step {{ index + 1 }}<input :ref="'step-' + (index + 1)" :tabIndex="this.$props.step === 2 ? '0' : '-1'" :placeholder="'Enter Step ' + (index + 1)" type="text" v-model="steps[index]" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: {
        brand: {
            type: String,
            default: ''
        },
        step: {
            type: Number,
            default: 1
        }
    },
    data(){
        return {
            steps: ['','','']
        }
    },
    mounted(){
        if(location.search === '?test'){
            this.steps = ['test step 1', 'test step 2', 'test step 3']
        }
    },
    methods: {
        async validate(returnData){
            //create object to store any errors found in the form
            let bad_data_list = {};
            //check if there are any steps
            if(this.steps.length < 1){
                bad_data_list['steps'] = 'Please list the steps taken to reproduce the issue.';
                returnData({success: false, data: bad_data_list});
                return;
            }
            //check each step
            this.steps.forEach(function (element){
                if(element === '' || (/^[iI][fF]\s/).test(element)){
                    if(element === '' && !bad_data_list['steps']){
                        bad_data_list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                    }
                    if((/^[iI][fF]\s/).test(element) && !bad_data_list['uncertain']){
                        bad_data_list['uncertain'] = 'One or more of the steps provided start with the word "If". Please use concise language and list only steps that you have taken or were taken to produce the behavior being reported. If you have concerns about a step please speak with an L2 or L3.';
                    }
                }
            });
            //if there are any errors, return the errors
            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                //if there are no errors, return the steps
                let steps = '';
                this.steps.forEach((element,index) => {
                    steps += `${index + 1}. ${element.value}\n`;
                });
                returnData({success: true, data: steps});
            };
        },
        addTableRow(){
            try {
                this.steps.push('');
            }catch(error){
                console.error(`Error adding table row`, error);
            }
        },
        removeTableRow(){
            try{
                this.steps.pop();
            }catch(error){
                console.error(`Error removing table row`, error);
            }
        },
    }
}