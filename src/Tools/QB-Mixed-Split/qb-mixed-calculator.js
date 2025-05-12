/**
 * @fileoverview QB Mixed Split Calculator
 * @description This file contains the logic for the QB Mixed Split Calculator
 * @author Robert Hendrickson
 * @version 1.0.0
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
const qb_mixed_split = createApp({
    data(){
        return {
            payment_options: {
                'Cash':{
                    value: 'cash',
                    checked: true,
                    amount: 0
                },
                'Credit':{
                    value: 'credit',
                    checked: true,
                    amount: 0
                },
                'Debit':{
                    value: 'debit',
                    checked: true,
                    amount: 0
                },
                'Gift Card':{
                    value: 'gift_card',
                    checked: false,
                    amount: 0
                },
                'Account':{
                    value: 'account',
                    checked: false,
                    amount: 0
                }
            },
            totals: {
                total: 0,
                principle: 0,
                tax: 0
            },
            new_column: false,
            show_video: false
        }
    },
    methods:{
        updateColumn(option){
            this.payment_options[option].checked = !this.payment_options[option].checked;
        },
        addNewColumn(){
            const newName = document.querySelector('#new-name').value.trim();
            if(this.payment_options[newName]){
                alert('column already exists');
            }else{
                this.payment_options[newName] = {
                    value: newName.toLowerCase().replace(' ','_'),
                    checked: true,
                    amount: 0
                };
                this.new_column = false;
            }
        },
        resetColumns(){
            this.payment_options = {
                'Cash':{
                    value: 'cash',
                    checked: true,
                    amount: 0
                },
                'Credit':{
                    value: 'credit',
                    checked: true,
                    amount: 0
                },
                'Debit':{
                    value: 'debit',
                    checked: true,
                    amount: 0
                },
                'Gift Card':{
                    value: 'gift_card',
                    checked: false,
                    amount: 0
                },
                'Account':{
                    value: 'account',
                    checked: false,
                    amount: 0
                }
            }
        },
        get_totals(){
            console.log(this.totals.total === this.totals.principle + this.totals.tax);
            console.log(this.totals);
            console.log(this.totals.principle + this.totals.tax);
        }
    },
    computed:{
        is_totals_correct(){
            return (this.totals.total === this.totals.principle + this.totals.tax) ? 'True' : 'False';
        },
        paymentCalculations() {
            const calculations = {};
            for (const [key, option] of Object.entries(this.payment_options)) {
                if (option.checked && this.totals.total > 0) {
                    const percentage = option.amount / this.totals.total;
                    calculations[key] = {
                        principle: Number((this.totals.principle * percentage).toFixed(2)),
                        tax: Number((this.totals.tax * percentage).toFixed(2)),
                        isCorrect: Number((this.totals.principle * percentage + this.totals.tax * percentage).toFixed(2)) === option.amount
                    };
                }
            }
            return calculations;
        }
    }
});
qb_mixed_split.mount('#qb-mixed-split');