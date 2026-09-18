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
import errorCtrl from '/Rain-Support-Tools/src/modules/error-popup/errorCtrl.js';
const transactionCalculator = createApp({
    mixins: [idGenerator],
    components: {
        TaxEditor,
        ImportTransaction,
        errorCtrl,
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
            /**
             * @description Master toggle for the surcharge feature. When off no
             * surcharge is calculated regardless of the other surcharge flags.
             */
            surcharging: false,
            /**
             * @description When true the transaction tax is included in the
             * amount the surcharge is calculated against.
             */
            surchargeTax: false,
            /**
             * @description When true the surcharge amount is taxed using the
             * material tax rates and reported as its own tax line.
             */
            taxSurcharge: false,
            surchargeRate: 3,
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
        addLineItem(line_data = {}) {
            this.line_entries.push({
                id: this.generateUniqueId(),
                quantity: line_data.quantity || 0,
                price: line_data.price || 0,
                discount: line_data.discount || 0,
                ext: 0,
                tax: 0,
                total: 0,
                taxJurisdiction: line_data.type || 'material',
                percentDiscount: 0
            });
        },
        removeLineItem(id) {
            this.line_entries = this.line_entries.filter(item => item.id !== id);
        },
        importTransactionData(data) {
            this.line_entries = [];
            this.shipping = 0;
            for(let i = 0; i < data.length; i++) {
                if (data[i].type === 'shipping') {
                    this.shipping = data[i].price;
                } else {
                    this.addLineItem(data[i]);
                }
            }
        },
        toggleImportDialog() {
            this.showImport = !this.showImport;
        },
        displayErrorMessage(message) {
            this.$refs.errorCtrl.updateErrorObject(message);
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
        /**
         * @description Tax on the line items and shipping only. This is the tax
         * the surcharge can be calculated against, so it deliberately excludes
         * the tax charged on the surcharge itself.
         */
        lineTaxTotal() {
            return this.round(this.line_entries.reduce((total, line) => total + line.tax, 0) + this.shippingTax)
        },
        taxTotal() {
            return this.round(this.lineTaxTotal + this.totalSurchargeTax)
        },
        total() {
            return this.round(this.subTotal - this.discountTotal + this.taxTotal + this.shipping + this.surchargeTotal)
        },
        shippingTax() {
            let tax = 0;
            for(let i = 0; i < this.taxRates.material.length; i++) {
                tax += this.shipping * (this.taxRates.material[i].rate / 100)
            }
            return this.taxShipping ? this.round(tax) : 0;
        },
        /**
         * @description The amount the surcharge rate is applied to. Defaults to
         * the discounted subtotal and adds the line/shipping tax when the
         * surchargeTax flag is enabled.
         */
        surchargeBase() {
            if(!this.surcharging) {
                return 0;
            }
            let base = this.subTotal - this.discountTotal;
            if(this.surchargeTax) {
                base += this.lineTaxTotal;
            }
            return this.round(base);
        },
        surchargeTotal() {
            if(!this.surcharging) {
                return 0;
            }
            return this.round(this.surchargeBase * (this.surchargeRate / 100));
        },
        /**
         * @description Tax charged on the surcharge amount using the material
         * tax rates. Shown as its own line and rolled into the total tax.
         */
        totalSurchargeTax() {
            if(!this.showSurchargeTax) {
                return 0;
            }
            let tax = 0;
            for(let i = 0; i < this.taxRates.material.length; i++) {
                tax += this.surchargeTotal * (this.taxRates.material[i].rate / 100)
            }
            return this.round(tax);
        },
        showSurchargeTax() {
            return this.surcharging && this.taxSurcharge;
        },
        surchargeRateDisplay() {
            return Number(this.surchargeRate).toFixed(3) + '%';
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