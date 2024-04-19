function enableComplexTax() {
    if(window.confirm('This will change the way taxes are calculated until the page is refreshed. Are you sure you want to continue?')){
        complex_tax_test = true;
        $('.tax-rate-container').removeClass('hide');
        $('#tax-rates tbody tr:nth-child(2) input').attr('disabled', 'true');
        $('#tax-rates thead input').attr('onclick', `$('.tax-rate-container').removeClass('hide')`);
    }
}
