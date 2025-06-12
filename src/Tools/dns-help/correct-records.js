import idGenerator from '../../modules/random-id-generator/idGenerator.js';

export default {
    name: 'correct-records',
    components: {
        'id-generator': idGenerator
    },
    props: {
        actions: {
            type: Boolean,
            required: true
        },
        correct_record: {
            type: Array,
            required: true
        }
    },
    template: `
    <div id="correct-record" v-if="actions">
        <h2>Records to Correct:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
        </div>
        <table id="correct-record-table">
            <tbody>
                <tr v-for="record in correct_record" :key="record.id">
                    <td>
                        <span class="row-delete" @click="deleteRow(record.id)">X</span>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        Original Values
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
                                    <td>
                                        TTL:<br>
                                        <div class="data-input" @click="openEditor(record)">{{ record.ttl }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        New Values
                                    </td>
                                    <td>
                                        Type:<br>
                                        <div class="data-input" @click="openEditor(record)">{{ record.newType }}</div>
                                    </td>
                                    <td>
                                        Name:<br>
                                        <div class="data-input" @click="openEditor(record)">{{ record.newName }}</div>
                                    </td>
                                    <td>
                                        Value:<br>
                                        <div class="data-input" @click="openEditor(record)">{{ record.newValue }}</div>
                                    </td>
                                    <td>
                                        TTL:<br>
                                        <div class="data-input" @click="openEditor(record)">{{ record.newTtl }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
            this.$emit('update:correct_record', this.correct_record.filter(record => record.id !== id));
        },
        removeRow(){
            const newRecords = [...this.correct_record];
            newRecords.pop();
            this.$emit('update:correct_record', newRecords);
        },
        addRow() {
            let newRecord = {
                id: this.$refs.idGenerator.generateUniqueId(),
                type: '',
                name: '',
                value: '',
                priority: '',
                mailHostName: '',
                weight: '',
                port: '',
                serverHost: '',
                ttl: '',
                newType: '',
                newName: '',
                newValue: '',
                newPriority: '',
                newMailHostName: '',
                newWeight: '',
                newPort: '',
                newServerHost: '',
                newTtl: ''
            }
            this.$emit('update:correct_record', [...this.correct_record, newRecord]);
        },
        openEditor(record) {
            this.currentRecord = { ...record };
            this.$parent.openRecordEditor(record, true, this.updateRecord);
        },
        updateRecord(updatedRecord) {
            const index = this.correct_record.findIndex(r => r.id === this.currentRecord.id);
            if (index !== -1) {
                const newRecords = [...this.correct_record];
                newRecords[index] = { ...updatedRecord, id: this.currentRecord.id };
                this.$emit('update:correct_record', newRecords);
            }
            this.$parent.closeRecordEditor();
        }
    }
}