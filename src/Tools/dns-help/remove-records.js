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
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
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
            let newRecord = {
                id: this.$refs.idGenerator.generateUniqueId(),
                type: '',
                name: '',
                value: '',
                ttl: ''
            }
            this.$emit('update:remove_record', [...this.remove_record, newRecord]);
        },
        deleteRow(id) {
            this.$emit('update:remove_record', this.remove_record.filter(record => record.id !== id));
        },
        removeRow(){
            const newRecords = [...this.remove_record];
            newRecords.pop();
            this.$emit('update:remove_record', newRecords);
        },
        openEditor(record) {
            this.currentRecord = { ...record };
            this.$parent.openRecordEditor(record, false, this.updateRecord);
        },
        updateRecord(updatedRecord) {
            const index = this.remove_record.findIndex(r => r.id === this.currentRecord.id);
            if (index !== -1) {
                const newRecords = [...this.remove_record];
                newRecords[index] = { ...updatedRecord, id: this.currentRecord.id };
                this.$emit('update:remove_record', newRecords);
            }
            this.$parent.closeRecordEditor();
        }
    }
}