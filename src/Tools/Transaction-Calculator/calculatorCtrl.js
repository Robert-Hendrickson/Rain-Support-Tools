/**
 * @fileoverview This file contains the code for the transaction calculator tool.
 */
import CreateApp from '/Rain-Support-Tools/src/common/vue/vue.global.prod.js';
/**
 * @description This imports the idGenerator module.
 * @type {object}
 * @method generateUniqueId
 */
import idGenerator from '/Rain-Support-Tools/src/modules/random-id-generator/idGenerator.js';
const transactionCalculator = CreateApp({
    mixins: [idGenerator.methods],
    data(){
        return {
            line_entries: {},
            shipping: 0,
            totals: {
                sub_total: 0,
                disc: 0,
            },
            taxRates: {
                material: {
                    '1': 0
                },
                service: {
                    '1': 0
                },
                class: {
                    '1': 0
                }
            },
            taxShipping: false,
            editTaxes: false,
        }
    }
});

transactionCalculator.mount('#transaction-calculator');