//sets variable for holding totals
let totals = {
    total: 0,
    principle: 0,
    tax: 0
};
/*function controls which columns in calculator are displayed*/
function displayColumns(column){
    let checked = $(`input#${column}`)[0].checked;
    if(checked){
        $(`.id-${column}`).removeClass('hide');
    }else{
        $(`.id-${column}`).addClass('hide');
    };
};
/*function runs an update for the totals column when a change to one of the values is made*/
function totalsColCalc(){
    totals.total = parseFloat($('#total-total input')[0].value);
    totals.principle = parseFloat($('#total-principle input')[0].value);
    totals.tax = parseFloat($('#total-tax input')[0].value);
    let estimate_total = 0;
    estimate_total += totals.principle + totals.tax;
    estimate_total = estimate_total.toFixed(2);
    if(totals.total.toFixed(2) === estimate_total){
        $('#total-principle2')[0].innerText = "True";
    }else{
        $('#total-principle2')[0].innerText = "False";
    };
};
/*function updates individual columns when there is a change made to that column using the passed in value to decide which column needs updating*/
function dataUpdate(colName){
    let entered_amount = parseFloat($(`td.id-${colName}`)[0].querySelector('input').value);
    if(!isNaN(entered_amount)){
        let percentage = entered_amount/totals.total;
        let principle = totals.principle * percentage;
        let tax = totals.tax * percentage;
        principle = principle.toFixed(2);
        tax = tax.toFixed(2);
        $(`td.id-${colName}`)[1].innerText = principle;
        $(`td.id-${colName}`)[2].innerText = tax;
        if((parseFloat(principle) + parseFloat(tax)) === entered_amount){
            $(`td.id-${colName}`)[3].innerText = 'True';
        }else{
            $(`td.id-${colName}`)[3].innerText = 'False';
        };
    }else{
        $(`td.id-${colName}`)[1].innerText = '';
        $(`td.id-${colName}`)[2].innerText = '';
        $(`td.id-${colName}`)[3].innerText = '';
    };
};
/*function makes new list element for option list*/
function newList(name,scrubedName){
    let li = document.createElement('li');
    let inp = document.createElement('input');
    inp.setAttribute('type','checkbox');
    inp.setAttribute('id',`${scrubedName}`);
    inp.setAttribute('checked','');
    inp.setAttribute('onclick',`displayColumns('${scrubedName}')`)
    li.append(inp);
    li.append(`${name}`);
    $('.payment_option_list ul')[0].append(li);
    hideNew();
    $('#new-name')[0].value = '';
};
/*function checks input for duplicates and scrubs info for input into creation functions*/
function checkNewName(enteredName){
    let scrubedName = enteredName.toLowerCase().replace(' ','_');
    if($(`.id-${scrubedName}`).length > 0){
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
    $('thead tr')[0].append(header);
    //creates data cell
    let data = document.createElement('td');
    data.append('$');
    data.setAttribute('class',`id-${className}`);
    let input = document.createElement('input');
    input.setAttribute('onchange',`dataUpdate('${className}')`);
    data.append(input);
    $('tr#totals-row')[0].append(data);
    //creates principle cell
    let principle = document.createElement('td');
    principle.setAttribute('class',`id-${className}`);
    $('tr#principle-row')[0].append(principle);
    //creates tax cell
    let tax = document.createElement('td');
    tax.setAttribute('class',`id-${className}`);
    $('tr#tax-row')[0].append(tax);
    //creates checker cell
    let check = document.createElement('td');
    check.setAttribute('class',`id-${className}`);
    $('tr#column-totals-row')[0].append(check);
};
/*functions control the user interface for adding new columns to table
this could be redone to always be displayed rather than hiding such a small interface from users*/
function showNew(){
    $('.newbtn').addClass('hide');
    $('.newCol').removeClass('hide');
};
function hideNew(){
    $('.newCol').addClass('hide');
    $('.newbtn').removeClass('hide');
};