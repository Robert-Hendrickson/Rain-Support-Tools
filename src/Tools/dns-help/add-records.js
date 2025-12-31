import idGenerator from '../../modules/random-id-generator/idGenerator.js';

export default {
    name: 'add-records',
    components: {
        'id-generator': idGenerator
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
    <div id="add-record" v-if="showAddRecords">
        <h2>Records to Add:</h2>
        <div table-controls>
            <button tabindex="-1" class="btn secondary" @click="addRow">Add Row</button>
            <button tabindex="-1" class="btn secondary" @click="removeRow">Remove Row</button>
        </div>
        <table id="add-record-table">
            <tbody>
                <tr v-for="(record, index) in records" :key="index">
                    <td>
                        <span class="row-delete" @click="deleteRow(record.id)">X</span>
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
                    <td style="width: 100px;">
                        TTL:<br>
                        <div class="data-input" @click="openEditor(record.id)">{{ record.ttl }}</div>
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
    computed: {
        showAddRecords() {
            return this.actions.includes('Add Record(s)');
        }
    },
    methods: {
        deleteRow(id) {
            this.$emit('deleteRecord', id);
        },
        removeRow() {
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
                ttl: ''
            }
            this.$emit('addNewRecord', newRecord);
        },
        openEditor(id) {
            this.$emit('editRecord', id);
        },
    }
}
