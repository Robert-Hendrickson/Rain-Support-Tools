/**
 * @module validate-step-2
 * @description This module is used to validate the data entered on step 2 of the bug ticket form.
 */
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
            <button tabindex="-1" class="btn secondary" @click="addTableRow('steps-table')">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeTableRow('steps-table')">Remove Row</button>
        </div>
        <table id="steps-table">
            <tbody>
                <tr>
                    <td>
                        Step 1<input tabindex="-1" placeholder="Enter Step 1" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        Step 2<input tabindex="-1" placeholder="Enter Step 2" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        Step 3<input tabindex="-1" placeholder="Enter Step 3" type="text" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: {
        brand: String,
        step: Number
    },
    methods: {
        async validate(returnData){
            //create object to store any errors found in the form
            let bad_data_list = {};
            //check if there are any steps
            if(document.querySelectorAll('#steps-table tbody tr').length < 1){
                bad_data_list['steps'] = 'Please list the steps taken to reproduce the issue.';
                returnData({success: false, data: bad_data_list});
                return;
            }
            //check each step
            document.querySelectorAll('#steps-table tbody tr input').forEach(function (element){
                if(element.value === '' || (/^[iI][fF]\s/).test(element.value)){
                    if(element.value === '' && !bad_data_list['steps']){
                        bad_data_list['steps'] = 'Please make sure all available rows have data. If there are any blank rows use the "Remove Row" button to remove unnecessary rows.';
                    }
                    if((/^[iI][fF]\s/).test(element.value) && !bad_data_list['uncertain']){
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
                document.querySelectorAll('#steps-table tbody tr input').forEach((element,index) => {
                    steps += `${index + 1}. ${element.value}\n`;
                });
                returnData({success: true, data: steps});
            };
        },
        addTableRow(table){
            let row_label;//switch statement finds the correct row label
            switch(table) {
                case 'steps-table':
                    row_label = 'Step';
                    break;
                case 'screenshot-table':
                    row_label = 'Image';
                    break;
                case 'video-table':
                    row_label = 'Video';
                    break;
                default:
                    console.error('Something went wrong. Passed table type was not of an expected value: ' + table);
            }
            //finds what row is being added by how many already exist
            let new_row_number = document.querySelectorAll(`#${table} tbody tr`).length + 1;
            //create a new table row and append it to the table
            try{
                document.querySelector(`#${table} tbody`).insertAdjacentHTML('beforeend', `<tr><td>${row_label} ${new_row_number}<input placeholder="Enter ${row_label} ${new_row_number}" type="text" /></td></tr>`);
            }catch(error){
                console.error(`Error adding table row: ${table}`, error);
            }
        },
        removeTableRow(table){
            try{
                document.querySelector(`#${table} tbody tr:last-child`).remove();
            }catch(error){
                console.error(`Error removing table row: ${table}`, error);
            }
        },
    }
}