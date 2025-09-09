import errorCtrl from '../../modules/error-popup/errorCtrl.js';
export default {
    name: 'record-editor',
    components: {
        errorCtrl
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
        }
    },
    template: `
    <div v-if="show" id="record-entry-container">
        <div id="record-entry-box">
            <span class="close" @click="closeEditor">X</span>
            <h3>Record Information</h3>
            <div>
                <h4 v-if="isCorrection">Original Values</h4>
                <div>
                    Type:<br>
                    <select class="dns-selector" v-model="record.type">
                        <option value="">Select Type</option>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="TXT">TXT</option>
                        <option value="PTR">PTR</option>
                        <option value="SRV">SRV</option>
                    </select>
                </div>
                <div>
                    Name:<br>
                    <input type="text" v-model="record.name" />
                </div>
                <div v-if="record.type !== 'MX' && record.type !== 'SRV'">
                    Value:<br>
                    <input type="text" v-model="record.value" />
                </div>
                <div v-if="record.type === 'MX' || record.type === 'SRV'" mx srv priority>
                    Priority:<br>
                    <input type="text" v-model="record.priority" />
                </div>
                <div v-if="record.type === 'MX'" mx mail-host-name>
                    Mail Host Name:<br>
                    <input type="text" v-model="record.mailHostName" />
                </div>
                <div v-if="record.type === 'SRV'" srv weight>
                    Weight:<br>
                    <input type="text" v-model="record.weight" />
                </div>
                <div v-if="record.type === 'SRV'" srv port>
                    Port:<br>
                    <input type="text" v-model="record.port" />
                </div>
                <div v-if="record.type === 'SRV'" srv server-host>
                    Server Host Name:<br>
                    <input type="text" v-model="record.serverHost" />
                </div>
                <div>
                    Requested TTL (Optional):<br>
                    <input type="text" maxlength="5" v-model="record.ttl" />
                </div>
            </div>
            <div v-if="isCorrection">
                <h4>New Values</h4>
                <div>
                    Type:<br>
                    <select class="dns-selector" v-model="record.newType">
                        <option value="">Select Type</option>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="TXT">TXT</option>
                        <option value="PTR">PTR</option>
                        <option value="SRV">SRV</option>
                    </select>
                </div>
                <div>
                    Name:<br>
                    <input type="text" v-model="record.newName" />
                </div>
                <div v-if="record.newType !== 'MX' && record.newType !== 'SRV'">
                    Value:<br>
                    <input type="text" v-model="record.newValue" />
                </div>
                <div v-if="record.newType === 'MX' || record.newType === 'SRV'" mx srv priority>
                    Priority:<br>
                    <input type="text" v-model="record.newPriority" />
                </div>
                <div v-if="record.newType === 'MX'" mx mail-host-name>
                    Mail Host Name:<br>
                    <input type="text" v-model="record.newMailHostName" />
                </div>
                <div v-if="record.newType === 'SRV'" srv weight>
                    Weight:<br>
                    <input type="text" v-model="record.newWeight" />
                </div>
                <div v-if="record.newType === 'SRV'" srv port>
                    Port:<br>
                    <input type="text" v-model="record.newPort" />
                </div>
                <div v-if="record.newType === 'SRV'" srv server-host>
                    Server Host Name:<br>
                    <input type="text" v-model="record.newServerHost" />
                </div>
                <div>
                    Requested TTL (Optional):<br>
                    <input type="text" maxlength="5" v-model="record.newTtl" />
                </div>
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
            }
        }
    },
    methods: {
        closeEditor() {
            this.$emit('close-editor');
        },
        submitRecord() {
            this.$emit('save', { ...this.record });
        },
        isSubDomain(){
            return [(/^[\w\-]+\.[\w\-]+\.\w{2,}$/).test(this.domain),this.domain.match(/^[\w-]+/g)[0]];
        },
        validateRecord() {
            this.$refs.errorCtrl.closeErrorDisplay();
            let error_list = {};
            //check type is selected
            if(this.record.type === ''){
                error_list['type'] = 'Type is required';
            }
            //check name is entered
            if(this.record.name === ''){
                error_list['name'] = 'Name is required. If the data given to you by a customer has no value for the Name, please confirm with the customer that this is intentional. If confirmed please enter "@" as the value.';
            }
            //check value data based on type
            if(this.record.type === 'A'){
                if(!(this.regex.ipv4).test(this.record.value)){
                    error_list['value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
                }
            }
            if(this.record.type === 'AAAA'){
                if(!(this.regex.ipv6).test(this.record.value)){
                    error_list['value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
                }
            }
            if(this.record.type === 'CNAME'){
                if(!(this.regex.domain).test(this.record.value)){
                    error_list['value'] = 'CNAME record value needs to be a domain. (www.domain.com)';
                }
            }
            if(this.record.type === 'TXT'){
                if(this.record.value === ''){
                    error_list['value'] = 'TXT record value is required';
                }
            }
            if(this.record.type === 'PTR'){
                if(this.record.name === '' || !(this.regex.ipv4).test(this.record.name)){
                    error_list['name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
                }
                if(!(this.regex.domain).test(this.record.value)){
                    error_list['value'] = 'PTR needs to be a domain (www.domain.com)';
                }
            }
            if(this.record.type === 'MX'){
                if(!(/^\d+$/).test(this.record.priority)){
                    error_list['priority'] = 'MX record priority needs to be a number. (10)';
                }
                if(!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.record.mailHostName)){
                    error_list['mailHostName'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
                }
            }
            if(this.record.type === 'SRV'){
                if(!(/^\d+$/).test(this.record.priority)){
                    error_list['priority'] = 'SRV record priority needs to be a number. (10)';
                }
                if(!(/^\d+$/).test(this.record.weight)){
                    error_list['weight'] = 'SRV record weight needs to be a number. (10)';
                }
                if(!(/^\d+$/).test(this.record.port)){
                    error_list['port'] = 'SRV record port needs to be a number. (10)';
                }
                if(!(this.regex.domain).test(this.record.serverHost)){
                    error_list['serverHost'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
                }
            }
            if(this.isCorrection){
                //check new values are valid
                //check type is selected
                if(this.record.newType === ''){
                    error_list['type'] = 'Type is required';
                }
                //check name is entered
                if(this.record.newName === ''){
                    error_list['name'] = 'Name is required. If the data given to you by a customer has no value for the Name, please confirm with the customer that this is intentional. If confirmed please enter "@" as the value.';
                }
                //check value data based on type
                if(this.record.newType === 'A'){
                    if(!(/^(?:\d{1,3}\.){3}\d{1,3}$/).test(this.record.newValue)){
                        error_list['value'] = 'A record value needs to be an ipv4 address. (1.1.1.1)';
                    }
                }
                if(this.record.newType === 'AAAA'){
                    if(!(/^(?:[a-zA-z0-9]{4}\:){7}[a-zA-z0-9]{4}$/).test(this.record.newValue)){
                        error_list['value'] = 'AAAA record value needs to be an ipv6 address. (2001:0000:130F:0000:0000:09C0:876A:130B)';
                    }
                }
                if(this.record.newType === 'CNAME'){
                    if(!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.record.newValue)){
                        error_list['value'] = 'CNAME record value needs to be a domain. (www.domain.com)';
                    }
                }
                if(this.record.newType === 'TXT'){
                    if(this.record.newValue === ''){
                        error_list['value'] = 'TXT record value is required';
                    }
                }
                if(this.record.newType === 'PTR'){
                    if(this.record.newName === '' || !(/(?:\d{1,3}\.){3}\d{1,3}$/).test(this.record.newName)){
                        error_list['name'] = 'PTR Name value needs to be an ipv4 address. (1.0.0.1)';
                    }
                    if(!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.record.newValue)){
                        error_list['value'] = 'PTR needs to be a domain (www.domain.com)';
                    }
                }
                if(this.record.newType === 'MX'){
                    if(!(/^\d+$/).test(this.record.newPriority)){
                        error_list['priority'] = 'MX record priority needs to be a number. (10)';
                    }
                    if(!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.record.newMailHostName)){
                        error_list['mailHostName'] = 'MX record Mail Host needs to be a domain. (mail.domain.com)';
                    }
                }
                if(this.record.newType === 'SRV'){
                    if(!(/^\d+$/).test(this.record.newPriority)){
                        error_list['priority'] = 'SRV record priority needs to be a number. (10)';
                    }
                    if(!(/^\d+$/).test(this.record.newWeight)){
                        error_list['weight'] = 'SRV record weight needs to be a number. (10)';
                    }
                    if(!(/^\d+$/).test(this.record.newPort)){
                        error_list['port'] = 'SRV record port needs to be a number. (10)';
                    }
                    if(!(/^(?:[\w\-]+\.)+[\w\-]+\.\w{2,}\.?$/).test(this.record.newServerHost)){
                        error_list['serverHost'] = 'SRV record Server Host needs to be a domain. (www.domain.com)';
                    }
                }
            }
            if(Object.keys(error_list).length > 0){
                this.$refs.errorCtrl.updateErrorObject(error_list);
            }else{
                this.checkTtl();
                this.checkValue();
                this.submitRecord();
            }
        },
        checkTtl(){
            if(this.record.ttl === ''){
                this.record.ttl = 3600;
            }
            if(this.record?.newTtl === ''){
                this.record.newTtl = 3600;
            }
        },
        checkValue(){
            if(this.record.type === 'MX' || this.record.type === 'SRV'){
                this.record.value = this.record.priority + ' ' + this.record.mailHostName;
            }
            if(this.record.type === 'SRV'){
                this.record.value = this.record.weight + ' ' + this.record.port + ' ' + this.record.serverHost;
            }
            if(this.record?.newType === 'MX' || this.record?.newType === 'SRV'){
                this.record.newValue = this.record.newPriority + ' ' + this.record.newMailHostName;
            }
            if(this.record?.newType === 'SRV'){
                this.record.newValue = this.record.newWeight + ' ' + this.record.newPort + ' ' + this.record.newServerHost;
            }
        }
    }
}