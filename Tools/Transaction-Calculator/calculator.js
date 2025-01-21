//sets beta flag data as on or off by default
let complex_tax = false;
//beta flag end
//set variable to track the number of lines
const number_of_lines = 0;
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
const line_entries = {};
//set object to hold data for transaction totals
const totals = {
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
const taxRates = {
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
    let new_row = $.parseHTML(`<tr id='row_${line}'><td><input type='number' id='qty' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='price' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='ext' value='0' disabled /></td><td><input type='number' id='discount' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='tax' value='0' disabled /></td><td><input type='number' id='total' value='0' disabled /></td><td><input type='checkbox' id='row_${line}_mat' onchange='booleanUpdate(${line}, "mat")' checked /><input type='checkbox' id='row_${line}_serv' onchange='booleanUpdate(${line}, "serv")' /><input type='checkbox' id='row_${line}_class' onchange='booleanUpdate(${line}, "class")' /></td><td><input type='number' id='percent_discount' onchange='lineUpdate(${line})' /></td></tr>`)[0];
    // add row element to the existing table
    $('#table-lines')[0].appendChild(new_row);
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
    if($(`#row_${row_line}_${tax_jusisdiction}`)[0].checked){
        row.taxable[`${tax_jusisdiction}`] = true;
    } else {
        row.taxable[`${tax_jusisdiction}`] = false;
    }
    lineUpdate(row_line);
};
//sets a default first line on page load
$(document).ready(function(){addRowElement();});
/*function for making more than one line at a time*/
function multiLineAdd() {
    let x = $('#lines-to-add')[0].value;
    if (x == ''){
        addRowElement();
    console.log('Added 1 Line');
    }else if(x != '') {
        x = parseInt($('#lines-to-add')[0].value);
        for (i = 0; i < x; i++){
            addRowElement();
        };
        console.log(`Added ${x} Lines`);
    };
};
/*function updates the used tax rates to match any changes made by the user*/
function updateTax(){
    if(complex_tax){//if complex_tax is enabled, set the tax rates as equal to the rate object
        tm = taxRates.material;
        ts = taxRates.service;
        tc = taxRates.class;
    } else {//else get the tax value from the tax box, divided by 100 to make a decimal
        tm = parseFloat($('#material-rate')[0].value);
        tm = tm/100;
        ts = parseFloat($('#service-rate')[0].value);
        ts = ts/100;
        tc = parseFloat($('#class-rate')[0].value);
        tc = tc/100;
    };
    let lines = number_of_lines;
    //loop through all existing lines in the calculation table to update the tax amount for each
    for(let i = 1; i < (lines + 1); i++){
        console.log('updating lines');
        //get current lines data
        let z = line_entries[`row_${i}`];
        //get tax jurisdictions for line that are applicable
        if (z.taxable.mat){
            if(complex_tax){
                //zero out current tax amount
                z.tax.mat = 0;
                //loop through rates given and increase tax amount by each
                for(var rate in tm){
                    z.tax.mat += tm[rate] * z.taxable_amount
                }
            } else {
                z.tax.mat = tm * z.taxable_amount;
            }
        } else if(!z.taxable.mat){
            z.tax.mat - 0 * z.taxable_amount;
        }
        if (z.taxable.serv){
            if(complex_tax){
                //zero out current tax amount
                z.tax.serv = 0;
                //loop through rates given and increase tax amount by each
                for(var rate in ts){
                    z.tax.serv += ts[rate] * z.taxable_amount
                }
            } else {
                z.tax.serv = ts * z.taxable_amount;
            }
        } else if(!z.taxable.serv){
            z.tax.serv - 0 * z.taxable_amount;
        }
        if (z.taxable.class){
            if(complex_tax){
                //zero out current tax amount
                z.tax.class = 0;
                //loop through rates given and increase tax amount by each
                for(var rates in tc){
                    z.tax.class += ts[rate] * z.taxable_amount;
                }
            } else {
                z.tax.class = tc * z.taxable_amount;
            }
        } else if(!z.taxable.class){
            z.tax.class - 0 * z.taxable_amount;
        }
        //update line totals
        z.tax.total = z.tax.mat + z.tax.serv + z.tax.class;
        z.total = z.taxable_amount + parseFloat(z.tax.total.toFixed(2));
        $(`#row_${i} #tax`)[0].value = z.tax.total;
        $(`#row_${i} #total`)[0].value = z.total;
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
    if($('select#shippingtaxed')[0].value == 'yes'){
        let rate = parseFloat($('#material-rate')[0].value);
        rate = rate/100;
        let shipping = parseFloat($('input#shipping')[0].value);
        let taxamount = shipping * rate;
        taxamount = parseFloat(taxamount.toFixed(2));
        totals.tax.shipping = taxamount;
        $('#tax-shipping')[0].value = totals.tax.shipping;
    }else{
        $('#tax-shipping')[0].value = 0
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
    totals.shipping = parseFloat($('#shipping')[0].value);
    totals.total = totals.total + totals.shipping;
    //update totals table with new data for user visibility
    $('#total-sub')[0].value = totals.sub_total;
    $('#total-disc')[0].value = totals.disc;
    $('#total-tax')[0].value = totals.tax.total;
    $('#total-total')[0].value = totals.total;
    $('#tax-material')[0].value = totals.tax.material;
    $('#tax-service')[0].value = totals.tax.service;
    $('#tax-class')[0].value = totals.tax.class;
};
function lineUpdate(line_number){
    let row = line_entries[`row_${line_number}`];
    console.log('Begin line update');
    //get qty value
    let qty_input = parseFloat($(`#row_${line_number} #qty`)[0].value);
    line_entries[`row_${line_number}`].qty = qty_input;
    //get price value
    let price_input = parseFloat($(`#row_${line_number} #price`)[0].value);
    line_entries[`row_${line_number}`].price = price_input;
    //calculate ext value & update table row with value
    let ext_input = qty_input * price_input;
    ext_input = parseFloat(ext_input.toFixed(2));
    line_entries[`row_${line_number}`].ext = ext_input;
    $(`#row_${line_number} #ext`)[0].value = ext_input;
    //check for percent discount and update if necessary
    if($(`#row_${line_number} #percent_discount`)[0].value != '0' && $(`#row_${line_number} #percent_discount`)[0].value != ''){
        percentDiscountCalc(line_number);
    };
    //get discount amount
    let disc_input = parseFloat($(`#row_${line_number} #discount`)[0].value);
    line_entries[`row_${line_number}`].disc = disc_input;
    //calculate taxable amount
    let taxable = ext_input - disc_input;
    line_entries[`row_${line_number}`].taxable_amount = taxable;
    //check jurisdictions, update tax amount
    if(row.taxable.mat){
        let tm = parseFloat($(`#material-rate`)[0].value);
        tm = tm/100;
        row.tax.mat = row.taxable_amount * tm;
    } else{
        let t = 0;
        row.tax.mat = row.taxable_amount * t;
    };
    if(row.taxable.serv){
        let ts = parseFloat($(`#service-rate`)[0].value);
        ts = ts/100;
        row.tax.serv = row.taxable_amount * ts;
    } else{
        let t = 0;
        row.tax.serv = row.taxable_amount * t;
    };
    if(row.taxable.class){
        let tc = parseFloat($(`#class-rate`)[0].value);
        tc = tc/100;
        row.tax.class = row.taxable_amount * tc;
    } else{
        let t = 0;
        row.tax.class = row.taxable_amount * t;
    };
    //calculate row totals and update row
    row.tax.total = row.tax.mat + row.tax.serv + row.tax.class;
    $(`#row_${line_number} #tax`)[0].value = row.tax.total;
    line_entries[`row_${line_number}`].total = line_entries[`row_${line_number}`].ext - line_entries[`row_${line_number}`].disc + parseFloat(line_entries[`row_${line_number}`].tax.total.toFixed(2));
    $(`#row_${line_number} #total`)[0].value = line_entries[`row_${line_number}`].total;
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
    $('#table-lines')[0].innerHTML = '';
    $('#total-sub')[0].value = 0;
    $('#total-disc')[0].value = 0;
    $('#total-tax')[0].value = 0;
    $('#total-total')[0].value = 0;
    addRowElement();
    $('#material-rate')[0].value = 0;
    $('#service-rate')[0].value = 0;
    $('#class-rate')[0].value = 0;
    console.clear();
    console.log('Values have been reset');
};
/*function updates text area box with raw object data for either lines or totals*/
function displayBreakdown(x) {
    //for totals
    console.log(x);
    if(x==='totals' && $('select#shippingtaxed')[0].value === 'yes'){
        let btotals = `Totals {
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
        $('#break-totals textarea')[0].innerText = `${btotals}`;
    }else if(x==='totals' && $('select#shippingtaxed')[0].value === 'no'){
        let btotals = `Totals {
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
        $('#break-totals textarea')[0].innerHTML = btotals;
    };
    //for taxes
    if(x==='lines'){
        let blines = '';
        for(let line in line_entries){
            blines += `${line} {
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
        console.log(blines);
        $('#break-lines textarea')[0].innerHTML = blines;
    };
};
/*funciton controls if text area for raw data is displaying info for lines or totals*/
function breakdown_display(x) {
    if(x=="totals"){
        $('div#break-lines')[0].classList = 'breakdown-hide';
        $('div#break-totals')[0].classList = 'breakdown-hide active';
        console.log('switched to totals');
    };
    if(x=="lines"){
        $('div#break-totals')[0].classList = 'breakdown-hide';
        $('div#break-lines')[0].classList = 'breakdown-hide active';
        console.log('switched to taxes');
    };
};
/*updates totals area to display shipping tax or hide it*/
function shippingDisplay() {
    if($('select#shippingtaxed')[0].value == 'yes'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','');
    };
    if($('select#shippingtaxed')[0].value == 'no'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','display: none');
    };
    //runs function to calculate transaction totals since there has been a change
    calcTotals();
};
//calculating percantage discount
//if a percentage is given to a line the discount box should become disabled to prevent direct editing and update the internal value to be the percentage discount calculated as EXT * {{discount_percentage}} rounded to 2 decimals
function percentDiscountCalc(row) {
    console.log(`Updating percent discount of row_${row}`);
    let linedisc = $(`#row_${row} #discount`)[0];
    let percentdisc = $(`#row_${row} #percent_discount`)[0];
    if(percentdisc.value === '0' || percentdisc.value === ''){
        //if percent discount value is 0 or blank set discount box as editable
        linedisc.removeAttribute('disabled');
    }else{
        //else mark discount box as non-editable and calculate the discount amount and enter it in the box
        linedisc.setAttribute('disabled','true');
        //get ext value
        let ext = parseFloat($(`#row_${row} #ext`)[0].value);
        //calculate discount value
        let discval = ext * (parseFloat(percentdisc.value)/100);
        //set discount value to row discount rounded to 2 decimals
        linedisc.value = discval.toFixed(2);
    };
};
/*add rows to rate table by type to complex tax rate table*/
function addNewRate(type, direction){
    if(direction === 'increase'){
        $(`table#rates-breakdown tbody td#${type} ul`)[0].appendChild($.parseHTML(`<li><input value="0" /></li>`)[0]);
    };
    if(direction === 'decrease'){
        $(`table#rates-breakdown tbody td#${type} ul li`).last().remove();
    }
};
/*funciton updates total tax rate based on total rates per column in complex tax table*/
function updateTaxRates(){
    //get each ul for complex tax columns
    let rate_list = $('table#rates-breakdown tbody tr td > ul');
    //go through each ul element and compile rates value
    rate_list.each(function (index){
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
        $(`input#${rate_type}-rate`)[0].value = temp_rate;
    };
    console.log('Rates Updated');
    console.log(taxRates);
    $('.tax-rate-container').addClass('hide');
    //needs to update lines after saving new rates
    updateTax();
};
/*function is used to change the way that taxes rates are edited and listed*/
async function enableComplexTax() {
    //this will chnage the way it's entered and can't go back. Confirm with user their intention before proceeding
    if(await customDialogResponse('This will change the way taxes are calculated until the page is refreshed. Are you sure you want to continue?','Yes','No')){
        complex_tax = true;
        $('.tax-rate-container').removeClass('hide');
        $('#tax-rates tbody tr:nth-child(2) input').attr('disabled', 'true');
        $('#tax-rates thead input').attr('onclick', `$('.tax-rate-container').removeClass('hide')`);
    }
}