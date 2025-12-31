import errorCtrl from '../../modules/error-popup/errorCtrl.js';
import { textInputComponent } from '../../components/text-input/text-input-component.js';
import { dropdownSelectComponent } from '../../components/dropdown-select/dropdown-select-component.js';

export default {
    name: 'record-editor',
    components: {
        errorCtrl,
        textInputComponent,
        dropdownSelectComponent,
    },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        record: {
            type: Object,
            required: true
        },
        isCorrection: {
            type: Boolean,
            default: false
        },
        domain: {
            type: String,
            required: true
        },
    },
    watch: {
        record: {
            immediate: true,
            handler(newVal) {
                this.recordCopy = { ...newVal };
            },
        },
    },
    template: `
    <div v-if="show" id="record-entry-container">
        <div id="record-entry-box">
            <span class="close" @click="closeEditor">X</span>
            <h3>Record Information</h3>
            <div>
                <h4 v-if="isCorrection">Original Values</h4>
                <dropdown-select-component
                    label="Type:"
                    id="type"
                    emptyOption="Select Type"
                    :options="typeOptions"
                    :value="recordCopy.type"
                    @updateValue="updateType"
                />
                <text-input-component
                    label="Name:"
                    id="name"
                    :value="recordCopy.name"
                    @updateValue="updateName"
                />
                <text-input-component
                    v-if="!isMXRecord && !isSRVRecord"
                    label="Value:"
                    id="value"
                    :value="recordCopy.value"
                    @updateValue="updateRecordCopyValue"
                />
                <text-input-component
                    v-if="isMXRecord || isSRVRecord"
                    label="Priority:"
                    id="priority"
                    :value="recordCopy.priority"
                    @updateValue="updatePriority"
                />
                <text-input-component
                    v-if="isMXRecord"
                    label="Mail Host Name:"
                    id="mailHostName"
                    :value="recordCopy.mailHostName"
                    @updateValue="updateMailHostName"
                />
                <text-input-component
                    v-if="isSRVRecord"
                    label="Weight:"
                    id="weight"
                    :value="recordCopy.weight"
                    @updateValue="updateWeight"
                />
                <text-input-component
                    v-if="isSRVRecord"
                    label="Port:"
                    id="port"
                    :value="recordCopy.port"
                    @updateValue="updatePort"
                />
                <text-input-component
                    v-if="isSRVRecord"
                    label="Server Host Name:"
                    id="serverHost"
                    :value="recordCopy.serverHost"
                    @updateValue="updateServerHost"
                />
                <text-input-component
                    label="Requested TTL (Optional):"
                    id="ttl"
                    :value="recordCopy.ttl"
                    @updateValue="updateTtl"
                />
            </div>
            <div v-if="isCorrection">
                <h4>New Values</h4>
                <dropdown-select-component
                    label="Type:"
                    id="newType"
                    emptyOption="Select Type"
                    :options="typeOptions"
                    :value="recordCopy.newType"
                    @updateValue="updateNewType"
                />
                <text-input-component
                    label="Name:"
                    id="newName"
                    :value="recordCopy.newName"
                    @updateValue="updateNewName"
                />
                <text-input-component
                    v-if="!isNewMXRecord && !isNewSRVRecord"
                    label="Value:"
                    id="newValue"
                    :value="recordCopy.newValue"
                    @updateValue="updateNewRecordCopyValue"
                />
                <text-input-component
                    v-if="isMXRecord || isSRVRecord"
                    label="Priority:"
                    id="priority"
                    :value="recordCopy.priority"
                    @updateValue="updatePriority"
                />
                <text-input-component
                    v-if="isNewMXRecord"
                    label="Mail Host Name:"
                    id="newMailHostName"
                    :value="recordCopy.newMailHostName"
                    @updateValue="updateNewMailHostName"
                />
                <text-input-component
                    v-if="isNewSRVRecord"
                    label="Weight:"
                    id="newWeight"
                    :value="recordCopy.newWeight"
                    @updateValue="updateNewWeight"
                />
                <text-input-component
                    v-if="isNewSRVRecord"
                    label="Port:"
                    id="newPort"
                    :value="recordCopy.newPort"
                    @updateValue="updateNewPort"
                />
                <text-input-component
                    v-if="isNewSRVRecord"
                    label="Server Host Name:"
                    id="newServerHost"
                    :value="recordCopy.newServerHost"
                    @updateValue="updateNewServerHost"
                />
                <text-input-component
                    label="Requested TTL (Optional):"
                    id="newTtl"
                    :value="recordCopy.newTtl"
                    @updateValue="updateNewTtl"
                />
            </div>
            <button class="btn secondary" @click="closeEditor">Cancel</button>
            <button style="float: right;" class="btn primary" @click="validateRecord">Submit</button>
        </div>
        <error-ctrl ref="errorCtrl"></error-ctrl>
    </div>
    `,
    data() {
        return {
            regex: {
                ipv4: /^(?:\d{1,3}\.){3}\d{1,3}$/,
                ipv6: /^(?:[a-zA-z0-9]{4}\:){7}[a-zA-z0-9]{4}$/,
                domain: /^((?:[\w\-]+\.)+)?[\w\-]+\.\w{2,}\.?$/,
            },
            typeOptions: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'PTR', 'SRV'],
            recordCopy: {},
        }
    },
    computed: {
        isMXRecord() {
            return this.recordCopy.type === 'MX';
        },
        isSRVRecord() {
            return this.recordCopy.type === 'SRV';
        },
        isNewMXRecord() {
            return this.recordCopy.newType === 'MX';
        },
        isNewSRVRecord() {
            return this.recordCopy.newType === 'SRV';
        }
    },
    methods: {
        isSubDomain() {
            return [(/^[\w\-]+\.[\w\-]+\.\w{2,}$/).test(this.domain),this.domain.match(/^[\w-]+/g)[0]];
        },
        updateType(value) {
            try {
                this.recordCopy.type = value;
            } catch (error) {
                console.error('Failed to update Type', error);
            }
        },
        updateNewType(value) {
            try {
                this.recordCopy.newType = value;
            } catch (error) {
                console.error('Failed to update New Type', error);
            }
        },
        updateName(value) {
            try {
                this.recordCopy.name = value;
            } catch (error) {
                console.error('Failed to update Name', error);
            }
        },
        updateNewName(value) {
            try {
                this.recordCopy.newName = value;
            } catch (error) {
                console.error('Failed to update New Value', error);
            }
        },
        updateRecordCopyValue(value) {
            try {
                this.recordCopy.value = value;
            } catch (error) {
                console.error('Failed to update Record Copy Value', error);
            }
        },
        updateNewRecordCopyValue(value) {
            try {
                this.recordCopy.newValue = value;
            } catch (error) {
                console.error('Failed to update New Record Copy Value', error);
            }
        },
        updatePriority(value) {
            try {
                this.recordCopy.priority = value;
            } catch (error) {
                console.error('Failed to update Priority', error);
            }
        },
        updateNewPriority(value) {
            try {
                this.recordCopy.newPriority = value;
            } catch (error) {
                console.error('Failed to update New Priority', error);
            }
        },
        updateMailHostName(value) {
            try {
                this.recordCopy.mailHostName = value;
            } catch (error) {
                console.error('Failed to update Mail Host Name', error);
            }
        },
        updateNewMailHostName(value) {
            try {
                this.recordCopy.newMailHostName = value;
            } catch (error) {
                console.error('Failed to update New Mail Host Name', error);
            }
        },
        updateWeight(value) {
            try {
                this.recordCopy.weight = value;
            } catch (error) {
                console.error('Failed to update Weight', error);
            }
        },
        updateNewWeight(value) {
            try {
                this.recordCopy.newWeight = value;
            } catch (error) {
                console.error('Failed to update New Weight', error);
            }
        },
        updatePort(value) {
            try {
                this.recordCopy.port = value;
            } catch (error) {
                console.error('Failed to update Port', error);
            }
        },
        updateNewPort(value) {
            try {
                this.recordCopy.newPort = value;
            } catch (error) {
                console.error('Failed to update New Port', error);
            }
        },
        updateServerHost(value) {
            try {
                this.recordCopy.serverHost = value;
            } catch (error) {
                console.error('Failed to update Server Host', error);
            }
        },
        updateNewServerHost(value) {
            try {
                this.recordCopy.newServerHost = value;
            } catch (error) {
                console.error('Failed to update New Server Host', error);
            }
        },
        updateTtl(value) {
            try {
                this.recordCopy.ttl = value;
            } catch (error) {
                console.error('Failed to update TTL', error);
            }
        },
        updateNewTtl(value) {
            try {
                this.recordCopy.newTtl = value;
            } catch (error) {
                console.error('Failed to update New TTL', error);
            }
        },
        validateRecord() {
            this.$refs.errorCtrl.closeErrorDisplay();
            let error_list = {};
            //check type is selected
            if (!this.recordCopy.type) {
                error_list['type'] = 'Type is required';
            }
            //check name is entered
            if (!this.recordCopy.name) {
                error_list['name'] = 'Name is required. If the data given to you by a customer has no value for the Name, please confirm with the customer that this is intentional. If confirmed please enter "@" as the value.';
            }
            //check value data based on type
            if (this.recordCopy.type === 'A') {
                if (!(this.regex.ipv4).test(this.recordCopy.value)) {
                    error_list['value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
                }
            }
            if (this.recordCopy.type === 'AAAA') {
                if (!(this.regex.ipv6).test(this.recordCopy.value)) {
                    error_list['value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
                }
            }
            if (this.recordCopy.type === 'CNAME') {
                if (!(this.regex.domain).test(this.recordCopy.value)) {
                    error_list['value'] = 'CNAME record value needs to be a domain. (www.domain.com)';
                }
            }
            if (this.recordCopy.type === 'TXT') {
                if (!this.recordCopy.value) {
                    error_list['value'] = 'TXT record value is required';
                }
            }
            if (this.recordCopy.type === 'PTR') {
                if (!this.recordCopy.name || !(this.regex.ipv4).test(this.recordCopy.name)) {
                    error_list['name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
                }
                if (!(this.regex.domain).test(this.recordCopy.value)) {
                    error_list['value'] = 'PTR needs to be a domain (www.domain.com)';
                }
            }
            if (this.recordCopy.type === 'MX') {
                if (!(/^\d+$/).test(this.recordCopy.priority)) {
                    error_list['priority'] = 'MX record priority needs to be a number. (10)';
                }
                if (!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.recordCopy.mailHostName)) {
                    error_list['mailHostName'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
                }
            }
            if (this.recordCopy.type === 'SRV') {
                if (!(/^\d+$/).test(this.recordCopy.priority)) {
                    error_list['priority'] = 'SRV record priority needs to be a number. (10)';
                }
                if (!(/^\d+$/).test(this.recordCopy.weight)) {
                    error_list['weight'] = 'SRV record weight needs to be a number. (10)';
                }
                if (!(/^\d+$/).test(this.recordCopy.port)) {
                    error_list['port'] = 'SRV record port needs to be a number. (10)';
                }
                if (!(this.regex.domain).test(this.recordCopy.serverHost)) {
                    error_list['serverHost'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
                }
            }
            if (this.isCorrection) {
                //check new values are valid
                //check type is selected
                if (!this.recordCopy.newType) {
                    error_list['type'] = 'Type is required';
                }
                //check name is entered
                if (!this.recordCopy.newName) {
                    error_list['name'] = 'Name is required. If the data given to you by a customer has no value for the Name, please confirm with the customer that this is intentional. If confirmed please enter "@" as the value.';
                }
                //check value data based on type
                if (this.recordCopy.newType === 'A') {
                    if (!(this.regex.ipv4).test(this.recordCopy.newValue)) {
                        error_list['value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
                    }
                }
                if (this.recordCopy.newType === 'AAAA') {
                    if (!(this.regex.ipv6).test(this.recordCopy.newValue)) {
                        error_list['value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
                    }
                }
                if (this.recordCopy.newType === 'CNAME') {
                    if (!(this.regex.domain).test(this.recordCopy.newValue)) {
                        error_list['value'] = 'CNAME record value needs to be a domain. (www.domain.com)';
                    }
                }
                if (this.recordCopy.newType === 'TXT') {
                    if (!this.recordCopy.newValue) {
                        error_list['value'] = 'TXT record value is required';
                    }
                }
                if (this.recordCopy.newType === 'PTR') {
                    if (!this.recordCopy.newName || !(this.regex.ipv4).test(this.recordCopy.newName)) {
                        error_list['name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
                    }
                    if (!(this.regex.domain).test(this.recordCopy.newValue)) {
                        error_list['value'] = 'PTR needs to be a domain (www.domain.com)';
                    }
                }
                if (this.recordCopy.newType === 'MX') {
                    if (!(/^\d+$/).test(this.recordCopy.newPriority)) {
                        error_list['priority'] = 'MX record priority needs to be a number. (10)';
                    }
                    if (!(this.regex.domain).test(this.recordCopy.newMailHostName)) {
                        error_list['mailHostName'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
                    }
                }
                if (this.recordCopy.newType === 'SRV') {
                    if (!(/^\d+$/).test(this.recordCopy.newPriority)) {
                        error_list['priority'] = 'SRV record priority needs to be a number. (10)';
                    }
                    if (!(/^\d+$/).test(this.recordCopy.newWeight)) {
                        error_list['weight'] = 'SRV record weight needs to be a number. (10)';
                    }
                    if (!(/^\d+$/).test(this.recordCopy.newPort)) {
                        error_list['port'] = 'SRV record port needs to be a number. (10)';
                    }
                    if (!(this.regex.domain).test(this.recordCopy.newServerHost)) {
                        error_list['serverHost'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
                    }
                }
            }
            if (Object.keys(error_list).length > 0) {
                this.$refs.errorCtrl.updateErrorObject(error_list);
            } else {
                this.checkTtl();
                this.checkValue();
                this.submitRecord();
            }
        },
        checkTtl() {
            if (!this.recordCopy.ttl) {
                this.recordCopy.ttl = 3600;
            }
            if (this.isCorrection && !this.recordCopy.newTtl) {
                this.recordCopy.newTtl = 3600;
            }
        },
        checkValue() {
            if (this.isMXRecord) {
                this.recordCopy.value = this.recordCopy.priority + ' ' + this.recordCopy.mailHostName;
            }
            if (this.isSRVRecord) {
                this.recordCopy.value = this.recordCopy.priority + ' ' + this.recordCopy.weight + ' ' + this.recordCopy.port + ' ' + this.recordCopy.serverHost;
            }
            if (this.isCorrection && this.isNewMXRecord) {
                this.recordCopy.newValue = this.recordCopy.newPriority + ' ' + this.recordCopy.newMailHostName;
            }
            if (this.isCorrection && this.isNewSRVRecord) {
                this.recordCopy.newValue = this.recordCopy.newPriority + ' ' + this.recordCopy.newWeight + ' ' + this.recordCopy.newPort + ' ' + this.recordCopy.newServerHost;
            }
        },
        closeEditor() {
            this.$emit('close-editor');
        },
        submitRecord() {
            this.$emit('save', { ...this.recordCopy });
        },
    },
}
