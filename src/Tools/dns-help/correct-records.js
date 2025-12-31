import idGenerator from '../../modules/random-id-generator/idGenerator.js';
import { textInputComponent } from '../../components/text-input/text-input-component.js';

export default {
    name: 'correct-records',
    components: {
        'id-generator': idGenerator,
        textInputComponent,
    },
    props: {
        actions: {
            type: Array,
            required: true
        },
        records: {
            type: Array,
            required: true
        }
    },
    template: `
    <div id="correct-record" v-if="showCorrectRecords">
        <h2>Records to Correct:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
        </div>
        <table id="correct-record-table">
            <tbody>
                <tr v-for="record in records" :key="record.id">
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
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.type }}</div>
                                    </td>
                                    <td>
                                        Name:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.name }}</div>
                                    </td>
                                    <td>
                                        Value:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.value }}</div>
                                    </td>
                                    <td>
                                        TTL:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.ttl }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        New Values
                                    </td>
                                    <td>
                                        Type:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.newType }}</div>
                                    </td>
                                    <td>
                                        Name:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.newName }}</div>
                                    </td>
                                    <td>
                                        Value:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.newValue }}</div>
                                    </td>
                                    <td>
                                        TTL:<br>
                                        <div class="data-input" @click="openEditor(record.id)">{{ record.newTtl }}</div>
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
    computed: {
        showCorrectRecords() {
            return this.actions.includes('Correct Existing Record(s)');
        }
    },
    methods: {
        deleteRow(id) {
            this.$emit('deleteRecord', id);
        },
        removeRow(){
            this.$emit('removeRow');
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
            this.$emit('addNewRecord', newRecord);
        },
        openEditor(id) {
            this.$emit('editRecord', id);
        },
    }
}
