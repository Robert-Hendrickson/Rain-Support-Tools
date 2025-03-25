//sets variable for holding totals
let totals = {
    total: 0,
    principle: 0,
    tax: 0
};
/*function controls which columns in calculator are displayed*/
function displayColumns(column){
    let checked = document.querySelector(`.payment_option_list input#${column}`).checked;
    if(checked){
        document.querySelectorAll(`.id-${column}`).forEach(element => {
            element.classList.remove('hide');
        });
    }else{
        document.querySelectorAll(`.id-${column}`).forEach(element => {
            element.classList.add('hide');
        });
    };
};
/*function runs an update for the totals column when a change to one of the values is made*/
function totalsColCalc(){
    totals.total = parseFloat(document.querySelector('#total-total input').value);
    totals.principle = parseFloat(document.querySelector('#total-principle input').value);
    totals.tax = parseFloat(document.querySelector('#total-tax input').value);
    let estimate_total = 0;
    estimate_total += totals.principle + totals.tax;
    estimate_total = estimate_total.toFixed(2);
    if(totals.total.toFixed(2) === estimate_total){
        document.getElementById('total-principle2').innerText = "True";
    }else{
        document.getElementById('total-principle2').innerText = "False";
    };
};
/*function updates individual columns when there is a change made to that column using the passed in value to decide which column needs updating*/
function dataUpdate(colName){
    //save inputs in an array to use later
    let column_data = document.querySelectorAll(`td.id-${colName}`);
    let entered_amount = parseFloat(column_data[0].querySelector('input').value);
    if(!isNaN(entered_amount)){
        let percentage = entered_amount/totals.total;
        let principle = totals.principle * percentage;
        let tax = totals.tax * percentage;
        principle = principle.toFixed(2);
        tax = tax.toFixed(2);
        column_data[1].innerText = principle;
        column_data[2].innerText = tax;
        if((parseFloat(principle) + parseFloat(tax)) === entered_amount){
            column_data[3].innerText = 'True';
        }else{
            column_data[3].innerText = 'False';
        };
    }else{
        column_data[1].innerText = '';
        column_data[2].innerText = '';
        column_data[3].innerText = '';
    };
};
/*function makes new list element for option list*/
function newList(name,scrubedName){
    let li = document.createElement('li');
    let input = document.createElement('input');
    input.setAttribute('type','checkbox');
    input.setAttribute('id',`${scrubedName}`);
    input.setAttribute('checked','');
    input.addEventListener('click',() => displayColumns(scrubedName));
    li.append(input);
    li.append(`${name}`);
    document.querySelector('.payment_option_list ul').append(li);
    hideNew();
    document.getElementById('new-name').value = '';
};
/*function checks input for duplicates and scrubs info for input into creation functions*/
function checkNewName(enteredName){
    let scrubedName = enteredName.toLowerCase().replace(' ','_');
    if(document.querySelectorAll(`.id-${scrubedName}`).length > 0){
        //this should get replaced with error popup so user can see error message
        console.log('column already exists');
    }else{
        newList(enteredName,scrubedName);
        newCells(enteredName,scrubedName);
    };
};
/*function creates new cells for table using entered name*/
function newCells(colName,className){
    //creates header cell
    let header = document.createElement('th');
    header.innerText = colName;
    header.setAttribute('class', `id-${className}`);
    document.querySelector('thead tr').append(header);
    //creates data cell
    let data = document.createElement('td');
    data.append('$');
    data.setAttribute('class',`id-${className}`);
    let input = document.createElement('input');
    input.addEventListener('change',() => dataUpdate(className));
    data.append(input);
    document.querySelector('tr#totals-row').append(data);
    //creates principle cell
    let principle = document.createElement('td');
    principle.setAttribute('class',`id-${className}`);
    document.querySelector('tr#principle-row').append(principle);
    //creates tax cell
    let tax = document.createElement('td');
    tax.setAttribute('class',`id-${className}`);
    document.querySelector('tr#tax-row').append(tax);
    //creates checker cell
    let check = document.createElement('td');
    check.setAttribute('class',`id-${className}`);
    document.querySelector('tr#column-totals-row').append(check);
};
/*functions control the user interface for adding new columns to table
this could be redone to always be displayed rather than hiding such a small interface from users*/
function showNew(){
    document.querySelector('.newbtn').classList.add('hide');
    document.querySelector('.newCol').classList.remove('hide');
};
function hideNew(){
    document.querySelector('.newCol').classList.add('hide');
    document.querySelector('.newbtn').classList.remove('hide');
};
document.addEventListener('DOMContentLoaded', () => {
   //set event listeners for default columns
   document.querySelectorAll('tr#totals-row td input').forEach(
    (input, index) => {
        if (index === 0){
            input.addEventListener('change',totalsColCalc);
        } else {
            input.addEventListener('change',() => dataUpdate(input.id));
        }
    });
    //set event listeners for principle and tax columns
    document.querySelector('tr#principle-row td input').addEventListener('change',totalsColCalc);
    document.querySelector('tr#tax-row td input').addEventListener('change',totalsColCalc);
    //set event listeners for column controls
    document.querySelectorAll('.payment_option_list ul input').forEach(input => {
        input.addEventListener('click',() => displayColumns(input.id));
    });
    //set event listeners for new column interface
    document.querySelector('.newbtn').addEventListener('click',showNew);
    document.querySelector('.newCol input[value="Cancel"]').addEventListener('click',hideNew);
    document.querySelector('.newCol input[value="Save"]').addEventListener('click',() => checkNewName(document.querySelector('#new-name').value));
    //set event listeners for help window
    document.querySelector('.help-window input[value="Hide Video"]').addEventListener('click',() => document.querySelector('.help-window').classList.add('hide'));
    document.querySelector('.help-window button').addEventListener('click',() => location.reload());
});