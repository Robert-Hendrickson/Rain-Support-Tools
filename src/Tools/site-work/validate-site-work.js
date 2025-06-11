import {regexController} from '../../modules/regex-patterns/patterns.js';
export default {
    name: 'validate-site-work',
    template: `
    <div id="site" :class="{
        active: step === 2 && workType === 'site',
        complete: step > 2 && workType === 'site',
        'in-active': step < 2 || workType !== 'site'
    }">
        <h2>Site Work Content:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
        </div>
        <div id="sharepoint-app">
            <share-point-upload></share-point-upload>
        </div>
        <table id="work-table">
            <tbody v-if="workTable.length > 0">
                <tr v-for="row in workTable" :key="row.id">
                    <td>
                        <span @click="deleteRow(row.id)">X</span>
                    </td>
                    <td :class="{'errorBorder': row.issue}">
                        <div>
                            <select tabindex="-1" v-model="row.type">
                                <option disabled value="">Select an Option</option>
                                <option value="fix">Site Fix</option>
                                <option value="custom">Custom Work</option>
                            </select>
                            <div><input tabindex="-1" id="url" type="text" placeholder="Page URL" v-model="row.url" /></div>
                        </div>
                        <div>
                            <div><input tabindex="-1" id="screenshot" type="text" placeholder="screenshot" v-model="row.screenshot" /></div>
                            <div><input tabindex="-1" id="video" type="text" placeholder="video(optional)" v-model="row.video" /></div>
                        </div>
                        <textarea tabindex="-1" placeholder="details" v-model="row.details"></textarea>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="6">No rows added</td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: {
        step: {
            type: Number,
            required: true
        },
        workType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            workTable: [],
            idCounter: 0
        }
    },
    methods: {
        generateUniqueId() {
            return Symbol(++this.idCounter).description;
        },
        deleteRow(id){
            this.workTable = this.workTable.filter(row => row.id !== id);
        },
        addRow(){
            this.workTable.push({
                id: this.generateUniqueId(),
                issue: false,
                type: '',
                url: '',
                screenshot: '',
                video: '',
                details: ''
            });
        },
        removeRow(){
            this.workTable.pop();
        },
        validateData(resolve){
            let error_list = {};
            this.workTable.forEach(row => {
                let row_error_list = {};
                if(row.type === ''){
                    row_error_list['type'] = 'Make sure all rows have a type selected.';
                }
                if(row.url === ''){
                    row_error_list['url'] = 'Make sure each row has a url for the page that needs work done.';
                }
                if(row.url != '' && regexController.regexPatterns.admin_domains.test(row.url)){
                    row_error_list['url'] = 'Use domains from the customers site. Do not use admin domains. (i.e. rainadmin, jewel360, musicshop360)';
                }
                if(row.screenshot === '' || (!regexController.regexPatterns.googleDrive.test(row.screenshot) && !regexController.regexPatterns.oneDrive.test(row.screenshot))){
                    row_error_list['screenshot'] = 'Please enter a google drive or onedrive screenshot link for each row.';
                }
                if(row.video != '' && (!regexController.regexPatterns.googleDrive.test(row.video) && !regexController.regexPatterns.oneDrive.test(row.video))){
                    row_error_list['video'] = 'Make sure any videos given are a google drive or onedrive video link.';
                }
                if(row.details === ''){
                    row_error_list['details'] = 'Make sure all rows have a details entered for work needing to be done.';
                }
                if(Object.keys(row_error_list).length > 0){
                    row.issue = true;
                    for(let key in row_error_list){
                        error_list[key] ??= row_error_list[key];
                    }
                } else {
                    row.issue = false;
                }
            });
            if(Object.keys(error_list).length > 0){
                resolve({success: false, data: error_list});
            } else {
                resolve({success: true, data: this.workTable});
            }
        }
    },
    mounted(){
        this.addRow();
    }
}