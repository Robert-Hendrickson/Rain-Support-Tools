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