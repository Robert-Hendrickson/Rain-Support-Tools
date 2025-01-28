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
    let rto_table = document.querySelector('.rto-table tbody');
    for(payment in payment_data) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment_data[payment].payment_number}</td>
            <td>$${payment_data[payment].principal}</td>
            <td>$${payment_data[payment].interest}</td>
            <td>$${payment_data[payment].maintenance}</td>
            <td>$${payment_data[payment].protection}</td>
            <td>$${payment_data[payment].tax}</td>
            <td>$${payment_data[payment].payment_amount}</td>
        `;
        rto_table.appendChild(row);
    }
}
function clearRTOPayments() {
    // This function removes all existing data from the RTO Payments table and resets values in the RTO Payments form.
    document.querySelectorAll('.rto-table tbody tr').forEach( row => row.remove() );
}
function calculateRTOPayments(rto_inputs) {
    // this funtion calculates the RTO Payments for the current RTO Payments form.
    console.log( rto_inputs );
    let test_data = {
        rto_amount: 1000,
        rto_number_of_payments: 12,
        rto_tax_rate: 0.07,
        rto_maintenance: 5,
        rto_protection: 10,
        rto_interest: 0.1,
        rto_rental_credit: 0,
        rto_down_payment: 0
    };
    let rto_payments = {};
    for(i=1; i<=test_data.rto_number_of_payments; i++) {
        rto_payments[`payment_${i}`] = {
            payment_number: i,
            payment_amount: 132,
            principal: 100,
            tax: 7,
            maintenance: 5,
            protection: 10,
            interest: 10,
        };
    }
    updateRTOPayments(rto_payments);
}