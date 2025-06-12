import idGenerator from '../../modules/random-id-generator/idGenerator.js';

export default {
    name: 'add-records',
    components: {
        'id-generator': idGenerator
    },
    props: {
        actions: {
            type: Boolean,
            required: true
        },
        add_record: {
            type: Array,
            required: true
        }
    },
    template: `
    <div id="add-record" v-if="actions">
        <h2>Records to Add:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
        </div>
        <table id="add-record-table">
            <tbody>
                <tr v-for="(record, index) in add_record" :key="index">
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
        deleteRow(id) {
            this.add_record = this.add_record.filter(record => record.id !== id);
        },
        removeRow() {
            this.add_record.pop();
        },
        addRow() {
            this.add_record.push({
                id: this.$refs.idGenerator.generateUniqueId(),
                type: '',
                name: '',
                value: '',
                priority: '',
                mailHostName: '',
                weight: '',
                port: '',
                serverHost: '',
                ttl: ''
            });
        },
        openEditor(record) {
            this.currentRecord = { ...record };
            this.$parent.openRecordEditor(record, false, this.updateRecord);
        },
        updateRecord(updatedRecord) {
            const index = this.add_record.findIndex(r => r.id === this.currentRecord.id);
            if (index !== -1) {
                this.add_record[index] = { ...updatedRecord, id: this.currentRecord.id };
            }
            this.$parent.closeRecordEditor();
        }
    }
}