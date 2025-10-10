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
import ImportTransaction from './components/importTransaction.js';
const transactionCalculator = createApp({
    mixins: [idGenerator],
    components: {
        TaxEditor,
        ImportTransaction,
    },
    data(){
        return {
            line_entries: [],
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
            showImport: false,
        }
    },
    methods: {
        round(value) {
            return Math.round(value * 100) / 100;
        },
        calcExt(line) {
            line.ext = this.round(line.quantity * line.price)
            return line.ext;
        },
        calcTax(line) {
            if(line.taxJurisdiction === '') {
                line.tax = 0;
                return line.tax;
            }
            let taxRates = this.taxRates[line.taxJurisdiction];
            let tax = 0;
            for(let i = 0; i < taxRates.length; i++) {
                tax += this.round((line.ext - line.discount) * taxRates[i].rate / 100)
            }
            line.tax = tax;
            return line.tax;
        },
        calcTotal(line) {
            line.total = this.round(line.ext - line.discount + line.tax)
            return line.total;
        },
        closeEditTaxes() {
            this.editTaxes = false;
        },
        addLineItem() {
            this.line_entries.push({
                id: this.generateUniqueId(),
                quantity: 0,
                price: 0,
                discount: 0,
                ext: 0,
                tax: 0,
                total: 0,
                taxJurisdiction: 'material',
                percentDiscount: 0
            });
        },
        removeLineItem(id) {
            this.line_entries = this.line_entries.filter(item => item.id !== id);
        },
        importTransactionData(data) {
            console.log(data);
        },
        toggleImportDialog() {
            this.showImport = !this.showImport;
        }
    },
    computed: {
        materialTotal() {
            return this.$data.taxRates.material.reduce((total, rate) => total + rate.rate, 0).toFixed(3) + '%';
        },
        serviceTotal() {
            return this.$data.taxRates.service.reduce((total, rate) => total + rate.rate, 0).toFixed(3) + '%';
        },
        classTotal() {
            return this.$data.taxRates.class.reduce((total, rate) => total + rate.rate, 0).toFixed(3) + '%';
        },
        totalMaterialTax() {
            return this.line_entries.reduce((total, line) => line.taxJurisdiction === 'material' ? total + line.tax : total, 0)
        },
        totalServiceTax() {
            return this.line_entries.reduce((total, line) => line.taxJurisdiction === 'service' ? total + line.tax : total, 0)
        },
        totalClassTax() {
            return this.line_entries.reduce((total, line) => line.taxJurisdiction === 'class' ? total + line.tax : total, 0)
        },
        subTotal() {
            return this.round(this.line_entries.reduce((total, line) => total + line.ext, 0))
        },
        discountTotal() {
            return this.line_entries.reduce((total, line) => total + line.discount, 0)
        },
        taxTotal() {
            return this.round(this.line_entries.reduce((total, line) => total + line.tax, 0) + this.shippingTax)
        },
        total() {
            return this.round(this.subTotal - this.discountTotal + this.taxTotal + this.shipping)
        },
        shippingTax() {
            let tax = 0;
            for(let i = 0; i < this.taxRates.material.length; i++) {
                tax += this.shipping * (this.taxRates.material[i].rate / 100)
            }
            return this.taxShipping ? this.round(tax) : 0;
        }
    },
    mounted() {
        this.addLineItem();
        
        // Setup keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            // Check for CTRL + I
            if (event.ctrlKey && event.key === 'i') {
                event.preventDefault(); // Prevent browser's default behavior
                this.toggleImportDialog();
            }
        });
    }
});

window.testApp = transactionCalculator.mount('#transaction-calculator');