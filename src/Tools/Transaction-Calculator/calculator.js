//sets beta flag data as on or off by default
let complex_tax = false;
//beta flag end
//set variable to track the number of lines
let number_of_lines = 0;
//set template object to be used for other builders
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
//set object to hold data for lines as they get created
let line_entries = {};
//set object to hold data for transaction totals
let totals = {
    'sub_total': 0,
    'disc': 0,
    'shipping': 0,
    'tax': {
        'material':0,
        'service':0,
        'class':0,
        'total':0
    },
    'total': 0
};
//set object to hold tax rates for complex tax rate usage
let taxRates = {
    material: {
        '1': 0
    },
    service: {
        '1': 0
    },
    class: {
        '1': 0
    }
};
//Add new lines without removing data.
function addRowElement(){
    //get row line number to make
    number_of_lines++;
    let line = number_of_lines;
    //create new html element to be added to the table
    let new_row = `<tr id='row_${line}'><td><input type='number' id='qty' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='price' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='ext' value='0' disabled /></td><td><input type='number' id='discount' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='tax' value='0' disabled /></td><td><input type='number' id='total' value='0' disabled /></td><td><input type='checkbox' id='row_${line}_mat' onchange='booleanUpdate(${line}, "mat")' checked /><input type='checkbox' id='row_${line}_serv' onchange='booleanUpdate(${line}, "serv")' /><input type='checkbox' id='row_${line}_class' onchange='booleanUpdate(${line}, "class")' /></td><td><input type='number' id='percent_discount' onchange='lineUpdate(${line})' /></td></tr>`;
    // add row element to the existing table
    document.getElementById('table-lines').insertAdjacentHTML('beforeend', new_row);
    //update line_entries object to track new lines data
    line_entries[`row_${number_of_lines}`] = {
        "qty": 0,
        "price": 0,
        "ext": 0,
        "disc": 0,
        "tax": {
            'mat': 0,
            'serv': 0,
            'class': 0,
            'total':0
        },
        "taxable_amount": 0,
        "total": 0,
        "taxable":{
            'mat': true,
            'serv': false,
            'class': false
        }
    };
};
/*updates individual lines for which tax jurisdictions are assigned, updates the line_entries object for the specific line to update which jurisdictions are applicable*/
function booleanUpdate(row_line,tax_jusisdiction) {
    let row = line_entries[`row_${row_line}`];
    if(document.querySelector(`#row_${row_line}_${tax_jusisdiction}`).checked){
        row.taxable[`${tax_jusisdiction}`] = true;
    } else {
        row.taxable[`${tax_jusisdiction}`] = false;
    }
    lineUpdate(row_line);
};
//sets a default first line on page load
document.addEventListener("DOMContentLoaded", function(){addRowElement();});
/*function for making more than one line at a time*/
function multiLineAdd() {
    let number_of_lines_to_add = document.getElementById('lines-to-add').value;
    if (number_of_lines_to_add == ''){
        addRowElement();
    console.log('Added 1 Line');
    }else if(number_of_lines_to_add != '') {
        number_of_lines_to_add = parseInt(document.getElementById('lines-to-add').value);
        for (i = 0; i < number_of_lines_to_add; i++){
            addRowElement();
        };
        console.log(`Added ${number_of_lines_to_add} Lines`);
    };
};
/*function updates the used tax rates to match any changes made by the user*/
function updateTax(){
    if(complex_tax){//if complex_tax is enabled, set the tax rates as equal to the rate object
        materialTax = taxRates.material;
        serviceTax = taxRates.service;
        classTax = taxRates.class;
    } else {//else get the tax value from the tax box, divided by 100 to make a decimal
        materialTax = parseFloat(document.getElementById('material-rate').value);
        materialTax = materialTax/100;
        serviceTax = parseFloat(document.getElementById('service-rate').value);
        serviceTax = serviceTax/100;
        classTax = parseFloat(document.getElementById('class-rate').value);
        classTax = classTax/100;
    };
    let lines = number_of_lines;
    //loop through all existing lines in the calculation table to update the tax amount for each
    for(let i = 1; i < (lines + 1); i++){
        console.log('updating lines');
        //get current lines data
        let line_data = line_entries[`row_${i}`];
        //get tax jurisdictions for line that are applicable
        if (line_data.taxable.mat){
            if(complex_tax){
                //zero out current tax amount
                line_data.tax.mat = 0;
                //loop through rates given and increase tax amount by each
                for(var rate in materialTax){
                    line_data.tax.mat += materialTax[rate] * line_data.taxable_amount
                }
            } else {
                line_data.tax.mat = materialTax * line_data.taxable_amount;
            }
        } else if(!line_data.taxable.mat){
            line_data.tax.mat - 0 * line_data.taxable_amount;
        }
        if (line_data.taxable.serv){
            if(complex_tax){
                //zero out current tax amount
                line_data.tax.serv = 0;
                //loop through rates given and increase tax amount by each
                for(var rate in serviceTax){
                    line_data.tax.serv += serviceTax[rate] * line_data.taxable_amount
                }
            } else {
                line_data.tax.serv = serviceTax * line_data.taxable_amount;
            }
        } else if(!line_data.taxable.serv){
            line_data.tax.serv - 0 * line_data.taxable_amount;
        }
        if (line_data.taxable.class){
            if(complex_tax){
                //zero out current tax amount
                line_data.tax.class = 0;
                //loop through rates given and increase tax amount by each
                for(var rates in serviceTax){
                    line_data.tax.class += serviceTax[rate] * line_data.taxable_amount;
                }
            } else {
                line_data.tax.class = serviceTax * line_data.taxable_amount;
            }
        } else if(!line_data.taxable.class){
            line_data.tax.class - 0 * line_data.taxable_amount;
        }
        //update line totals
        line_data.tax.total = line_data.tax.mat + line_data.tax.serv + line_data.tax.class;
        line_data.total = line_data.taxable_amount + parseFloat(line_data.tax.total.toFixed(2));
        document.querySelector(`#row_${i} #tax`).value = line_data.tax.total;
        document.querySelector(`#row_${i} #total`).value = line_data.total;
    };
    //run function to calculat transaction totals
    calcTotals();
};
/*funciton to calculate the transactions totals, also updates the totals table for user visibility*/
function calcTotals() {
    //clear totals to start from scratch
    totals = {
        'sub_total': 0,
        'disc': 0,
        'tax': {
            'material':0,
            'service':0,
            'class':0,
            'shipping':0,
            'total':0
        },
        'total': 0
    };
    //loop through each line and add each lines data to the transaction totals
    for (let line in line_entries) {
        totals.sub_total = totals.sub_total + parseFloat(line_entries[`${line}`].ext.toFixed(2));
        totals.disc = totals.disc + line_entries[`${line}`].disc;
        totals.tax.material = totals.tax.material + line_entries[`${line}`].tax.mat;
        totals.tax.service = totals.tax.service + line_entries[`${line}`].tax.serv;
        totals.tax.class = totals.tax.class + line_entries[`${line}`].tax.class;
    };
    //calculate shipping tax if necessary
    if(document.querySelector('select#shippingtaxed').value == 'yes'){
        let rate = parseFloat(document.querySelector('#material-rate').value);
        rate = rate/100;
        let shipping = parseFloat(document.querySelector('input#shipping').value);
        let taxamount = shipping * rate;
        taxamount = parseFloat(taxamount.toFixed(2));
        totals.tax.shipping = taxamount;
        document.querySelector('#tax-shipping').value = totals.tax.shipping;
    }else{
        document.querySelector('#tax-shipping').value = 0
    };
    //compile and round totals data
    totals.sub_total = parseFloat(totals.sub_total.toFixed(2));
    totals.tax.material = parseFloat(totals.tax.material.toFixed(2));
    totals.tax.service = parseFloat(totals.tax.service.toFixed(2));
    totals.tax.class = parseFloat(totals.tax.class.toFixed(2));
    totals.tax.total = totals.tax.material + totals.tax.service + totals.tax.class + totals.tax.shipping;
    totals.tax.total = parseFloat(totals.tax.total.toFixed(2));
    totals.tax.total = parseFloat(totals.tax.total.toFixed(2));
    totals.total = totals.sub_total - totals.disc + totals.tax.total;
    totals.total = parseFloat(totals.total.toFixed(2));
    totals.shipping = parseFloat(document.querySelector('input#shipping').value);
    totals.total = totals.total + totals.shipping;
    //update totals table with new data for user visibility
    document.querySelector('#total-sub').value = totals.sub_total;
    document.querySelector('#total-disc').value = totals.disc;
    document.querySelector('#total-tax').value = totals.tax.total;
    document.querySelector('#total-total').value = totals.total;
    document.querySelector('#tax-material').value = totals.tax.material;
    document.querySelector('#tax-service').value = totals.tax.service;
    document.querySelector('#tax-class').value = totals.tax.class;
};
function lineUpdate(line_number){
    let row = line_entries[`row_${line_number}`];
    console.log('Begin line update');
    //get qty value
    let qty_input = parseFloat(document.querySelector(`#row_${line_number} #qty`).value);
    line_entries[`row_${line_number}`].qty = qty_input;
    //get price value
    let price_input = parseFloat(document.querySelector(`#row_${line_number} #price`).value);
    line_entries[`row_${line_number}`].price = price_input;
    //calculate ext value & update table row with value
    let ext_input = qty_input * price_input;
    ext_input = parseFloat(ext_input.toFixed(2));
    line_entries[`row_${line_number}`].ext = ext_input;
    document.querySelector(`#row_${line_number} #ext`).value = ext_input;
    //check for percent discount and update if necessary
    if(document.querySelector(`#row_${line_number} #percent_discount`).value != '0' && document.querySelector(`#row_${line_number} #percent_discount`).value != ''){
        percentDiscountCalc(line_number);
    };
    //get discount amount
    let disc_input = parseFloat(document.querySelector(`#row_${line_number} #discount`).value);
    line_entries[`row_${line_number}`].disc = disc_input;
    //calculate taxable amount
    let taxable = ext_input - disc_input;
    line_entries[`row_${line_number}`].taxable_amount = taxable;
    //check jurisdictions, update tax amount
    if(row.taxable.mat){
        let materialTax = parseFloat(document.querySelector('#material-rate').value);
        materialTax = materialTax/100;
        row.tax.mat = row.taxable_amount * materialTax;
    } else{
        let t = 0;
        row.tax.mat = row.taxable_amount * t;
    };
    if(row.taxable.serv){
        let serviceTax = parseFloat(document.querySelector('#service-rate').value);
        serviceTax = serviceTax/100;
        row.tax.serv = row.taxable_amount * serviceTax;
    } else{
        let t = 0;
        row.tax.serv = row.taxable_amount * t;
    };
    if(row.taxable.class){
        let serviceTax = parseFloat(document.querySelector('#class-rate').value);
        serviceTax = serviceTax/100;
        row.tax.class = row.taxable_amount * serviceTax;
    } else{
        let t = 0;
        row.tax.class = row.taxable_amount * t;
    };
    //calculate row totals and update row
    row.tax.total = row.tax.mat + row.tax.serv + row.tax.class;
    document.querySelector(`#row_${line_number} #tax`).value = row.tax.total;
    line_entries[`row_${line_number}`].total = line_entries[`row_${line_number}`].ext - line_entries[`row_${line_number}`].disc + parseFloat(line_entries[`row_${line_number}`].tax.total.toFixed(2));
    document.querySelector(`#row_${line_number} #total`).value = line_entries[`row_${line_number}`].total;
    //run function to update transaction totals since we have new line totals
    calcTotals();
};
/*function resets all data to be empty like freshly loading the page*/
function reset() {
    line_entries = {};
    number_of_lines = 0;
    totals = {
        'sub_total': 0,
        'disc': 0,
        'tax': {
            'material':0,
            'service':0,
            'class':0,
            'total':0
        },
        'total': 0
    };
    document.querySelector('#table-lines').innerHTML = '';
    document.querySelector('#total-sub').value = 0;
    document.querySelector('#total-disc').value = 0;
    document.querySelector('#total-tax').value = 0;
    document.querySelector('#total-total').value = 0;
    addRowElement();
    document.querySelector('#material-rate').value = 0;
    document.querySelector('#service-rate').value = 0;
    document.querySelector('#class-rate').value = 0;
    console.clear();
    console.log('Values have been reset');
};
/*function updates text area box with raw object data for either lines or totals*/
function displayBreakdown(breakdown_type) {
    //for totals
    console.log(breakdown_type);
    if(breakdown_type==='totals' && document.querySelector('select#shippingtaxed').value === 'yes'){
        let breakdown_totals = `Totals {
            SubTotal: ${totals.sub_total}
            Discount: ${totals.disc}
            Shipping: ${totals.shipping}
            Tax: {
                Material: ${totals.tax.material}
                Service: ${totals.tax.service}
                Class: ${totals.tax.class}
                Shipping: ${totals.tax.shipping}
                Total: ${totals.tax.total}
            }
            Total: ${totals.total}
        }`;
        document.querySelector('#break-totals textarea').innerText = `${breakdown_totals}`;
    }else if(breakdown_type==='totals' && document.querySelector('select#shippingtaxed').value === 'no'){
        let breakdown_totals = `Totals {
    SubTotal: ${totals.sub_total}
    Discount: ${totals.disc}
    Shipping: ${totals.shipping}
    Tax: {
        Material: ${totals.tax.material}
        Service: ${totals.tax.service}
        Class: ${totals.tax.class}
        Total: ${totals.tax.total}
    }
    Total: ${totals.total}
}
`;
        document.querySelector('#break-totals textarea').innerHTML = breakdown_totals;
    };
    //for taxes
    if(breakdown_type==='lines'){
        let breakdown_lines = '';
        for(let line in line_entries){
            breakdown_lines += `${line} {
Price: ${line_entries[line].price}
Quantity: ${line_entries[line].qty}
Ext Price: ${line_entries[line].ext}
Discount: ${line_entries[line].disc}
taxable_amount: ${line_entries[line].taxable_amount}
tax: {
    Mat: ${line_entries[line].tax.mat}
    Serv: ${line_entries[line].tax.serv}
    Class: ${line_entries[line].tax.class}
    Total: ${line_entries[line].tax.total}
}
total: ${line_entries[line].total}
}
`;
        };
        console.log(breakdown_lines);
        document.querySelector('#break-lines textarea').innerHTML = breakdown_lines;
    };
};
/*funciton controls if text area for raw data is displaying info for lines or totals*/
function breakdown_display(breakdown_type) {
    if(breakdown_type=="totals"){
        document.querySelector('div#break-lines').classList.toggle('active');
        document.querySelector('div#break-totals').classList.toggle('active');
        console.log('switched to totals');
    };
    if(breakdown_type=="lines"){
        document.querySelector('div#break-totals').classList.toggle('active');
        document.querySelector('div#break-lines').classList.toggle('active');
        console.log('switched to taxes');
    };
};
/*updates totals area to display shipping tax or hide it*/
function shippingDisplay() {
    if(document.querySelector('select#shippingtaxed').value == 'yes'){
        document.querySelector('tr.subrow.ship-tax').style.display = '';
    };
    if(document.querySelector('select#shippingtaxed').value == 'no'){
        document.querySelector('tr.subrow.ship-tax').style.display = 'none';
    };
    //runs function to calculate transaction totals since there has been a change
    calcTotals();
};
//calculating percantage discount
//if a percentage is given to a line the discount box should become disabled to prevent direct editing and update the internal value to be the percentage discount calculated as EXT * {{discount_percentage}} rounded to 2 decimals
function percentDiscountCalc(row) {
    console.log(`Updating percent discount of row_${row}`);
    let linedisc = document.querySelector(`#row_${row} #discount`);
    let percentdisc = document.querySelector(`#row_${row} #percent_discount`);
    if(percentdisc.value === '0' || percentdisc.value === ''){
        //if percent discount value is 0 or blank set discount box as editable
        linedisc.removeAttribute('disabled');
    }else{
        //else mark discount box as non-editable and calculate the discount amount and enter it in the box
        linedisc.setAttribute('disabled','true');
        //get ext value
        let ext = parseFloat(document.querySelector(`#row_${row} #ext`).value);
        //calculate discount value
        let discval = ext * (parseFloat(percentdisc.value)/100);
        //set discount value to row discount rounded to 2 decimals
        linedisc.value = discval.toFixed(2);
    };
};
/*add rows to rate table by type to complex tax rate table*/
function addNewRate(type, direction){
    if(direction === 'increase'){
        document.querySelector(`table#rates-breakdown tbody td#${type} ul`).insertAdjacentHTML('beforeend',`<li><input value="0" /></li>`);
    };
    if(direction === 'decrease'){
        document.querySelector(`table#rates-breakdown tbody td#${type} ul li:last-child`).remove();
    };
};
/*funciton updates total tax rate based on total rates per column in complex tax table*/
function updateTaxRates(){
    //get each ul for complex tax columns
    let rate_list = document.querySelectorAll('table#rates-breakdown tbody tr td > ul');
    //go through each ul element and compile rates value
    rate_list.forEach(function (ul,index){
        let rate_option;
        switch (index) {
            case 0:
                rate_option = 'material';
                break;
            case 1:
                rate_option = 'service';
                break;
            case 2:
                rate_option = 'class';
                break;
            default:
                break;
        };
        //get all input options for tax column
        let list = rate_list[index].querySelectorAll('li > input');
        //empties current tax rates so new ones can be saved
        taxRates[rate_option] = {};
        if(list.length < 1){//if no option listed set rate to zero
            taxRates[rate_option][1] = 0;
        }else{//else get correct rate values
            for(i=0;i<list.length;i++){
                taxRates[rate_option][i+1] = parseFloat(list[i].value)/100;
            };
        };
    });
    for(const rate_type in taxRates){
        let temp_rate = 0;
        for(const type_row in taxRates[rate_type]){
            temp_rate += taxRates[rate_type][type_row];
        };
        temp_rate = temp_rate * 100;
        document.querySelector(`input#${rate_type}-rate`).value = temp_rate;
    };
    console.log('Rates Updated');
    console.log(taxRates);
    document.querySelector('.tax-rate-container').classList.add('hide');
    //needs to update lines after saving new rates
    updateTax();
};
/*function is used to change the way that taxes rates are edited and listed*/
async function enableComplexTax() {
    //this will chnage the way it's entered and can't go back. Confirm with user their intention before proceeding
    let custom_dialogue = await import('/Rain-Support-Tools/src/modules/custom-dialogue/dialog-ctrl.js');
    if(await custom_dialogue.default('This will change the way taxes are calculated until the page is refreshed. Are you sure you want to continue?','Yes','No')){
        complex_tax = true;
        document.querySelector('.tax-rate-container').classList.remove('hide');
        document.querySelectorAll('#tax-rates tbody tr:nth-child(2) input').forEach(element => {
            element.setAttribute('disabled', 'true');
        });
        document.querySelector('#tax-rates thead input').setAttribute('onclick', `document.querySelector('.tax-rate-container').classList.remove('hide')`);
    }
}