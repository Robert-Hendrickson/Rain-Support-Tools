/**
 * @module validate-step-1
 * @description This module is used to validate the data entered on step 1 of the bug ticket form.
 */
import { textInputComponent } from '../../components/text-input/text-input-component.js';
import { numberInputComponent } from '../../components/number-input/number-input-component.js';
import { dropdownSelectComponent } from '../../components/dropdown-select/dropdown-select-component.js';
import { textareaComponent } from '../../components/textarea/textarea-component.js';
import { optionPickerComponent } from '../../components/option-picker/option-picker-component.js';
export default {
    name: 'validate-step-1',
    components: {
        textInputComponent,
        numberInputComponent,
        dropdownSelectComponent,
        textareaComponent,
        optionPickerComponent,
    },
    template: `
    <div style="z-index: 1;" id="basic-content" data="1" :class="{active: this.$props.step === 1, 'in-active': this.$props.step < 1, complete: this.$props.step > 1}">
        <text-input-component
            placeholder="Enter Support Rep"
            label="Support Tech Name"
            id="Support-Rep"
            title="The Support Rep submitting the ticket."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.supportRep"
            @updateValue="handleSupportRepUpdate"
        />
        <text-input-component
            placeholder="Enter Store Name"
            label="Store Name"
            id="Store-Name"
            title="The name of the store you are submitting the ticket for."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.storeName"
            @updateValue="handleStoreNameUpdate"
        />
        <text-input-component
            v-if="this.showCRMField"
            placeholder="Enter a CRM"
            label="CRM"
            id="crm"
            title="The CRM ID of the client you are submitting the ticket for."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.crm"
            @updateValue="handleCRMUpdate"
        />
        <text-input-component
            v-if="this.showDashboardURLField"
            placeholder="Enter a Dashboard URL"
            label="Dashboard URL"
            id="Dashboard-URL"
            title="The Dashboard URL of the client you are submitting the ticket for."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.dashboardURL"
            @updateValue="handleDashboardURLUpdate"
        />
        <dropdown-select-component
            v-if="this.$props.brand === 'rezo'"
            label="Rezo Brand"
            id="rezo-brand"
            title="The brand of the Rezo store you are submitting the ticket for."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :options="rezoBrandList"
            emptyOption="Select a Brand"
            :value="this.rezoBrand"
            @updateValue="handleRezoBrandUpdate"
        />
        <text-input-component
            placeholder="Enter the part of the system affected"
            label="System Area Affected"
            id="systemArea"
            title="The part of the system affected by the bug."
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.systemArea"
            @updateValue="handleSystemAreaUpdate"
        />
        <option-picker-component
            label="Can you replicate this on a Test Site or Customers Site?"
            id="replicable"
            title="Are you able to follow a set of steps to reproduce the bug consistently?"
            :options="['Yes', 'No']"
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.replicable"
            @updateValue="handleReplicableUpdate"
        />
        <option-picker-component
            label="Where were able to replicate the behavior?(If 'yes' to above select any below that apply)"
            id="where"
            title="If 'yes' to above select any below that apply."
            :options="['Test Site', 'Customer Site']"
            tabindex="this.$props.step === 1 ? '0' : '-1'"
            :value="this.where"
            multiSelect
            @updateValue="handleWhereUpdate"
        />
    </div>`,
    props: {
        brand: String,
        step: Number
    },
    data() {
        return {
            rezoBrandList: ['Bike Rental', 'GMS (fishing)', 'Ski Rental', 'Raft', 'Ski Tune', 'Other'],
            supportRep: '',
            storeName: '',
            crm: '',
            dashboardURL: '',
            rezoBrand: '',
            systemArea: '',
            replicable: [],
            where: [],
        }
    },
    computed: {
        showCRMField() {
            return this.$props.brand !== 'rezo' && this.$props.brand !== 'etailpet';
        },
        showDashboardURLField() {
            return this.$props.brand === 'etailpet';
        },
    },
    mounted() {
        try {
            if (location.search === '?test' || location.hostname === 'localhost') {
                this.supportRep = 'Test Support Rep';
                this.storeName = 'Test Store Name';
                this.crm = '123456';
                this.dashboardURL = 'https://test.com';
                this.rezoBrand = 'Bike Rental';
                this.systemArea = 'Test System Area';
                this.replicable = ['Yes'];
                this.where = ['Test Site'];
            }
        } catch(error) {
            console.error(`Error setting test data`, error);
        }
    },
    methods: {
        async validate(returnData) {
            //create object to store any errors found in the form
            let bad_data_list = {};
            //check the Support Rep field for errors
            if (this.supportRep === '') {
                bad_data_list['SupportRep'] = 'Please enter the name of the Support Rep submitting the ticket.';
            }

            //check the Store Name field for errors
            if (this.storeName === '') {
                bad_data_list['StoreName'] = 'Please enter the name of the store reporting an issue.';
            }

            //check the CRM field for errors
            if (
                this.showCRMField
                &&
                (this.crm === '' || !RegExp(/^(?:[c|C][r|R][m|M])?\d{2,}$/).test(this.crm))
            ) {
                bad_data_list['crm'] = 'Please enter a valid CRM.';
            }
            //check the Dashboard URL field for errors
            if (
                this.showDashboardURLField
                &&
                (this.dashboardURL === '' || !(RegExp(/\/retailer\/dash\/$/).test(this.dashboardURL) || RegExp(/\/site-admin\/login\/$/).test(this.dashboardURL)))
            ) {
                bad_data_list['dashboardURL'] = 'Please enter a valid Dashboard URL. Example: (https://)etailpet.com/retailer/dash/';
            }

            //check the System Area field for errors
            if (this.systemArea === '') {
                bad_data_list['system'] = 'Please enter the area of the system that is affected.';
            }

            //check the Replicable field for errors
            if (!this.replicable.length) {
                bad_data_list['replicable'] = 'Please select if this is replicable or not.';
            }

            //check the Where field for errors
            if (this.replicable.includes('Yes') && !this.where.length) {
                bad_data_list['where'] = 'Make sure to select at least one place where replication happened.';
            }

            //check the Rezo Brand field for errors
            if (this.$props.brand === 'rezo' && this.rezoBrand === '') {
                bad_data_list['rezo-brand'] = 'Please select a Rezo brand.';
            }

            if (Object.entries(bad_data_list).length) {
                returnData({success: false, data: bad_data_list});
            } else {
                let step1_data = {
                    tech: this.supportRep || '',
                    store: this.storeName || '',
                    store_id: this.crm || '',
                    dashboard_url: this.dashboardURL || '',
                    rezo_brand: this.rezoBrand || '',
                    area: this.systemArea || '',
                    replicable: this.replicable.includes('Yes') ? 'Yes' : 'No',
                    where: this.where || [],
                }
                returnData({success: true, data: step1_data});
            };
        },
        handleSupportRepUpdate(value) {
            this.supportRep = value;
        },
        handleStoreNameUpdate(value) {
            this.storeName = value;
        },
        handleCRMUpdate(value) {
            this.crm = value;
        },
        handleDashboardURLUpdate(value) {
            this.dashboardURL = value;
        },
        handleRezoBrandUpdate(value) {
            this.rezoBrand = value;
        },
        handleSystemAreaUpdate(value) {
            this.systemArea = value;
        },
        handleReplicableUpdate(value) {
            this.replicable = value;
        },
        handleWhereUpdate(value) {
            this.where = value;
        },
    }
}
