/**
 * @fileoverview This file contains the code for the import transaction component.
 */
export default {
    name: 'ImportTransaction',
    data(){
        return {
            import_data: ''
        }
    },
    template: `
    <div class="import-transaction-container">
        <div class="import-transaction-wrapper">
            <div class="import-transaction-header">
                <h1>Import Transaction</h1>
            </div>
            <div class="import-transaction-content">
                <textarea id="import-transaction-textarea" v-model="import_data"></textarea>
                <div class="import-transaction-content-footer">
                    <button class="btn primary" @click="importTransaction">Import</button>
                    <button class="btn secondary" @click="closeImportTransaction">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
}