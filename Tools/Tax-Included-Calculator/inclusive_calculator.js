/*
1. Tax inclsive price will need to calculate the tax backwards from the inclusive price
2. Total and price will need to be calculated to be the same
*/
var number_of_lines = 0;
let template = {
        "qty": 0,
        "price": 0,
        "ext": 0,
        "disc": 0,
        "tax": 0,
        "taxable_amount": 0,
        "total": 0,
        "taxable": "yes"
}
var line_entries = {
};
var totals = {
    'sub_total': 0,
    'disc': 0,
    'tax': 0,
    'total': 0
}
//Add new lines without removing data.
function addRowElement(){
    //get row line number to make
    number_of_lines++;
    let line = number_of_lines;
    //create table row element amd add id attribute
    const  trow = $(document)[0].createElement("tr");
    trow.setAttribute('id', `row_${line}`);
    //create row cell for qty, add attributes, and add to the row element
    const td_qty = $(document)[0].createElement("td");
    const in_qty = $(document)[0].createElement("input");
    in_qty.setAttribute('id', 'qty');
    in_qty.setAttribute('type', 'number');
    in_qty.setAttribute('value', '0');
    in_qty.setAttribute('onchange', `lineUpdate(${line})`);
    td_qty.appendChild(in_qty);
    trow.appendChild(td_qty);
    //create row cell for price, add attributes, and add to the row element
    const td_price = $(document)[0].createElement("td");
    const in_price = $(document)[0].createElement("input");
    in_price.setAttribute('id', 'price');
    in_price.setAttribute('type', 'number');
    in_price.setAttribute('value', '0');
    in_price.setAttribute('onchange', `lineUpdate(${line})`);
    td_price.appendChild(in_price);
    trow.appendChild(td_price);
    //create row cell for ext, add attributes, and add to the row element
    const td_ext = $(document)[0].createElement("td");
    const in_ext = $(document)[0].createElement("input");
    in_ext.setAttribute('id', 'ext');
    in_ext.setAttribute('type', 'number');
    in_ext.setAttribute('value', '0');
    in_ext.setAttribute('onchange', `lineUpdate(${line})`);
    in_ext.setAttribute('disabled', 'disabled');
    td_ext.appendChild(in_ext);
    trow.appendChild(td_ext);
    //create row cell for disc, add attributes, and add to the row element
    const td_disc = $(document)[0].createElement("td");
    const in_disc = $(document)[0].createElement("input");
    in_disc.setAttribute('id', 'discount');
    in_disc.setAttribute('type', 'number');
    in_disc.setAttribute('value', '0');
    in_disc.setAttribute('onchange', `lineUpdate(${line})`);
    td_disc.appendChild(in_disc);
    trow.appendChild(td_disc);
    //create row cell for tax, add attributes, and add to the row element
    const td_tax = $(document)[0].createElement("td");
    const in_tax = $(document)[0].createElement("input");
    in_tax.setAttribute('id', 'tax');
    in_tax.setAttribute('type', 'number');
    in_tax.setAttribute('value', '0');
    in_tax.setAttribute('disabled', `disabled`);
    td_tax.appendChild(in_tax);
    trow.appendChild(td_tax);
    //create row cell for total, add attributes, and add to the row element
    const td_total = $(document)[0].createElement("td");
    const in_total = $(document)[0].createElement("input");
    in_total.setAttribute('id', 'total');
    in_total.setAttribute('type', 'number');
    in_total.setAttribute('value', '0');
    in_total.setAttribute('disabled', `disabled`);
    td_total.appendChild(in_total);
    trow.appendChild(td_total);
    //create row cell for taxable choice, add attributes, and add to the row element
    const td_taxable = $(document)[0].createElement("td");
    const sel_taxable = $(document)[0].createElement("select");
    sel_taxable.setAttribute('id', 'taxable');
    sel_taxable.setAttribute('value', 'yes');
    sel_taxable.setAttribute('onchange', `lineUpdate(${line})`);
    const opt_y = $(document)[0].createElement("option");
    opt_y.setAttribute('value', 'yes');
    const opt_y_text = $(document)[0].createTextNode('Yes');
    opt_y.appendChild(opt_y_text);
    const opt_n = $(document)[0].createElement("option");
    opt_n.setAttribute('value', 'no');
    const opt_n_text = $(document)[0].createTextNode('No');
    opt_n.appendChild(opt_n_text);
    sel_taxable.appendChild(opt_y);
    sel_taxable.appendChild(opt_n);
    td_taxable.appendChild(sel_taxable);
    trow.appendChild(td_taxable);
    // add row element to the existing table
    $('#table-lines')[0].appendChild(trow);
    line_entries[`row_${number_of_lines}`] = {
        "qty": 0,
        "price": 0,
        "ext": 0,
        "disc": 0,
        "tax": 0,
        "taxable_amount": 0,
        "total": 0,
        "taxable": "yes"
    };
}
function addLine(){
    number_of_lines++;
    let current = $('#table-lines')[0].innerHTML;
    let newLine = `<tr id="row_${number_of_lines}">
            <td><input id="qty" type="number" value="0" onchange="lineUpdate(${number_of_lines})" /></td>
            <td><input id="price" type="number" value="0" onchange="lineUpdate(${number_of_lines})" /></td>
            <td><input id="ext" type="number" value="0" disabled /></td>
            <td><input id="discount" type="number" value="0" onchange="lineUpdate(${number_of_lines})" /></td>
            <td><input id="tax" type="number" value="0" disabled /></td>
            <td><input id="total" type="number" value="0" disabled/></td>
            <td><select id="taxable" value="yes" onchange="lineUpdate(${number_of_lines})">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
            </td>
        </tr>`;
    current = current + newLine;
    $('#table-lines')[0].innerHTML = current;
        line_entries[`row_${number_of_lines}`] = template;
};
//sets a default first line
$(document).ready(function(){addRowElement();});
function taxableLine(){
};
//test function for making more than one line at a time
function multiLineAdd() {
    let x = $('#lines-to-add')[0].value;
    if (x == ''){
        addRowElement();
    console.log('Added 1 Line');
    }else if(x != '') {
        x = parseInt($('#lines-to-add')[0].value);
        if(x <= 20 ){
            let y = parseInt($('#lines-to-add')[0].value);
            for (i = 0; i < y; i++){
                addRowElement();
            };
            console.log(`Added ${y} Lines`);
        }else{
            console.error('To keep the system from getting stuck in a large loop, please enter a number between 1 and 20');
        };
    };
};
function lineAddCheck() {
    let y = parseInt($('#lines-to-add')[0].value);
    if(y > 20){
        $('#lines-to-add').css('border', 'red solid 2px');
        $('#lines-to-add').css('color', 'red');
        $('#addline-error').css('display', 'block');
        console.error('Cannot add more than 20 lines at a time.');
    }
    if(y <= 20){
        $('#lines-to-add').css('border', '');
        $('#lines-to-add').css('color', '');
        $('#addline-error').css('display', 'none');
    }
}
function updateTax(){
    t = parseFloat($('#tax-rate')[0].value);
    t = t/100;
    console.log('tax rate is ' + t);
    let lines = number_of_lines;
    for(let i = 1; i < (lines + 1); i++){
        let z = 1+t;
        let y = line_entries[`row_${i}`].taxable_amount;
        let r = y/z;
        let tax = r*t;
        let a = line_entries[`row_${i}`];
        if ($(`#row_${i} #taxable`)[0].value == 'yes'){
            //wrong tax calc, needs to have inclusive calc.
            console.log('updating taxable lines');
            a.tax = tax;
            $(`#row_${i} #tax`)[0].value = a.tax;
            a.total = a.ext;
            $(`#row_${i} #total`)[0].value = a.total - a.disc;
        }else if($(`#row_${i} #taxable`)[0].value == 'no'){
            console.log('updating non-taxable lines');
            a.tax = 0;
            $(`#row_${i} #tax`)[0].value = a.tax;
        };
    };
    calcTotals();
};
function calcTotals() {
    totals = {
    'sub_total': 0,
    'disc': 0,
    'tax': 0,
    'total': 0
    };
    for (let line in line_entries) {
        totals.sub_total = totals.sub_total + line_entries[`${line}`].ext;
        totals.disc = totals.disc + line_entries[`${line}`].disc;
        totals.tax = totals.tax + line_entries[`${line}`].tax;
    }
    totals.tax = parseFloat(totals.tax.toFixed(2));
    totals.total = totals.sub_total - totals.disc;
    $('#total-sub')[0].value = totals.sub_total;
    $('#total-disc')[0].value = totals.disc;
    $('#total-tax')[0].value = totals.tax;
    $('#total-total')[0].value = totals.total;
}
//needs to have variables grab values to update object instead of updating object directly from the row data in the table
function lineUpdate(x){
    console.log(`Updating Line ${x}`);
    //get qty value
    let qty_input = parseFloat($(`#row_${x} #qty`)[0].value);
    line_entries[`row_${x}`].qty = qty_input;
    //get price value
    let price_input = parseFloat($(`#row_${x} #price`)[0].value);
    line_entries[`row_${x}`].price = price_input;
    //calculate ext value & update table row with value
    let ext_input = qty_input * price_input;
    ext_input = parseFloat(ext_input.toFixed(2));
    line_entries[`row_${x}`].ext = ext_input;
    $(`#row_${x} #ext`)[0].value = ext_input;
    //get discount amount
    let disc_input = parseFloat($(`#row_${x} #discount`)[0].value);
    line_entries[`row_${x}`].disc = disc_input;
    //calculate taxable amount
    let taxable = ext_input - disc_input;
    line_entries[`row_${x}`].taxable_amount = taxable;

    //check line is taxable, if it is set row tax rate
    if ($(`#row_${x} #taxable`)[0].value == 'yes'){
        let t = parseFloat($('#tax-rate')[0].value);
        t = t/100;
        let z = 1+t;
        let y = line_entries[`row_${x}`].taxable_amount;
        let r = y/z;
        tax = r*t;
        line_entries[`row_${x}`].tax = tax;
        $(`#row_${x} #tax`)[0].value = line_entries[`row_${x}`].tax;
    }else if($(`#row_${x} #taxable`)[0].value == 'no'){
        line_entries[`row_${x}`].tax = 0;
        $(`#row_${x} #tax`)[0].value = line_entries[`row_${x}`].tax;
    };
    line_entries[`row_${x}`].total = line_entries[`row_${x}`].ext - line_entries[`row_${x}`].disc;
    $(`#row_${x} #total`)[0].value = line_entries[`row_${x}`].total;
    console.log('Recalculate Totals');
    calcTotals();
}
function reset() {
    line_entries = {};
    number_of_lines = 0;
    totals = {
    'sub_total': 0,
    'disc': 0,
    'tax': 0,
    'total': 0
    };
    $('#table-lines')[0].innerHTML = '';
    $('#total-sub')[0].value = 0;
    $('#total-disc')[0].value = 0;
    $('#total-tax')[0].value = 0;
    $('#total-total')[0].value = 0;
    addRowElement();
};