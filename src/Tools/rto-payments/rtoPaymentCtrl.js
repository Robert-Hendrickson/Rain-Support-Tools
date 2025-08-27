/**
 * This file contains the controller for the RTO Payments tool.
 * It is used to calculate the RTO Payments for a given RTO Amount, Number of Payments, Tax Rate, Maintenance, Protection, Interest, Rental Credit, and Down Payment.
 */
import { createApp } from '/Rain-Support-Tools/src/common/vue/vue.esm-browser.prod.js';
import errorCtrl from '../../modules/error-popup/errorCtrl.js';

const rtoPaymentCtrl = createApp({
    components: {
        errorCtrl
    },
    data() {
        return {
            rto_amount: 0,
            rto_number_of_payments: 0,
            rto_tax_rate: 0,
            rto_maintenance: 0,
            rto_maintenance_tax: false,
            rto_protection: 0,
            rto_protection_tax: false,
            rto_interest: 0,
            rto_rental_credit: 0,
            rto_down_payment: 0,
            rto_payments: []
        }
    },
    computed: {
        // Computed properties with getters/setters for form inputs
        rtoAmountInput: {
            get() {
                return this.rto_amount || 0;
            },
            set(value) {
                this.rto_amount = value || 0;
            }
        },
        rtoNumberOfPaymentsInput: {
            get() {
                return this.rto_number_of_payments || 0;
            },
            set(value) {
                this.rto_number_of_payments = value || 0;
            }
        },
        rtoTaxRateInput: {
            get() {
                return this.rto_tax_rate || 0;
            },
            set(value) {
                this.rto_tax_rate = value || 0;
            }
        },
        rtoMaintenanceInput: {
            get() {
                return this.rto_maintenance || 0;
            },
            set(value) {
                this.rto_maintenance = value || 0;
            }
        },
        rtoProtectionInput: {
            get() {
                return this.rto_protection || 0;
            },
            set(value) {
                this.rto_protection = value || 0;
            }
        },
        rtoInterestInput: {
            get() {
                return this.rto_interest || 0;
            },
            set(value) {
                this.rto_interest = value || 0;
            }
        },
        rtoRentalCreditInput: {
            get() {
                return this.rto_rental_credit || 0;
            },
            set(value) {
                this.rto_rental_credit = value || 0;
            }
        },
        rtoDownPaymentInput: {
            get() {
                return this.rto_down_payment || 0;
            },
            set(value) {
                this.rto_down_payment = value || 0;
            }
        }
    },
    methods: {
        calculateRtoPayments() {
            /*
                number_of_payments = n

                interest_rate = r

                interest rate per payment = R = r/n

                total Price of contract = P

                current owed balance = P - principle payments made

                Monthly payment total pre-tax =  M = P * ((r*(1+r)^n)/((1+r)^n -1))

                Monthly Tax amount = T = M * t

                Monthly interest amount = I = current_owed_balance * r

                Monthly principle amount p =  M - I
            */
            //set object to hold data for each payment and other reused variables
            let rto_payments = [];
            let payment_number = 1;
            let remaining_balance = this.rto_amount - this.rto_down_payment - this.rto_rental_credit;

            let interest_rate = (this.rto_interest/100)/this.rto_number_of_payments;

            let monthly_payment = (remaining_balance * (interest_rate * Math.pow(1+interest_rate, this.rto_number_of_payments)) / (Math.pow(1+interest_rate, this.rto_number_of_payments) - 1)) || (remaining_balance/this.rto_number_of_payments);
            //round monthly payment to 2 decimal places
            monthly_payment = parseFloat(monthly_payment.toFixed(2));
            let tax_rate = this.rto_tax_rate/100;
            let maintenance = this.rto_maintenance;
            let protection = this.rto_protection;
            let maintenance_tax = this.rto_maintenance_tax ? Math.round((maintenance * tax_rate) * 100) / 100 : 0;
            let protection_tax = this.rto_protection_tax ? Math.round((protection * tax_rate) * 100) / 100 : 0;
            while (remaining_balance > 0) {
                //set payment number
                let temp_payment = {};
                temp_payment['payment_number'] = payment_number;
                //set payment amount pre-tax
                temp_payment['payment_amount'] = monthly_payment;
                //set interest amount
                temp_payment['interest'] = Math.round((remaining_balance * interest_rate) * 100) / 100;
                //set principal amount
                if(remaining_balance >= monthly_payment) {
                    temp_payment['principal'] = Math.round((monthly_payment - temp_payment['interest']) * 100) / 100;
                } else {
                    temp_payment['principal'] = remaining_balance;
                }
                //set tax amount
                if(remaining_balance >= monthly_payment) {
                    temp_payment['tax'] = Math.round(((temp_payment['principal'] + temp_payment['interest']) * tax_rate) * 100) / 100;
                } else {
                    temp_payment['tax'] = Math.round(((remaining_balance + temp_payment['interest']) * tax_rate) * 100) / 100;
                }
                temp_payment['tax'] += maintenance_tax;
                temp_payment['tax'] += protection_tax;
                //set maintenance amount
                temp_payment['maintenance'] = maintenance;
                //set protection amount
                temp_payment['protection'] = protection;
                //set total amount
                temp_payment['total'] = temp_payment['principal'] + temp_payment['tax'] + temp_payment['maintenance'] + temp_payment['protection'] + temp_payment['interest'];
                temp_payment['total'] = Math.round(temp_payment['total'] * 100) / 100;
                //update remaining balance
                remaining_balance = Math.round((remaining_balance - temp_payment['principal']) * 100) / 100;
                //increment payment number
                payment_number++;
                //add payment to rto_payments
                rto_payments.push(temp_payment);
            }
            this.rto_payments = rto_payments;
        },
        clearRtoPayments() {
            this.rto_amount = 0;
            this.rto_number_of_payments = 0;
            this.rto_tax_rate = 0;
            this.rto_maintenance = 0;
            this.rto_maintenance_tax = false;
            this.rto_protection = 0;
            this.rto_protection_tax = false;
            this.rto_interest = 0;
            this.rto_rental_credit = 0;
            this.rto_down_payment = 0;
            this.rto_payments = [];
        },
        round(value) {
            return Math.round(value * 100) / 100;
        }
    }
})

rtoPaymentCtrl.mount('#rto-payments');