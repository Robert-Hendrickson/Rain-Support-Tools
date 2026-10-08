import { parseHistory } from './historyParser.js';

export default {
    name: 'ImportHistory',
    data(){
        return {
            import_data: '',
        }
    },
    mounted(){
        this.$refs.importTextarea.focus();
    },
    methods: {
        importHistory(){
            const result = parseHistory(this.import_data);
            if(result.errors.length){
                this.$emit('display-error-message', result.errors);
                return;
            }
            this.$emit('import-history-data', result.changes);
            this.$emit('close-import-history');
        },
        closeImportHistory(){
            this.$emit('close-import-history');
        },
    },
    template: `
    <div class="import-history-container">
        <div class="import-history-wrapper">
            <div class="import-history-header">
                <h3>Import History</h3>
            </div>
            <p class="input-hint">
                Paste the inventory history copied from Rain. The top row is treated as the most recent change and the bottom row as the first. Importing replaces any history already entered.
            </p>
            <div class="import-history-content">
                <textarea id="import-history-textarea" ref="importTextarea" v-model="import_data" @keyup.escape="closeImportHistory"></textarea>
                <div class="import-history-footer">
                    <button class="btn primary" @click="importHistory">Import</button>
                    <button class="btn secondary" @click="closeImportHistory">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
}
