import { regexController } from '../../modules/regex-patterns/patterns.js';
import { dropdownSelectComponent } from '../../components/dropdown-select/dropdown-select-component.js'
import { textInputComponent } from '../../components/text-input/text-input-component.js';
import { textareaComponent } from '../../components/textarea/textarea-component.js'
export default {
    name: 'validate-site-work',
    components: {
        dropdownSelectComponent,
        textInputComponent,
        textareaComponent,
    },
    template: `
    <div id="site" :class="{
        active: step === 2 && workType === 'Site Work',
        complete: step > 2 && workType === 'Site Work',
        'in-active': step < 2 || workType !== 'Site Work'
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
                            <dropdown-select-component
                                :options="siteWorkOptions"
                                :value="row.type"
                                :tabindex="tabIndex"
                                emptyOption="Select an Option"
                                @updateValue="updateSiteWorkOption($event, row.id)"
                            />
                            <text-input-component
                                placeholder="Page URL"
                                :value="row.url"
                                :tabindex="tabIndex"
                                @updateValue="updateSiteWorkUrl($event, row.id)"
                            />
                        </div>
                        <div>
                            <text-input-component
                                placeholder="screenshot"
                                :value="row.screenshot"
                                :tabindex="tabIndex"
                                @updateValue="updateSiteWorkScreenshot($event, row.id)"
                            />
                            <text-input-component
                                placeholder="Video(optional)"
                                :value="row.video"
                                :tabindex="tabIndex"
                                @updateValue="updateSiteWorkVideo($event, row.id)"
                            />
                        </div>
                        <textarea-component
                            placeholder="Details"
                            :value="row.details"
                            :tabindex="tabIndex"
                            resize="none"
                            @updateValue="updateSiteWorkDetails($event, row.id)"
                        />
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
            idCounter: 0,
            siteWorkOptions: ['Site Fix' , 'Custom Work'],
        }
    },
    computed: {
        tabIndex() {
            return (this.$props.step === 2 && this.$props.workType === "Site Work") ? 0 : -1;
        },
    },
    mounted(){
        this.addRow();
        if (location.host == 'localhost' || location.search == '?test') {
            this.workTable[0].screenshot = 'https://quiltsoftware-my.sharepoint.com/:i:/p/user/hash'
            this.workTable[0].type = "Site Fix";
            this.workTable[0].url = "test.com";
            this.workTable[0].details = "Test Details";
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
                    row_error_list['screenshot'] = 'Please enter a Google Drive or OneDrive screenshot link for each row.';
                }
                if(row.video != '' && (!regexController.regexPatterns.googleDrive.test(row.video) && !regexController.regexPatterns.oneDrive.test(row.video))){
                    row_error_list['video'] = 'Make sure any videos given are a Google Drive or OneDrive video link.';
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
        },
        handleUpdateError(error) {
            console.error('Failed to update row')
            console.error(error);
        },
        updateSiteWorkOption(value, id) {
            try {
                let rowData = this.workTable.filter( row => row.id === id);
                rowData[0].type = value;
            } catch (error) {
                this.handleUpdateError(error);
            }
        },
        updateSiteWorkUrl(value, id) {
            try {
                let rowData = this.workTable.filter( row => row.id === id);
                rowData[0].url = value;
            } catch (error) {
                this.handleUpdateError(error);
            }
        },
        updateSiteWorkScreenshot(value, id) {
            try {
                let rowData = this.workTable.filter( row => row.id === id);
                rowData[0].screenshot = value;
            } catch (error) {
                this.handleUpdateError(error);
            }
        },
        updateSiteWorkVideo(value, id) {
            try {
                let rowData = this.workTable.filter( row => row.id === id);
                rowData[0].video = value;
            } catch (error) {
                this.handleUpdateError(error);
            }
        },

        updateSiteWorkDetails(value, id) {
            try {
                let rowData = this.workTable.filter( row => row.id === id);
                rowData[0].details = value;
            } catch (error) {
                this.handleUpdateError(error);
            }
        },
    },
}
