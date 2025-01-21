//global variable for compiling import data
let _import = '';
//variable for tracking table information
const tableObject = {
    rows: 0,//number of rows
    data: {},//object for holding table data
    _addRows: (array) =>{//object method(function) that updates the data value with new values for passed in array built from imported data
        for(i=0;i<array.length;i++){
            let row = array[i].split('\n');
            tableObject.rows++;
            tableObject.data[`row_${tableObject.rows}`] = {
                dateNum: row[0],
                transaction: row[1],
                atTill: row[2],
                status: row[3],
                dateText: row[4],
                collected: row[5],
                fee: row[6],
                return: row[7],
                totalPayout: row[8],
                row: tableObject.rows
            };
        };
    },
};

/*controls if amex rate boxes are visible or hidden.*/
function amexDisplayToggle(){
    let checked = $('input#amexCheck')[0].checked;
    if(checked){
        $('.amex').addClass('show');
    };
    if(!checked){
        $('.amex').removeClass('show');
    };
};

/*hides or displays import popup*/
function importToggle(action){
    if(action === 'open'){
        $('.popup1').removeClass('hide');
    };
    if(action === 'close'){
        $('.popup1').addClass('hide');
    };
};

/*closes the wait box and removes any existing error message text*/
function closeDialogue(){
    $('.popup2').addClass('hide');
    $('.errorMessage')[0].innerHTML = '';
    $('#closeDialogue').addClass('hide');
};
/*check to see if provided data meets criteria to be used. 
Criteria: 
1. The total number of lines devided by 9 is a whole number (each line should have 9 pieces of data) 
2. The number of sets of data found with the regex expression matches the number found from criteria 1(this confirms that all rows belong to an inteded data set and there isn't missing or extra lines that happens to match the 1 criteria math)*/
function checkNumberOfLines(){
    //display wait popup (this could take a second to go through all the data)
    $('.popup2').removeClass('hide');
    //get imported string
    _import = $('.import textarea')[0].value;
    //save value of each the number of lines divided by 9(should equal a whole number)
    let number_of_transactions = _import.split('\n').length/9;
    if((/\./).test(number_of_transactions)){//if there is a decimal in the saved number then something is missing, generate an error response
        messageUpdate("The number of lines given doesn't match the number of expected lines for full data. Please make sure the copied data is the full set of data from rows selected and try again.")
        $('#closeDialogue').removeClass('hide');
        return false;
    };
    //find all sets of data as an array
    let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
    //check that total found data sets equals the number of expected lines
    if(number_of_transactions != split_data.length){
        //if not generate an error response
        messageUpdate("The number of found rows doesn't match the number of estimated rows. This means there may be lines that are duplicated or missing. Please make sure the copied data is the full set of data from rows selected and try again.")
        $('#closeDialogue').removeClass('hide');
        return false;
    }
    $('#closeDialogue').removeClass('hide');
    //if all passes, return a true response to start generating the table
    return true;
};
/*this updates the error message box for if there was an issue with the data and why it failed*/
function messageUpdate(message){
    $('.errorMessage')[0].append($.parseHTML(`<p>${message}</p>`)[0]);
};

/*takes import data and uses object method to add data to a loopable object*/
function buildObject(){
    //if data passes function check, add data to global object then build table based on object data
    if(checkNumberOfLines()){
        let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
        tableObject._addRows(split_data);
        buildTable();
    };
};

/*uses tableObject to create table data*/
function buildTable(){
    //erases existing table data(to keep from duplicating)
    $('#transactions tbody')[0].innerHTML = '';
    //build table from tableObject.data value
    for(const row in tableObject.data){
        let tr = $.parseHTML(`<tr id="${tableObject.data[row].row}"><td>${tableObject.data[row].dateNum}</td><td>${tableObject.data[row].transaction}</td><td>${tableObject.data[row].atTill}</td><td>${tableObject.data[row].status}</td><td>${tableObject.data[row].dateText}</td><td>${tableObject.data[row].collected}</td><td>${tableObject.data[row].fee}</td><td>${tableObject.data[row].return}</td><td>${tableObject.data[row].totalPayout}</td><td></td><td></td>`)[0];
        $('#transactions tbody')[0].append(tr);
    };
    closeDialogue();
    importToggle('close');
};

/*takes a string from rates boxes and converts it to a usable decimal for calculation*/
function precentToDecimal(value){
    value = '0.0' + value.replace('.','');
    value = parseFloat(value);
    return value;
};

/*loops through table and adds info to last two cells of each row*/
function calculateDifference(){
    let rates = {};
    //collect and store card rates and fees
    rates['amexp'] = [precentToDecimal($('#amexcardPresentRate')[0].value),parseFloat($('#amexcardPresentAmount')[0].value)];
    rates['amexnp'] = [precentToDecimal($('#amexcardNotPresentRate')[0].value),parseFloat($('#amexcardNotPresentAmount')[0].value)];
    rates['cardp'] = [precentToDecimal($('#cardPresentRate')[0].value),parseFloat($('#cardPresentAmount')[0].value)];
    rates['cardnp'] = [precentToDecimal($('#cardNotPresentRate')[0].value),parseFloat($('#cardNotPresentAmount')[0].value)];
    console.log(rates);
    let table_data = $('#transactions tbody tr');
    for(i=0;i<table_data.length;i++){
        temp_row = table_data[i];
        if(temp_row.querySelector('td:nth-child(3)').innerText === 'Card Not Present' && temp_row.querySelector('td:nth-child(6)').innerText !='$0.00'){
            temp_rates = rates.cardp;
            let temp_collected = temp_row.querySelector('td:nth-child(6)').innerText.replace('$','');
            if($('#amexCheck')[0].checked){
                //needs to check if rate used on row matches non-amex rates if it does do nothing. if it doesn't then we need to update temp_rates to use amex present rates instead.
                let check_rate = rates.cardnp;
                let check_fee = parseFloat(temp_collected);
                check_fee *= check_rate[0];
                check_fee += check_rate[1];
                if(check_fee.toFixed(2) != temp_row.querySelector('td:nth-child(7)').innerText.replace('-$','')){
                    temp_rates = rates.amexp;
                };
            };
            let temp_fee = parseFloat(temp_collected) * temp_rates[0];
            temp_fee += temp_rates[1];
            let difference = parseFloat(temp_row.querySelector('td:nth-child(7)').innerText.replace('$',''));
            difference += temp_fee;
            temp_row.querySelector('td:nth-child(10)').innerText = '$' + temp_fee.toFixed(2);
            temp_row.querySelector('td:last-child').innerText = '$' + difference.toFixed(2);
        }else{
            temp_row.querySelector('td:nth-child(10)').innerText = '$0.00';
            temp_row.querySelector('td:last-child').innerText = '$0.00';
        };
    };
    calculateTotals(table_data);
};

/*loops through table to compile totals*/
function calculateTotals(table){
    let total_fees = 0;
    let total_calculated_fees = 0;
    let total_difference = 0;
    for(i=0;i<table.length;i++){
        if(table[i].querySelector('td:nth-child(10)').innerText != '$0.00'){
            total_fees += parseFloat(table[i].querySelector('td:nth-child(7)').innerText.replace('$',''));
            total_calculated_fees += parseFloat(table[i].querySelector('td:nth-child(10)').innerText.replace('$',''));
            total_difference += parseFloat(table[i].querySelector('td:nth-child(11)').innerText.replace('$',''));
        };
    };
    let total_table = $('#totals tbody tr')[0];
    total_table.querySelector('td:nth-child(1)').innerText = `$${total_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(2)').innerText = `$${total_calculated_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(3)').innerText = `$${total_difference.toFixed(2)}`;
};

/*removes existing data in the table and resets object*/
function resetTable(){
    $('#transactions tbody')[0].innerHTML = '';
    calculateTotals($('#transactions tbody')[0]);
    tableObject.data = {};
    tableObject.rows = 0;
};

/*toggles video popup*/
function videoToggle(action){
    if(action === 'open'){
        $('.video').removeClass('hide');
    };
    if(action === 'close'){
        $('.video').addClass('hide');
    };
}

/*
card rates
1.95,0.07
2.9,0.3
2.1,0.15
3.2,0.35

test string: should have 5 transactions listed
04:35:05 AM
1400120209
Card Present
Completed
Jan 17, 2024
$24.28
-$1.00
$0.00
$23.28
04:35:05 AM
1400120210
Card Not Present
Amex
Jan 17, 2024
$24.28
-$1.13
$0.00
$23.28
04:35:06 AM
1400120211
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50
04:35:06 AM
1400120212
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50
04:35:09 AM
1400120213
Card Not Present
Completed
Jan 17, 2024
$27.60
-$1.10
$0.00
$26.50
*/