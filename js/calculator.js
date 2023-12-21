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
}
//Add new lines without removing data.
function addRowElement(){
    //internal function for setting multiple attributes in a single call
    function setAttributes(el, attrs) {
        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
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
    const mat_taxable = $(document)[0].createElement("input");
    mat_taxable.setAttribute('type','checkbox');
    mat_taxable.setAttribute('id',`row_${number_of_lines}_mat`);
    mat_taxable.setAttribute('onchange', `booleanUpdate(${line},'mat')`);
    td_taxable.appendChild(mat_taxable);
    const serv_taxable = $(document)[0].createElement("input");
    serv_taxable.setAttribute('type','checkbox');
    serv_taxable.setAttribute('id',`row_${number_of_lines}_serv`);
    serv_taxable.setAttribute('onchange', `booleanUpdate(${line},'serv')`);
    td_taxable.appendChild(serv_taxable);
    const class_taxable = $(document)[0].createElement("input");
    class_taxable.setAttribute('type','checkbox');
    class_taxable.setAttribute('id',`row_${number_of_lines}_class`);
    class_taxable.setAttribute('onchange', `booleanUpdate(${line},'class')`);
    td_taxable.appendChild(class_taxable);
    trow.appendChild(td_taxable);
    //create new cell for global discount selection
    const discount_type = $(document)[0].createElement('td');
    const discount_selection = $(document)[0].createElement('input');
    setAttributes(discount_selection, {
        'type': 'number',
        'id': 'percent_discount',
        'onChange': `percentDiscountCalc(${number_of_lines})`
    });
    discount_type.appendChild(discount_selection);
    trow.appendChild(discount_type);
    // add row element to the existing table
    $('#table-lines')[0].appendChild(trow);
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
            'mat': false,
            'serv': false,
            'class': false
        }
    };
    $(`#row_${number_of_lines}_mat`)[0].checked = true;
    line_entries[`row_${number_of_lines}`].taxable.mat = true;
}
function booleanUpdate(x,y) {
    let row = line_entries[`row_${x}`];
    if($(`#row_${x}_${y}`)[0].checked){
        row.taxable[`${y}`] = true;
    } else {
        row.taxable[`${y}`] = false;
    }
    lineUpdate(x);
}
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
    }
    
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
    }
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
}
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
    }
    if(row.taxable.serv){
        let ts = parseFloat($(`#service-rate`)[0].value);
        ts = ts/100;
        row.tax.serv = row.taxable_amount * ts;
    } else{
        let t = 0;
        row.tax.serv = row.taxable_amount * t;
    }
    if(row.taxable.class){
        let tc = parseFloat($(`#class-rate`)[0].value);
        tc = tc/100;
        row.tax.class = row.taxable_amount * tc;
    } else{
        let t = 0;
        row.tax.class = row.taxable_amount * t;
    }
    row.tax.total = row.tax.mat + row.tax.serv + row.tax.class;
    $(`#row_${x} #tax`)[0].value = row.tax.total;
    line_entries[`row_${x}`].total = line_entries[`row_${x}`].ext - line_entries[`row_${x}`].disc + parseFloat(line_entries[`row_${x}`].tax.total.toFixed(2));
    $(`#row_${x} #total`)[0].value = line_entries[`row_${x}`].total;
    calcTotals();
    
}
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
    }
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
        }`;
        $('#break-totals textarea')[0].innerText = `${btotals}`;
    }
    //for taxes
    if(x=='lines'){
        let blines = '';
        let test = [1,2,3,4];
        for(let line in line_entries){
            blines = blines + `
            ${line} {
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
            }`;
        }
        console.log(blines);
        $('#break-lines textarea')[0].innerText = `${blines}`;
    }
}
function breakdown_display(x) {
    if(x=="totals"){
        $('div#break-lines')[0].classList = 'breakdown-hide';
        $('div#break-totals')[0].classList = 'breakdown-hide active';
        console.log('switched to totals');
    }
    if(x=="lines"){
        $('div#break-totals')[0].classList = 'breakdown-hide';
        $('div#break-lines')[0].classList = 'breakdown-hide active';
        console.log('switched to taxes');
    }
}
function shippingDisplay() {
    if($('select#shippingtaxed')[0].value == 'yes'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','');
    }
    if($('select#shippingtaxed')[0].value == 'no'){
        $('tr.subrow.ship-tax')[0].setAttribute('style','display: none');
    }
    calcTotals();
}
//calculating percantage discount
    //if a percentage is given to a line the discount box should become disabled to prevent direct editing and update the internal value to be the percentage discount calculated as EXT * {{discount_percentage}} rounded to 2 decimals
function percentDiscountCalc(row) {
    console.log(`Updating percent discount of row_${row}`);
    let linedisc = $(`#row_${row} #discount`)[0];
    let percentdisc = $(`#row_${row} #percent_discount`)[0];
    if(percentdisc.value === '0'|| percentdisc.value === ''){
        //true ? remove disable and set value to 0
        linedisc.removeAttribute('disabled');
        linedisc.value = '0';
    }else{
        //false ? disable discount field and enter calculated discount amount
        linedisc.setAttribute('disabled','true');
        //get ext value
        let ext = parseFloat($(`#row_${row} #ext`)[0].value);
        console.log(ext);
        let discval = ext * (parseFloat(percentdisc.value)/100);
        console.log(discval);
        linedisc.value = discval.toFixed(2);
    }
    //update row data once values are switched correctly
    lineUpdate(row);
    //need to dupate lineupdate function to calc discount if percentage applied
}