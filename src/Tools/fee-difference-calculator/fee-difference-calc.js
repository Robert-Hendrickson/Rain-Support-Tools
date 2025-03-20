//global variable for compiling import data
let _import = '';
//variable for tracking table information
let tableObject = {
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
    let checked = document.querySelector('input#amexCheck').checked;
    if(checked){
        document.querySelectorAll('.amex').forEach(element => {
            element.classList.add('show');
        });
    };
    if(!checked){
        document.querySelectorAll('.amex').forEach(element => {
            element.classList.remove('show');
        });
    };
};

/*hides or displays import popup*/
function importToggle(action){
    if(action === 'open'){
        document.querySelector('.popup1').classList.remove('hide');
    };
    if(action === 'close'){
        document.querySelector('.popup1').classList.add('hide');
    };
};

/*closes the wait box and removes any existing error message text*/
function closeDialogue(){
    document.querySelector('.popup2').classList.add('hide');
    document.querySelector('.errorMessage').innerHTML = '';
    document.getElementById('closeDialogue').classList.add('hide');
};
/*check to see if provided data meets criteria to be used. 
Criteria: 
1. The total number of lines devided by 9 is a whole number (each line should have 9 pieces of data) 
2. The number of sets of data found with the regex expression matches the number found from criteria 1(this confirms that all rows belong to an inteded data set and there isn't missing or extra lines that happens to match the 1 criteria math)*/
function checkNumberOfLines(){
    //display wait popup (this could take a second to go through all the data)
    document.querySelector('.popup2').classList.remove('hide');
    //get imported string
    _import = document.querySelector('.import textarea').value;
    //save value of each the number of lines divided by 9(should equal a whole number)
    let number_of_transactions = _import.split('\n').length/9;
    if((/\./).test(number_of_transactions)){//if there is a decimal in the saved number then something is missing, generate an error response
        messageUpdate("The number of lines given doesn't match the number of expected lines for full data. Please make sure the copied data is the full set of data from rows selected and try again.")
        document.getElementById('closeDialogue').classList.remove('hide');
        return false;
    };
    //find all sets of data as an array
    let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
    //check that total found data sets equals the number of expected lines
    if(number_of_transactions != split_data.length){
        //if not generate an error response
        messageUpdate("The number of found rows doesn't match the number of estimated rows. This means there may be lines that are duplicated or missing. Please make sure the copied data is the full set of data from rows selected and try again.")
        document.getElementById('closeDialogue').classList.remove('hide');
        return false;
    }
    document.getElementById('closeDialogue').classList.remove('hide');
    //if all passes, return a true response to start generating the table
    return true;
};
/*this updates the error message box for if there was an issue with the data and why it failed*/
function messageUpdate(message){
    document.querySelector('.errorMessage').insertAdjacentHTML('beforeend', `<p>${message}</p>`);
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
    document.querySelector('#transactions tbody').innerHTML = '';
    //build table from tableObject.data value
    for(const row in tableObject.data){
        let tr = `<tr id="${tableObject.data[row].row}"><td>${tableObject.data[row].dateNum}</td><td>${tableObject.data[row].transaction}</td><td>${tableObject.data[row].atTill}</td><td>${tableObject.data[row].status}</td><td>${tableObject.data[row].dateText}</td><td>${tableObject.data[row].collected}</td><td>${tableObject.data[row].fee}</td><td>${tableObject.data[row].return}</td><td>${tableObject.data[row].totalPayout}</td><td></td><td></td>`;
        document.querySelector('#transactions tbody').insertAdjacentHTML('beforeend', tr);
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
    rates['amexp'] = [precentToDecimal(document.querySelector('#amexcardPresentRate').value),parseFloat(document.querySelector('#amexcardPresentAmount').value)];
    rates['amexnp'] = [precentToDecimal(document.querySelector('#amexcardNotPresentRate').value),parseFloat(document.querySelector('#amexcardNotPresentAmount').value)];
    rates['cardp'] = [precentToDecimal(document.querySelector('#cardPresentRate').value),parseFloat(document.querySelector('#cardPresentAmount').value)];
    rates['cardnp'] = [precentToDecimal(document.querySelector('#cardNotPresentRate').value),parseFloat(document.querySelector('#cardNotPresentAmount').value)];
    console.log(rates);
    let table_data = document.querySelectorAll('#transactions tbody tr');
    for(i=0;i<table_data.length;i++){
        temp_row = table_data[i];
        if(temp_row.querySelector('td:nth-child(3)').innerText === 'Card Not Present' && temp_row.querySelector('td:nth-child(6)').innerText !='$0.00'){
            temp_rates = rates.cardp;
            let temp_collected = temp_row.querySelector('td:nth-child(6)').innerText.replace('$','');
            if(document.querySelector('#amexCheck').checked){
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
    let total_table = document.querySelector('#totals tbody tr');
    total_table.querySelector('td:nth-child(1)').innerText = `$${total_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(2)').innerText = `$${total_calculated_fees.toFixed(2)}`;
    total_table.querySelector('td:nth-child(3)').innerText = `$${total_difference.toFixed(2)}`;
};

/*removes existing data in the table and resets object*/
function resetTable(){
    document.querySelector('#transactions tbody').innerHTML = '';
    calculateTotals(document.querySelector('#transactions tbody'));
    tableObject.data = {};
    tableObject.rows = 0;
};

/*toggles video popup*/
function videoToggle(action){
    if(action === 'open'){
        document.querySelector('.video').classList.remove('hide');
    };
    if(action === 'close'){
        document.querySelector('.video').classList.add('hide');
    };
}
//set event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
    //toggles video popup
    document.querySelector('#rateTables input').addEventListener('click', () => {
        videoToggle('open');
    });
    document.querySelector('.my-player input').addEventListener('click', () => {
        videoToggle('close');
    });
    //toggles amex display
    document.querySelector('#amexSelector input#amexCheck').addEventListener('click', amexDisplayToggle);
    //toggles import popup
    document.querySelector('#amexSelector input#import').addEventListener('click', () => {
        importToggle('open');
    });
    document.querySelector('.popup1 input#close').addEventListener('click', () => {
        importToggle('close');
    });
    //Run calculation
    document.querySelector('#amexSelector input#calculate').addEventListener('click', calculateDifference);
    //toggles clear popup
    document.querySelector('#amexSelector input#clear').addEventListener('click', resetTable);
    //Import button
    document.querySelector('.popup1 input#import').addEventListener('click', buildObject);
    //close wait popup
    document.querySelector('.popup2 input#closeDialogue').addEventListener('click', closeDialogue);
});