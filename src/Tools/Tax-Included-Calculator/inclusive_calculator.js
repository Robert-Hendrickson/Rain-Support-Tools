/*
1. Tax inclsive price will need to calculate the tax backwards from the inclusive price
2. Total and price will need to be calculated to be the same
*/
let number_of_lines = 0;
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
let line_entries = {
};
let totals = {
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
    const  trow = document.createElement("tr");
    trow.setAttribute('id', `row_${line}`);
    //create row cell for qty, add attributes, and add to the row element
    const td_qty = document.createElement("td");
    const in_qty = document.createElement("input");
    in_qty.setAttribute('id', 'qty');
    in_qty.setAttribute('type', 'number');
    in_qty.setAttribute('value', '0');
    in_qty.setAttribute('onchange', `lineUpdate(${line})`);
    td_qty.appendChild(in_qty);
    trow.appendChild(td_qty);
    //create row cell for price, add attributes, and add to the row element
    const td_price = document.createElement("td");
    const in_price = document.createElement("input");
    in_price.setAttribute('id', 'price');
    in_price.setAttribute('type', 'number');
    in_price.setAttribute('value', '0');
    in_price.setAttribute('onchange', `lineUpdate(${line})`);
    td_price.appendChild(in_price);
    trow.appendChild(td_price);
    //create row cell for ext, add attributes, and add to the row element
    const td_ext = document.createElement("td");
    const in_ext = document.createElement("input");
    in_ext.setAttribute('id', 'ext');
    in_ext.setAttribute('type', 'number');
    in_ext.setAttribute('value', '0');
    in_ext.setAttribute('onchange', `lineUpdate(${line})`);
    in_ext.setAttribute('disabled', 'disabled');
    td_ext.appendChild(in_ext);
    trow.appendChild(td_ext);
    //create row cell for disc, add attributes, and add to the row element
    const td_disc = document.createElement("td");
    const in_disc = document.createElement("input");
    in_disc.setAttribute('id', 'discount');
    in_disc.setAttribute('type', 'number');
    in_disc.setAttribute('value', '0');
    in_disc.setAttribute('onchange', `lineUpdate(${line})`);
    td_disc.appendChild(in_disc);
    trow.appendChild(td_disc);
    //create row cell for tax, add attributes, and add to the row element
    const td_tax = document.createElement("td");
    const in_tax = document.createElement("input");
    in_tax.setAttribute('id', 'tax');
    in_tax.setAttribute('type', 'number');
    in_tax.setAttribute('value', '0');
    in_tax.setAttribute('disabled', `disabled`);
    td_tax.appendChild(in_tax);
    trow.appendChild(td_tax);
    //create row cell for total, add attributes, and add to the row element
    const td_total = document.createElement("td");
    const in_total = document.createElement("input");
    in_total.setAttribute('id', 'total');
    in_total.setAttribute('type', 'number');
    in_total.setAttribute('value', '0');
    in_total.setAttribute('disabled', `disabled`);
    td_total.appendChild(in_total);
    trow.appendChild(td_total);
    //create row cell for taxable choice, add attributes, and add to the row element
    const td_taxable = document.createElement("td");
    const sel_taxable = document.createElement("select");
    sel_taxable.setAttribute('id', 'taxable');
    sel_taxable.setAttribute('value', 'yes');
    sel_taxable.setAttribute('onchange', `lineUpdate(${line})`);
    const opt_y = document.createElement("option");
    opt_y.setAttribute('value', 'yes');
    const opt_y_text = document.createTextNode('Yes');
    opt_y.appendChild(opt_y_text);
    const opt_n = document.createElement("option");
    opt_n.setAttribute('value', 'no');
    const opt_n_text = document.createTextNode('No');
    opt_n.appendChild(opt_n_text);
    sel_taxable.appendChild(opt_y);
    sel_taxable.appendChild(opt_n);
    td_taxable.appendChild(sel_taxable);
    trow.appendChild(td_taxable);
    // add row element to the existing table
    document.getElementById('table-lines').appendChild(trow);
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
    let current = document.getElementById('table-lines').innerHTML;
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
    document.getElementById('table-lines').innerHTML = current;
        line_entries[`row_${number_of_lines}`] = template;
};
//sets a default first line
document.addEventListener("DOMContentLoaded", function(){addRowElement();});
//test function for making more than one line at a time
function multiLineAdd() {
    let lines_to_add = document.getElementById('lines-to-add').value;
    if (lines_to_add == ''){
        addRowElement();
        console.log('Added 1 Line');
    }else if(lines_to_add != '') {
        lines_to_add = parseInt(lines_to_add);
        if(lines_to_add <= 20 ){
            for (i = 0; i < lines_to_add; i++){
                addRowElement();
            };
            console.log(`Added ${lines_to_add} Lines`);
        }else{
            console.error('To keep the system from getting stuck in a large loop, please enter a number between 1 and 20');
        };
    };
};
function lineAddCheck() {
    let lines_to_add = parseInt(document.getElementById('lines-to-add').value);
    if(lines_to_add > 20){
        document.getElementById('lines-to-add').style.border = 'red solid 2px';
        document.getElementById('lines-to-add').style.color = 'red';
        document.getElementById('addline-error').style.display = 'block';
        console.error('Cannot add more than 20 lines at a time.');
    }
    if(lines_to_add <= 20){
        document.getElementById('lines-to-add').style.border = '';
        document.getElementById('lines-to-add').style.color = '';
        document.getElementById('addline-error').style.display = 'none';
    }
}
function updateTax(){
    let tax_rate = parseFloat(document.getElementById('tax-rate').value);
    tax_rate = tax_rate/100;
    console.log('tax rate is ' + tax_rate);
    let lines = number_of_lines;
    for(let i = 1; i < (lines + 1); i++){
        let tax_inclusive_factor = 1 + tax_rate;
        let taxable_amount = line_entries[`row_${i}`].taxable_amount;
        let tax_exclusive_amount = taxable_amount / tax_inclusive_factor;
        let tax_amount = tax_exclusive_amount * tax_rate;
        let row_data = line_entries[`row_${i}`];
        if (document.querySelector(`#row_${i} #taxable`).value == 'yes'){
            //wrong tax calc, needs to have inclusive calc.
            console.log('updating taxable lines');
            row_data.tax = tax_amount;
            document.querySelector(`#row_${i} #tax`).value = row_data.tax;
            row_data.total = row_data.ext;
            document.querySelector(`#row_${i} #total`).value = row_data.total - row_data.disc;
        }else if(document.querySelector(`#row_${i} #taxable`).value == 'no'){
            console.log('updating non-taxable lines');
            row_data.tax = 0;
            document.querySelector(`#row_${i} #tax`).value = row_data.tax;
            row_data.total = row_data.ext;
            document.querySelector(`#row_${i} #total`).value = row_data.total - row_data.disc;
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
    document.querySelector('#total-sub').value = totals.sub_total;
    document.querySelector('#total-disc').value = totals.disc;
    document.querySelector('#total-tax').value = totals.tax;
    document.querySelector('#total-total').value = totals.total;
}
//needs to have variables grab values to update object instead of updating object directly from the row data in the table
function lineUpdate(update_line){
    console.log(`Updating Line ${update_line}`);
    //get qty value
    let qty_input = parseFloat(document.querySelector(`#row_${update_line} #qty`).value);
    line_entries[`row_${update_line}`].qty = qty_input;
    //get price value
    let price_input = parseFloat(document.querySelector(`#row_${update_line} #price`).value);
    line_entries[`row_${update_line}`].price = price_input;
    //calculate ext value & update table row with value
    let ext_input = qty_input * price_input;
    ext_input = parseFloat(ext_input.toFixed(2));
    line_entries[`row_${update_line}`].ext = ext_input;
    document.querySelector(`#row_${update_line} #ext`).value = ext_input;
    //get discount amount
    let disc_input = parseFloat(document.querySelector(`#row_${update_line} #discount`).value);
    line_entries[`row_${update_line}`].disc = disc_input;
    //calculate taxable amount
    let taxable = ext_input - disc_input;
    line_entries[`row_${update_line}`].taxable_amount = taxable;

    //check line is taxable, if it is set row tax rate
    if (document.querySelector(`#row_${update_line} #taxable`).value == 'yes'){
        let taxrate = parseFloat(document.querySelector('#tax-rate').value);
        taxrate = taxrate/100;
        let amountBeforeTaxFactor = 1 + taxrate;
        let taxedamount = line_entries[`row_${update_line}`].taxable_amount;
        let amountbeforetax = taxedamount/amountBeforeTaxFactor;
        let tax = amountbeforetax * taxrate;
        line_entries[`row_${update_line}`].tax = tax;
        document.querySelector(`#row_${update_line} #tax`).value = line_entries[`row_${update_line}`].tax;
    }else if(document.querySelector(`#row_${update_line} #taxable`).value == 'no'){
        line_entries[`row_${update_line}`].tax = 0;
        document.querySelector(`#row_${update_line} #tax`).value = line_entries[`row_${update_line}`].tax;
    };
    line_entries[`row_${update_line}`].total = line_entries[`row_${update_line}`].ext - line_entries[`row_${update_line}`].disc;
    document.querySelector(`#row_${update_line} #total`).value = line_entries[`row_${update_line}`].total;
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
    document.querySelector('#table-lines').innerHTML = '';
    document.querySelector('#total-sub').value = 0;
    document.querySelector('#total-disc').value = 0;
    document.querySelector('#total-tax').value = 0;
    document.querySelector('#total-total').value = 0;
    addRowElement();
};