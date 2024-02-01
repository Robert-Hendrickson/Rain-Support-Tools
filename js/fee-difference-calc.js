//global variable for compiling import data
var _import = '';
var tableObject = {
    rows: 0,
    data: {},
    _addRows: (array) =>{
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

function amexDisplayToggle(){
    let checked = $('input#amexCheck')[0].checked;
    if(checked){
        $('.amex').addClass('show');
    };
    if(!checked){
        $('.amex').removeClass('show');
    };
};

function importToggle(action){
    if(action === 'open'){
        $('.popup1').removeClass('hide');
    };
    if(action === 'close'){
        $('.popup1').addClass('hide');
    };
};
//closes the wait box and removes any existing error message text
function closeDialogue(){
    $('.popup2').addClass('hide');
    $('.errorMessage')[0].innerHTML = '';
    $('#closeDialogue').addClass('hide');
};
//check to see if provided data meets criteria to be used. Criteria: 1. The total number of lines devided by 9 is a whole number (each line should have 9 pieces of data) 2. The number of sets of data found with the regex expression matches the number found from criteria 1(this confirms that all rows belong to an inteded data set and there isn't missing or extra lines that happens to match the 1 criteria math)
function checkNumberOfLines(){
    $('.popup2').removeClass('hide');
    _import = $('.import textarea')[0].value;
    let number_of_transactions = _import.split('\n').length/9;
    if(number_of_transactions.toString().match(/\./)){
        messageUpdate("The number of lines given doesn't match the number of expected lines for full data. Please make sure the copied data is the full set of data from rows selected and try again.")
        $('#closeDialogue').removeClass('hide');
        return false;
    };
    let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
    if(number_of_transactions != split_data.length){
        messageUpdate("The number of found rows doesn't match the number of estimated rows. This means there may be lines that are duplicated or missing. Please make sure the copied data is the full set of data from rows selected and try again.")
        $('#closeDialogue').removeClass('hide');
        return false;
    }
    $('#closeDialogue').removeClass('hide');
    return true;
};
//this updates the error message box for if there was an issue with the data and why it failed
function messageUpdate(message){
    $('.errorMessage')[0].append($.parseHTML(`<p>${message}</p>`)[0]);
};

function buildObject(){
    if(checkNumberOfLines()){
        let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
        tableObject._addRows(split_data);
        buildTable();
    };
};

function buildTable(){
    for(const row in tableObject.data){
        let tr = $.parseHTML(`<tr id="${tableObject.data[row].row}"><td>${tableObject.data[row].dateNum}</td><td>${tableObject.data[row].transaction}</td><td>${tableObject.data[row].atTill}</td><td>${tableObject.data[row].status}</td><td>${tableObject.data[row].dateText}</td><td>${tableObject.data[row].collected}</td><td>${tableObject.data[row].fee}</td><td>${tableObject.data[row].return}</td><td>${tableObject.data[row].totalPayout}</td><td></td><td></td>`)[0];
        $('#transactions tbody')[0].append(tr);
    };
    closeDialogue();
    importToggle('close');
};

//takes a string from rates boxes and converts it to a usable decimal for calculation
function precentToDecimal(value){
    value = '0.0' + value.replace('.','');
    value = parseFloat(value);
    return value;
};

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
        if(temp_row.querySelector('td:nth-child(3)').innerText === 'Card Not Present'){
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
        };
    };
    calculateTotals(table_data);
};

function calculateTotals(table){
    let total_fees = 0;
    let total_calculated_fees = 0;
    let total_difference = 0;
    for(i=0;i<table.length;i++){
        total_fees += parseFloat(table[i].querySelector('td:nth-child(7)').innerText.replace('$',''));
        total_calculated_fees += parseFloat(table[i].querySelector('td:nth-child(10)').innerText.replace('$',''));
        total_difference += parseFloat(table[i].querySelector('td:nth-child(11)').innerText.replace('$',''));
    };
    let total_table = $('#totals tbody tr')[0];
    total_table.querySelector('td:nth-child(1)').innerText = `$${total_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(2)').innerText = `$${total_calculated_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(3)').innerText = `$${total_difference.toFixed(2)}`;
};

/*This is a usable regex that will find all occurances from a coppied set of data out of rain.
(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)

can be used with x.match(/regex/g) to find all transactions
y[i].split('\n') can find each piece of the lines to create object based variables.

{
    dateNum: [0],
    transaction: [1],
    atTill: [2],
    status: [3],
    dateText: [4],
    collected: [5],
    fee: [6],
    return: [7],
    totalPayout: [8]
}

test string: should have 5 transactions listed
04:35:05 AM
1400120209
Card Not Present
Completed
Jan 17, 2024
$24.28
-$1.00
$0.00
$23.28
04:35:05 AM
1400120210
Card Not Present
Completed
Jan 17, 2024
$24.28
-$1.00
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