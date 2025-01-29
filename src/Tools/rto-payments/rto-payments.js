function collectInputData() {
    // This function collects the input data from the RTO Payments form and returns it as an object.
    return {
        rto_amount: parseFloat(document.getElementById('rto-amount').value) || 0,
        rto_number_of_payments: parseFloat(document.getElementById('number-of-payments').value) || 0,
        rto_tax_rate: parseFloat(document.getElementById('tax-rate').value)/100 || 0,
        rto_maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
        rto_protection: parseFloat(document.getElementById('protection').value) || 0,
        rto_interest: parseFloat(document.getElementById('interest').value)/100 || 0,
        rto_rental_credit: parseFloat(document.getElementById('rental-credit').value) || 0,
        rto_down_payment: parseFloat(document.getElementById('down-payment').value) || 0
    };
}
function checkRtoInputs() {
    // This function checks the inputs for the RTO Payments form and displays an error message if any of the inputs are invalid
    let rto_inputs = collectInputData();
    let errors = {};
    if(rto_inputs.rto_amount <= 0) {
        errors.rto_amount = {
            html: '<li>Please enter a valid RTO Amount.</li>'
        };
    }
    if(rto_inputs.rto_number_of_payments <= 0) {
        errors.rto_number_of_payments = {
            html: '<li>Please enter a valid Number of Payments.</li>'
        };
    }
    if(rto_inputs.rto_tax_rate < 0) {
        errors.rto_tax_rate = {
            html: '<li>Please enter a valid Tax Rate.</li>'
        };
    }
    if(rto_inputs.rto_maintenance < 0) {
        errors.rto_maintenance = {
            html: '<li>Please enter a valid Maintenance Fee.</li>'
        };
    }
    if(rto_inputs.rto_protection < 0) {
        errors.rto_protection = {
            html: '<li>Please enter a valid Protection Fee.</li>'
        };
    }
    if(rto_inputs.rto_interest < 0) {
        errors.rto_interest = {
            html: '<li>Please enter a valid Interest Rate.</li>'
        };
    }
    if(rto_inputs.rto_rental_credit < 0) {
        errors.rto_rental_credit = {
            html: '<li>Please enter a valid Rental Credit.</li>'
        };
    }
    if(rto_inputs.rto_down_payment < 0) {
        errors.rto_down_payment = {
            html: '<li>Please enter a valid Down Payment.</li>'
        };
    }
    if(Object.keys(errors).length > 0) {
        popup_error_growl({
            type: 'generate',
            list: errors
        });
    } else {
        calculateRTOPayments(rto_inputs);
    }
}
function updateRTOPayments(payment_data) {
    //take data from calculateRTOPayments and update the RTO Payments table
    clearRTOPayments();
    let rto_table = document.getElementById('rto-payments');
    for(payment in payment_data) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td id="payment-${payment_data[payment].payment_number}">${payment_data[payment].payment_number}</td>
            <td id="principal-${payment_data[payment].payment_number}">$${payment_data[payment].principal}</td>
            <td id="interest-${payment_data[payment].payment_number}">$${payment_data[payment].interest}</td>
            <td id="maintenance-${payment_data[payment].payment_number}">$${payment_data[payment].maintenance}</td>
            <td id="protection-${payment_data[payment].payment_number}">$${payment_data[payment].protection}</td>
            <td id="tax-${payment_data[payment].payment_number}">$${payment_data[payment].tax}</td>
            <td id="total-${payment_data[payment].payment_number}">$${payment_data[payment].total}</td>
        `;
        rto_table.appendChild(row);
    }
}
function clearRTOPayments() {
    // This function removes all existing data from the RTO Payments table and resets values in the RTO Payments form.
    document.querySelectorAll('#rto-payments tr').forEach( row => row.remove() );
}
function calculateRTOPayments(rto_inputs) {
    // this funtion calculates the RTO Payments for the current RTO Payments form.
    console.log( rto_inputs );
    /*
        number_of_payments = n

        ineterest_rate = r

        interest rate per payment = R = r/n

        total Price of contract = P

        current owed balance = P - principle payments made

        Monthly payment total pre-tax =  M = P * ((r*(1+r)^n)/((1+r)^n -1))

        Monthyly Tax amount = T = M * t

        Monthly interest amount = I = current_owed_balance * r

        monthly principle amount p =  M - I
    */
    //set object to hold data for each payment and other reused variables
    let rto_payments = {};
    let payment_number = 1;
    let remaining_balance = rto_inputs.rto_amount - rto_inputs.rto_down_payment - rto_inputs.rto_rental_credit;

    let interest_rate = (rto_inputs.rto_interest)/rto_inputs.rto_number_of_payments;

    let monthly_payment = (remaining_balance * (interest_rate * Math.pow(1+interest_rate, rto_inputs.rto_number_of_payments)) / (Math.pow(1+interest_rate, rto_inputs.rto_number_of_payments) - 1)) || (remaining_balance/rto_inputs.rto_number_of_payments);
    //round monthly payment to 2 decimal places
    monthly_payment = parseFloat(monthly_payment.toFixed(2));
    let tax_rate = rto_inputs.rto_tax_rate;
    let maintenance = rto_inputs.rto_maintenance;
    let protection = rto_inputs.rto_protection;
    let maintenance_tax = document.getElementById('maintenance-tax').checked ? Math.round((maintenance * tax_rate) * 100) / 100 : 0;
    let protection_tax = document.getElementById('protection-tax').checked ? Math.round((protection * tax_rate) * 100) / 100 : 0;
    while (remaining_balance > 0) {
        //set payment number
        rto_payments[`payment_${payment_number}`] = {};
        rto_payments[`payment_${payment_number}`]['payment_number'] = payment_number;
        //set payment amount pre-tax
        rto_payments[`payment_${payment_number}`]['payment_amount'] = monthly_payment;
        //set interest amount
        rto_payments[`payment_${payment_number}`]['interest'] = Math.round((remaining_balance * interest_rate) * 100) / 100;
        //set principal amount
        if(remaining_balance >= monthly_payment) {
            rto_payments[`payment_${payment_number}`]['principal'] = Math.round((monthly_payment - rto_payments[`payment_${payment_number}`]['interest']) * 100) / 100;
        } else {
            rto_payments[`payment_${payment_number}`]['principal'] = remaining_balance;
        }
        //set tax amount
        if(remaining_balance >= monthly_payment) {
            rto_payments[`payment_${payment_number}`]['tax'] = Math.round(((rto_payments[`payment_${payment_number}`]['principal'] + rto_payments[`payment_${payment_number}`]['interest']) * tax_rate) * 100) / 100;
        } else {
            rto_payments[`payment_${payment_number}`]['tax'] = Math.round(((remaining_balance + rto_payments[`payment_${payment_number}`]['interest']) * tax_rate) * 100) / 100;
        }
        rto_payments[`payment_${payment_number}`]['tax'] += maintenance_tax;
        rto_payments[`payment_${payment_number}`]['tax'] += protection_tax;
        //set maintenance amount
        rto_payments[`payment_${payment_number}`]['maintenance'] = maintenance;
        //set protection amount
        rto_payments[`payment_${payment_number}`]['protection'] = protection;
        //set total amount
        rto_payments[`payment_${payment_number}`]['total'] = rto_payments[`payment_${payment_number}`]['principal'] + rto_payments[`payment_${payment_number}`]['tax'] + rto_payments[`payment_${payment_number}`]['maintenance'] + rto_payments[`payment_${payment_number}`]['protection'] + rto_payments[`payment_${payment_number}`]['interest'];
        rto_payments[`payment_${payment_number}`]['total'] = Math.round(rto_payments[`payment_${payment_number}`]['total'] * 100) / 100;
        //update remaining balance
        remaining_balance = Math.round((remaining_balance - rto_payments[`payment_${payment_number}`]['principal']) * 100) / 100;
        //increment payment number
        payment_number++;
    }
    console.log(rto_payments);
    updateRTOPayments(rto_payments);
}