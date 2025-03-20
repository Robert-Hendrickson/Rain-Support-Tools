//set variable to hold totals
let totals = {
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
    let html_row_string = `<tr><td>${symbol}${inventory}</td><td>${symbol}${reserved}</td><td>${totals.instock}</td><td>${totals.reserved}</td></tr>`;
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
    document.getElementById('instock').innerText = totals.instock;
    document.getElementById('reserved').innerText = totals.reserved;
    document.getElementById('onhand').innerText = totals.onhand;
};
/*function collects totals from user interface then passes them to them to the update function and newrow function*/
function recordChange(change){
    let direction_of_change = change;
    let inventory_change = document.getElementById('inventory-change').value;
    if(inventory_change === ''){
        inventory_change = '0';
    };
    let reserved_change = document.getElementById('reserved-change').value;
    if(reserved_change === ''){
        reserved_change = '0';
    };
    updateTotals(change,inventory_change,reserved_change);
    let new_row = newRow(direction_of_change,reserved_change,inventory_change);
    document.querySelector('.history-changes > tbody').insertAdjacentHTML('afterbegin',new_row);
    document.getElementById('inventory-change').value = '';
    document.getElementById('reserved-change').value = '';
};
//event listeners
document.addEventListener('DOMContentLoaded', () => {
    //add event listeners for up down buttons
   document.querySelector('input[value="Increase"]').addEventListener('click', () => {
    recordChange('up');
   });
   document.querySelector('input[value="Reduce"]').addEventListener('click', () => {
    recordChange('down');
   });
   //add event listener for reset button
   document.querySelector('input[value="reset"]').addEventListener('click', () => {
    window.location.reload();
   });
   //add event listener for home button
   document.querySelector('input[value="Home"]').addEventListener('click', () => {
    window.location.pathname = '/Rain-Support-Tools/';
   });
});