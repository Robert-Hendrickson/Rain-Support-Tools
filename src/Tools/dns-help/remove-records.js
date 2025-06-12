import idGenerator from '../../modules/random-id-generator/idGenerator.js';

export default {
    name: 'remove-records',
    components: {
        idGenerator
    },
    props: {
        actions: {
            type: Boolean,
            required: true
        },
        remove_record: {
            type: Array,
            required: true
        }
    },
    template: `
    <div id="remove-record" v-if="actions">
        <h2>Records to Remove:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary">Remove Row</button>
        </div>
        <table id="remove-record-table">
            <tbody>
                <tr v-for="record in remove_record" :key="record.id">  
                    <td>
                        <span class="row-delete" @click="deleteRow(record.id)">X</span>
                    </td>
                    <td>
                        Type:<br>
                        <div class="data-input" @click="openEditor(record)">{{ record.type }}</div>
                    </td>
                    <td>
                        Name:<br>
                        <div class="data-input" @click="openEditor(record)">{{ record.name }}</div>
                    </td>
                    <td>
                        Value:<br>
                        <div class="data-input" @click="openEditor(record)">{{ record.value }}</div>
                    </td>
                    <td style="width: 100px;">
                        TTL:<br>
                        <div class="data-input" @click="openEditor(record)">{{ record.ttl }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <id-generator ref="idGenerator"></id-generator>
    </div>`,
    data() {
        return {
            currentRecord: null
        }
    },
    methods: {
        addRow() {
            this.remove_record.push({
                id: this.$refs.idGenerator.generateUniqueId(),
                type: '',
                name: '',
                value: '',
                ttl: ''
            });
        },
        deleteRow(id) {
            this.remove_record = this.remove_record.filter(record => record.id !== id);
        },
        openEditor(record) {
            this.currentRecord = { ...record };
            globalRecordEditor.openEditor(this.currentRecord, false, this.domain, this.updateRecord);
        },
        updateRecord(updatedRecord) {
            const index = this.remove_record.findIndex(r => r.id === this.currentRecord.id);
            if (index !== -1) {
                this.remove_record[index] = { ...updatedRecord, id: this.currentRecord.id };
            }
            this.currentRecord = null;
        }
    }
}