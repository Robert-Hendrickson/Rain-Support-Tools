/**
 * @fileoverview This file contains the code for the import transaction component.
 */
import { TRANSACTION_TYPES } from '../constants/const.js';
export default {
    name: 'ImportTransaction',
    data(){
        return {
            import_data: '',
        }
    },
    methods: {
        importTransaction() {
            try{
                let parsed_data = JSON.parse(this.import_data);
                this.createTransactionData(parsed_data.transaction.allPitrs);
            }catch(error){
                this.displayErrorMessage({'Import Error': 'Invalid JSON format'});
                return;
            }
        },
        createTransactionData(transaction_data) {
            let line_items = [];
            for(let i = 0; i < transaction_data.length; i++) {
                let type = this.doesLineItemMeetCriteria(transaction_data[i]);
                if(type){
                    line_items.push({
                        quantity: transaction_data[i].quantity,
                        price: transaction_data[i].price,
                        discount: parseFloat(transaction_data[i].total_discount_amount),
                        type: type,
                    });
                }
            }
            this.$emit('import-transaction-data', line_items);
            this.$emit('close-import-transaction');
            this.import_data = '';
        },
        doesLineItemMeetCriteria(line_item) {
            return TRANSACTION_TYPES.materialTypes.includes(line_item.type.toLowerCase()) ? 'material' : TRANSACTION_TYPES.serviceTypes.includes(line_item.type.toLowerCase()) ? 'service' : TRANSACTION_TYPES.classTypes.includes(line_item.type.toLowerCase()) ? 'class' : TRANSACTION_TYPES.shippingTypes.includes(line_item.type.toLowerCase()) ? 'shipping' : '';
        },
        closeImportTransaction() {
            this.$emit('close-import-transaction');
        },
        displayErrorMessage(message) {
            this.$emit('display-error-message', message);
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