//set variable to hold totals
const totals = {
    'instock': 0,
    'reserved': 0,
    'onhand':0
};

/*function returns a new element for a new row to add to the tables*/
function newRow(change,reserved,inventory){
    let symbol = '';
    if(change === 'up'){
        symbol = '+';
    }else if(change === 'down'){
        symbol = '-';
    }else{
        console.error('Something didn\'t happen correctly');
        return
    };
    let html_row_string = $.parseHTML(`<tr><td>${symbol}${inventory}</td><td>${symbol}${reserved}</td><td>${totals.instock}</td><td>${totals.reserved}</td></tr>`);
    return html_row_string;
};
/*function updates object totals, then update user display with new totals*/
function updateTotals(change,inventory_change,reserved_change){
    if(change === 'up'){
        totals.instock += parseFloat(inventory_change);
        totals.reserved += parseFloat(reserved_change);
        totals.onhand = totals.instock - totals.reserved;
    };
    if(change === 'down'){
        totals.instock -= parseFloat(inventory_change);
        totals.reserved -= parseFloat(reserved_change);
        totals.onhand = totals.instock - totals.reserved;
    };
    $('#instock')[0].innerText = totals.instock;
    $('#reserved')[0].innerText = totals.reserved;
    $('#onhand')[0].innerText = totals.onhand;
};
/*function collects totals from user interface then passes them to them to the update function and newrow function*/
function recordChange(change){
    let direction_of_change = change;
    let inventory_change = $('#inventory-change')[0].value;
    if(inventory_change === ''){
        inventory_change = '0';
    };
    let reserved_change = $('#reserved-change')[0].value;
    if(reserved_change === ''){
        reserved_change = '0';
    };
    updateTotals(change,inventory_change,reserved_change);
    let new_row = newRow(direction_of_change,reserved_change,inventory_change)[0];
    $('.history-changes > tbody')[0].prepend(new_row);
    $('#inventory-change')[0].value = '';
    $('#reserved-change')[0].value = '';
};