function collectInputData() {
    return {
        rto_amount: parseFloat(document.getElementById('rto-amount').value) || 0,
        rto_term: parseFloat(document.getElementById('number-of-payments').value) || 0,
        rto_tax_rate: parseFloat(document.getElementById('tax-rate').value) || 0,
        rto_maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
        rto_protection: parseFloat(document.getElementById('protection').value) || 0,
        rto_interest: parseFloat(document.getElementById('interest').value) || 0,
        rto_rental_credit: parseFloat(document.getElementById('rental-credit').value) || 0,
        rto_down_payment: parseFloat(document.getElementById('down-payment').value) || 0
    };
}
function calculateRTOPayments() {
    let rto_inputs = collectInputData();
    // this funtion calculates the RTO Payments for the current RTO Payments form.
    console.log( rto_inputs );
}
function clearRTOPayments() {
    // This function removes all existing data from the RTO Payments table and resets values in the RTO Payments form.
    return 'Hello from clearRTOPayments';
}