/**
 * @module validate-step-1
 * @description This module is used to validate the data entered on step 1 of the bug ticket form.
 */
export default {
    name: 'validate-step-1',
    props: {
        brand: String
    },
    methods: {
        async validate(returnData){
            //create object to store any errors found in the form
            let bad_data_list = {};
            if (document.getElementById('Support-Rep').value === '') {
                bad_data_list['SupportRep'] = 'Please enter the name of the Support Rep submitting the ticket.';
            }

            if (document.getElementById('Store-Name').value === '') {
                bad_data_list['StoreName'] = 'Please enter the name of the store reporting an issue.';
            }

            if (!this.checkCRM(document.getElementById('crm').value)) {
                if (this.$props.brand === 'etailpet') {
                    bad_data_list['crm'] = 'Please make sure the CRM Field has a valid dashboard URL.';
                } else {
                    bad_data_list['crm'] = 'The CRM needs to be a valid CRM.(2 digits or more)';
                }
            }

            if (document.getElementById('systemArea').value === '') {
                bad_data_list['system'] = 'Please enter the area of the system that is affected.';
            }

            if (!document.querySelectorAll('[replicable].selected').length) {
                bad_data_list['replicable'] = 'Please select if this is replicable or not.';
            }

            if (document.querySelector('[replicable].selected').textContent === 'Yes' && !document.querySelectorAll('[where].selected').length) {
                bad_data_list['where'] = 'Make sure to select at least one place where replication happened.';
            }

            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                let step1_data = {
                    tech: document.getElementById('Support-Rep').value,
                    store: document.getElementById('Store-Name').value,
                    store_id: document.getElementById('crm').value,
                    area: document.getElementById('systemArea').value,
                    replicable: document.querySelector('[replicable].selected').textContent,
                    where: Array.from(document.querySelectorAll('[where].selected')).map(el => el.textContent)
                }
                returnData({success: true, data: step1_data});
            };
        },
        checkCRM(value){
            //check the value of the crm field meets the requirements for the brand
            //if the value is empty, return false
            if(value === ''){
                return false;
            }
            //etailpet uses a url for accessing store dashboards
            //confirm the url contains the correct components
            if(
                this.$props.brand === 'etailpet'
                &&
                (
                    !RegExp(/^https?:\/\//).test(value) 
                    || 
                    !RegExp(/\/retailer\/dash\/$/).test(value)
                )
            ){
                return false;
            }
            //default check for a valid CRM number
            if(!RegExp(/^(?:[c|C][r|R][m|M])?\d{2,}$/).test(value)){
                return false;
            }
            return true;
        }
    }
}