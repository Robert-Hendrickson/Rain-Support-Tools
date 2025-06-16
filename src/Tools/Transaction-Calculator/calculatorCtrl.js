/**
 * @fileoverview This file contains the code for the transaction calculator tool.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
/**
 * @description This imports the idGenerator module.
 * @type {object}
 * @method generateUniqueId
 */
import idGenerator from '/Rain-Support-Tools/src/modules/random-id-generator/idGenerator.js';
import TaxEditor from './components/TaxEditor.js';
//import TransactionLineItem from './components/TransactionLineItem.js';
//import TransactionSummary from './components/TransactionSummary.js';
const transactionCalculator = createApp({
    mixins: [idGenerator],
    components: {
        TaxEditor,
        //TransactionLineItem,
        //TransactionSummary
    },
    data(){
        return {
            line_entries: {},
            shipping: 0,
            taxRates: {
                material: [{
                    id: 1,
                    rate: 0
                }],
                service: [{
                    id: 2,
                    rate: 0
                }],
                class: [{
                    id: 3,
                    rate: 0
                }]
            },
            taxShipping: false,
            editTaxes: false,
        }
    },
    methods: {
        closeEditTaxes() {
            this.editTaxes = false;
        }
    },
    computed: {
        materialTotal() {
            return this.$data.taxRates.material.reduce((total, rate) => total + rate.rate, 0).toFixed(2) + '%';
        },
        serviceTotal() {
            return this.$data.taxRates.service.reduce((total, rate) => total + rate.rate, 0).toFixed(2) + '%';
        },
        classTotal() {
            return this.$data.taxRates.class.reduce((total, rate) => total + rate.rate, 0).toFixed(2) + '%';
        }
    }
});

window.testApp = transactionCalculator.mount('#transaction-calculator');