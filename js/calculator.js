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
    'shipping': 0,
    'tax': {
        'material':0,
        'service':0,
        'class':0,
        'total':0
    },
    'total': 0
};
//Add new lines without removing data.
function addRowElement(){
    //get row line number to make
    number_of_lines++;
    let line = number_of_lines;
    let new_row = $.parseHTML(`<tr id='row_${line}'><td><input type='number' id='qty' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='price' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='ext' value='0' disabled /></td><td><input type='number' id='discount' value='0' onchange='lineUpdate(${line})' /></td><td><input type='number' id='tax' value='0' disabled /></td><td><input type='number' id='total' value='0' disabled /></td><td><input type='checkbox' id='row_${line}_mat' onchange='booleanUpdate(${line}, "mat")' checked /><input type='checkbox' id='row_${line}_serv' onchange='booleanUpdate(${line}, "serv")' /><input type='checkbox' id='row_${line}_class' onchange='booleanUpdate(${line}, "class")' /></td><td><input type='number' id='percent_discount' onchange='lineUpdate(${line})' /></td></tr>`)[0];
    // add row element to the existing table
    $('#table-lines')[0].appendChild(new_row);
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
function booleanUpdate(x,y) {
    let row = line_entries[`row_${x}`];
    if($(`#row_${x}_${y}`)[0].checked){
        row.taxable[`${y}`] = true;
    } else {
        row.taxable[`${y}`] = false;
    }
    lineUpdate(x);
};
//sets a default first line
$(document).ready(function(){addRowElement();});
//test function for making more than one line at a time
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
function updateTax(){
    tm = parseFloat($('#material-rate')[0].value);
    tm = tm/100;
    ts = parseFloat($('#service-rate')[0].value);
    ts = ts/100;
    tc = parseFloat($('#class-rate')[0].value);
    tc = tc/100;
    let lines = number_of_lines;
    console.log('Material rate is ' + tm);
    console.log('Service rate is ' + ts);
    console.log('Class rate is ' + tc);
    for(let i = 1; i < (lines + 1); i++){
        console.log('updating lines');
        let z = line_entries[`row_${i}`];
        if (z.taxable.mat){
            z.tax.mat = tm * z.taxable_amount;
        } else if(!z.taxable.mat){
            z.tax.mat - 0 * z.taxable_amount;
        }
        if (z.taxable.serv){
            z.tax.serv = ts * z.taxable_amount;
        } else if(!z.taxable.serv){
            z.tax.serv - 0 * z.taxable_amount;
        }
        if (z.taxable.class){
            z.tax.class = tc * z.taxable_amount;
        } else if(!z.taxable.class){
            z.tax.class - 0 * z.taxable_amount;
        }
        z.tax.total = z.tax.mat + z.tax.serv + z.tax.class;
        z.total = z.taxable_amount + parseFloat(z.tax.total.toFixed(2));
        $(`#row_${i} #tax`)[0].value = z.tax.total;
        $(`#row_${i} #total`)[0].value = z.total;
    };
    calcTotals();
};
function calcTotals() {
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
    for (let line in line_entries) {
        totals.sub_total = totals.sub_total + parseFloat(line_entries[`${line}`].ext.toFixed(2));
        totals.disc = totals.disc + line_entries[`${line}`].disc;
        totals.tax.material = totals.tax.material + line_entries[`${line}`].tax.mat;
        totals.tax.service = totals.tax.service + line_entries[`${line}`].tax.serv;
        totals.tax.class = totals.tax.class + line_entries[`${line}`].tax.class;
    };
    
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
    $('#total-sub')[0].value = totals.sub_total;
    $('#total-disc')[0].value = totals.disc;
    $('#total-tax')[0].value = totals.tax.total;
    $('#total-total')[0].value = totals.total;
    $('#tax-material')[0].value = totals.tax.material;
    $('#tax-service')[0].value = totals.tax.service;
    $('#tax-class')[0].value = totals.tax.class;
};
function lineUpdate(x){
    let row = line_entries[`row_${x}`];
    console.log('Begin line update');
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
    //check for percent discount and update if necessary
    if($(`#row_${x} #percent_discount`)[0].value != '0' || $(`#row_${x} #percent_discount`)[0].value != ''){
        percentDiscountCalc(x);
    };
    //get discount amount
    let disc_input = parseFloat($(`#row_${x} #discount`)[0].value);
    line_entries[`row_${x}`].disc = disc_input;
    //calculate taxable amount
    let taxable = ext_input - disc_input;
    line_entries[`row_${x}`].taxable_amount = taxable;
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
    row.tax.total = row.tax.mat + row.tax.serv + row.tax.class;
    $(`#row_${x} #tax`)[0].value = row.tax.total;
    line_entries[`row_${x}`].total = line_entries[`row_${x}`].ext - line_entries[`row_${x}`].disc + parseFloat(line_entries[`row_${x}`].tax.total.toFixed(2));
    $(`#row_${x} #total`)[0].value = line_entries[`row_${x}`].total;
    calcTotals();
};
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
function displayBreakdown(x) {
    //for totals
    console.log(x);
    if(x=='totals' && $('select#shippingtaxed')[0].value == 'yes'){
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
    }else if(x=='totals' && $('select#shippingtaxed')[0].value == 'no'){
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
    if(x=='lines'){
        let blines = '';
        let test = [1,2,3,4];
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
function shippingDisplay() {
    if($('select#shippingtaxed')[0].value == 'yes'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','');
    };
    if($('select#shippingtaxed')[0].value == 'no'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','display: none');
    };
    calcTotals();
};
//calculating percantage discount
    //if a percentage is given to a line the discount box should become disabled to prevent direct editing and update the internal value to be the percentage discount calculated as EXT * {{discount_percentage}} rounded to 2 decimals
function percentDiscountCalc(row) {
    console.log(`Updating percent discount of row_${row}`);
    let linedisc = $(`#row_${row} #discount`)[0];
    let percentdisc = $(`#row_${row} #percent_discount`)[0];
    if(percentdisc.value === '0'|| percentdisc.value === ''){
        //true ? remove disable and set value to 0
        linedisc.removeAttribute('disabled');
    }else{
        //false ? disable discount field and enter calculated discount amount
        linedisc.setAttribute('disabled','true');
        //get ext value
        let ext = parseFloat($(`#row_${row} #ext`)[0].value);
        //calculate discount value
        let discval = ext * (parseFloat(percentdisc.value)/100);
        //set discount value to row discount rounded to 2 decimals
        linedisc.value = discval.toFixed(2);
    };
};
//add rows to rate table by type
function addNewRate(type, direction){
    if(direction === 'increase'){
        $(`table#rates-breakdown tbody td#${type} ul`)[0].appendChild($.parseHTML(`<li><input value="0" /></li>`)[0]);
    };
    if(direction === 'decrease'){
        $(`table#rates-breakdown tbody td#${type} ul li`).last().remove();
    }
}