//global variable for compiling import data
var _import = '';

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
function closeDialogue(){
    $('.popup2').addClass('hide');
};
//check to see if provided data meets criteria to be used. Criteria: 1. The total number of lines devided by 9 is a whole number (each line should have 9 pieces of data) 2. The number of sets of data found with the regex expression matches the number found from criteria 1(this confirms that all rows belong to an inteded data set and there isn't missing or extra lines that happens to match the 1 criteria math)
function checkNumberOfLines(){
    $('.wait')[0].innerHTML = '';
    $('.popup2').removeClass('hide');
    messageUpdate("Checking Import Data Integrity.")
    _import = $('.import textarea')[0].value;
    let number_of_transactions = _import.split('\n').length/9;
    if(number_of_transactions.toString().match(/\./)){
        messageUpdate('Number of estimated rows: ' + number_of_transactions);
        messageUpdate('The number of lines given is either to many or to few to have all of the information for the lines being imported. Please copy the data over again and retry.');
        return false;
    };
    let split_data = _import.match(/(\d{2}:\d{2}:\d{2} [APMapm]{2})\n(\d+)\n(.*?)\n(.*?)\n([A-Za-z]{3} \d{1,2}, \d{4})\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)\n(-{0,1}\$[\d.,]+)/g);
    if(number_of_transactions != split_data.length){
        messageUpdate('Line Sets expected: ' + number_of_transactions);
        messageUpdate('Line Sets found: ' + split_data.length);
        messageUpdate("The number of line sets that match imported line data doesn't match the number of line sets there should be. Please copy the data over again and retry.");
        return false;
    }
    messageUpdate("Line sets match the number of lines imported. Converting data into object variable.")
    return true;
};
//gives feedback on status of process to end user incase the process takes longer so they know things are happening
function messageUpdate(message){
    $('.wait')[0].append($.parseHTML(`<p>${message}</p>`)[0]);
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