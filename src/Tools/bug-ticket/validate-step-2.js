/**
 * @module validate-step-2
 * @description This module is used to validate the data entered on step 2 of the bug ticket form.
 */
export default {
    name: 'validate-step-2',
    props: {
        brand: String
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
        }
    }
}