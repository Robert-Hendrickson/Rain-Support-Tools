/**
 * @module validate-step-1
 * @description This module is used to validate the data entered on step 1 of the bug ticket form.
 */
export default {
    name: 'validate-step-1',
    template: `
    <div style="z-index: 1;" id="basic-content" data="1" :class="{active: this.$props.step === 1, 'in-active': this.$props.step < 1, complete: this.$props.step > 1}">
        <div title="The Support Rep submitting the ticket." class="note-wrapper">
            Support Tech Name
            <span class="fa-solid fa-question"></span>
        </div>
        <input id="Support-Rep" type="text" placeholder="Enter Support Rep" :tabindex="this.$props.step === 1 ? '0' : '-1'" />
        <br>
        <div title="The name of the store you are submitting the ticket for." class="note-wrapper">
            Store Name
            <span class="fa-solid fa-question"></span>
        </div>
        <input id="Store-Name" type="text" placeholder="Enter Store Name" :tabindex="this.$props.step === 1 ? '0' : '-1'" />
        <br>
        <div :title="this.$props.brand === 'etailpet' ? 'The Dashboard URL of the client you are submitting the ticket for.' : 'The CRM ID of the client you are submitting the ticket for.'" class="note-wrapper">
            {{ this.$props.brand === 'etailpet' ? 'Dashboard URL' : 'CRM' }}
            <span class="fa-solid fa-question"></span>
        </div>
        <input id="crm" type="text" :placeholder="this.$props.brand === 'etailpet' ? 'Enter a Dashboard URL' : 'Enter a CRM'" :tabindex="this.$props.step === 1 ? '0' : '-1'" />
        <br>
        <div title="The part of the system affected by the bug." class="note-wrapper">
            System Area Affected
            <span class="fa-solid fa-question"></span>
        </div>
        <input id="systemArea" type="text" placeholder="Enter Part of the System Affected" :tabindex="this.$props.step === 1 ? '0' : '-1'" />
        <br>
        <div title="Are you able to follow a set of steps to reproduce the bug consistently?" class="note-wrapper">
            Can you replicate this on a Test Site or Customers Site?
            <span class="fa-solid fa-question"></span>
        </div>
        <div choice-selector replicable-selector>
            <div replicable='yes' @click="handleReplicableToggle">Yes</div>
            <div replicable='no' @click="handleReplicableToggle">No</div>
        </div><br>
        <div title="If 'yes' to above select any below that apply." class="note-wrapper">
            Where were able to replicate the behavior?(If 'yes' to above select any below that apply)
            <span class="fa-solid fa-question"></span>
        </div>
        <div choice-selector where-selector>
            <div where='Test' @click="handleWhereToggle">Test Site</div>
            <div where='Customer' @click="handleWhereToggle">Customer Site</div>
        </div>
    </div>`,
    props: {
        brand: String,
        step: Number
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

            //check the CRM field for errors
            let crm_valid;
            try {
                crm_valid = this.checkCRM(document.getElementById('crm').value);
            } finally {
                if(crm_valid.error){
                    bad_data_list['crm'] = crm_valid.error;
                }
            }

            if (document.getElementById('systemArea').value === '') {
                bad_data_list['system'] = 'Please enter the area of the system that is affected.';
            }

            if (!document.querySelectorAll('[replicable].selected').length) {
                bad_data_list['replicable'] = 'Please select if this is replicable or not.';
            }

            if (document.querySelector('[replicable].selected')?.textContent === 'Yes' && !document.querySelectorAll('[where].selected').length) {
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
            //custom brand behaviors

            /*Etailpet CRM Check behaviors*/
            //etailpet uses a url for accessing store dashboards
            //confirm the url contains the correct components
            if (this.$props.brand === 'etailpet' ){
                //check for value
                if (
                    value === '' || !(RegExp(/\/retailer\/dash\/$/).test(value) || RegExp(/\/site-admin\/login\/$/).test(value))
                ){
                    return {error: 'Please enter a valid Dashboard URL. Example: (https://)etailpet.com/retailer/dash/'};
                }
                return {success: true};
            }
            /*End Etailpet CRM Check behaviors*/


            /*Default CRM Check behaviors*/
            //check the value of the crm field meets the requirements for the brand
            //if the value is empty, return false
            if(
                value === ''
                ||
                !RegExp(/^(?:[c|C][r|R][m|M])?\d{2,}$/).test(value)
            ){
                return {error: 'Please enter a valid CRM.'};
            }
            return {success: true};
        },
        handleReplicableToggle(event){
            document.querySelector('[replicable].selected')?.classList.remove('selected');
            event.target.classList.add('selected');
        },
        handleWhereToggle(event){
            event.target.classList.toggle('selected');
        }
    }
}