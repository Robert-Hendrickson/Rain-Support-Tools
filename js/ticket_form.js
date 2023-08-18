//set regex value to be checked against
let regex_na = new RegExp('^(n|N)\/*(a|A)');
let regex_local_path = new RegExp('^file:.*(Users)*(Screenpresso)*');
function reset() {
    $('#error-borders')[0].innerHTML =''
    $('#steps_input td:last-child button')[0].removeAttribute('style');
    $('#input_error')[0].classList = '';
    var reset_values = ["crm_input", "system_input", "description_input", "example_input", "expectation_input", "console_input"]
    for(let i = 0; i < reset_values.length; i++){
        let remove = reset_values[i];
        $(`#${remove}`)[0].value = '';
    };
    //reset steps table
    console.log('resetting steps');
    $('#steps-table table tbody').remove();
    let steps_reset = $(document)[0].createElement('tbody')
    $('#steps-table table')[0].appendChild(steps_reset);
    for(i=0;i<3;i++){
        newRow('steps-table');
    };
    $('#number-of-steps')[0].innerText = 'None';
    //reset screenshot table
    console.log('resetting screenshot list');
    $('#screenshot-table table tbody').remove();
    let screenshot_reset = $(document)[0].createElement('tbody')
    $('#screenshot-table table')[0].appendChild(screenshot_reset);
    newRow('screenshot-table');
    console.log("resetting videolist")
    $('#video-table table tbody').remove();
    let video_reset = $(document)[0].createElement('tbody')
    $('#video-table table')[0].appendChild(video_reset);
    newRow('video-table');
    let base_ticket = `**LOCATION:**
Store ID:

System Area:

Can you recreate the problem on your demo site (if yes please continue, if no use the "Bug - non reproducible" macro)?

STEPS TO REPRODUCE:
1.
2.
3.

ACTUAL RESULTS:(Please be as detailed as possible.)

Description:

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)

Screenshot:

Video:

EXPECTED RESULTS:

CONSOLE ERRORS:`;
    $('#bug-glitch-ticket')[0].value = base_ticket;
    $('div.reset-popup')[0].setAttribute('style','display: none;');
};
let ticket_output = '';
let entered_info = '';
let split_info = '';
let replicable_steps = '';
let output_example = '';
let screenshot_output = '';
let video_output = '';
function steps_check(){
    if($('#steps-table tbody tr').length > 0 && $('#steps-table tbody tr td:last-child input')[0].value != '' && !regex_na.test($('#steps-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    }
}
function screenshot_check(){
    if($('#screenshot-table tbody tr').length > 0 && $('#screenshot-table tbody tr td:last-child input')[0].value != '' && !regex_na.test($('#screenshot-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    }
}
function video_check(){
    if($('#video-table tbody tr').length > 0 && $('#video-table tbody tr td:last-child input')[0].value != '' && !regex_na.test($('#video-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    }
}
function checkInputs() {
    var inputs = {
        "crm": $('#crm_input')[0].value,
        "area": $('#system_input')[0].value,
        "replicable": $('#replicable_input')[0].value,
        "steps": steps_check(),
        "description": $('#description_input')[0].value,
        "example": $('#example_input')[0].value,
        "screenshots": screenshot_check(),
        "videos": video_check(),
        "expectation": $('#expectation_input')[0].value,
        "console": $('#console_input')[0].value
    };
    if(inputs.crm && inputs.area && inputs.replicable && inputs.steps && inputs.description && (inputs.example && !regex_na.test(inputs.example)) && inputs.screenshots && inputs.videos && inputs.expectation && inputs.console){
        $('#input_error')[0].classList = '';
        $('#error-borders')[0].innerHTML ='';
        $('#steps_input td:last-child button')[0].removeAttribute('style');
        $('#video-input')[0].removeAttribute('style');
        $('#screenshot-input')[0].removeAttribute('style');
        generateTicket();
    }else{
        $('#steps_input td:last-child button')[0].removeAttribute('style');
        $('#video-input')[0].removeAttribute('style');
        $('#screenshot-input')[0].removeAttribute('style');
        let borders = '';
        function addBorder(newborder){
            if(borders){
                borders = borders +`, ${newborder}`;
            }else{
                borders = borders +`${newborder}`;
            };
        };
        $('#input_error')[0].classList = 'active';
        if(!inputs.crm){
            addBorder('#crm_input');
        };
        if(!inputs.area){
            addBorder('#system_input');
        };
        if(!inputs.replicable){
            addBorder('#replication_input');
        };
        if(!inputs.steps){
            $('#steps_input td:last-child button')[0].setAttribute('style','background-color: red;');
        };
        if(!inputs.description){
            addBorder('#description_input');
        };
        if(!inputs.example | regex_na.test(inputs.example)){
            addBorder('#example_input');
        };
        if(!inputs.screenshots | regex_na.test(inputs.screenshots)){
            $('#screenshot-input')[0].setAttribute('style','background-color: red;');
        };
        if(!inputs.videos | regex_na.test(inputs.videos)){
            $('#video-input')[0].setAttribute('style','background-color: red;');
        };
        if(!inputs.expectation){
            addBorder('#expectation_input');
        };
        if(!inputs.console){
            addBorder('#console_input');
        };
        $('#error-borders')[0].innerHTML = `
            ${borders} {
                border-color: red !important;
            }`;
    };
};
function generateTicket() {
    //update get steps
    replication_steps = '';
    entered_info = $('#steps-table tbody tr td:last-child input');
    for(var i=0; i<entered_info.length; i++){
        let z = i + 1;
        replication_steps = replication_steps + `${z}.${entered_info[i].value}\n`;
    };
    output_example = '';
    entered_info = $('#example_input')[0].value;
    split_info = entered_info.split('\n');
    for(var i=0; i<split_info.length; i++){
        output_example = output_example + `${split_info[i]}\n`;
    };
    screenshot_output = '';
    entered_info = $('#screenshot-table tbody tr td:last-child input');
    for(var i=0; i<entered_info.length; i++){
        screenshot_output = screenshot_output + `${entered_info[i].value}\n`;
    };
    video_output = '';
    entered_info = $('#video-table tbody tr td:last-child input');
    for(var i=0; i<entered_info.length; i++){
        video_output = video_output + `${entered_info[i].value}\n`;
    };
    let is_replicable = '';
    let replicable_input = $('#replicable_input')[0].value;
    if(replicable_input === 'Yes'){
        is_replicable = 'STEPS TO REPRODUCE:';
    }else{
        is_replicable = 'ATTEMPTED STEPS TO REPRODUCE:';
    };
    ticket_output = `**LOCATION:**
Store ID:
`+ $('#crm_input')[0].value +`
System Area:
`+ $('#system_input')[0].value +`

Can you recreate the problem on your demo site (if yes please continue, if no use the "Bug - non reproducible" macro)?
`+ $('#replicable_input')[0].value +`

${is_replicable}
${replication_steps}

ACTUAL RESULTS:(Please be as detailed as possible.)
Description:
`+ $('#description_input')[0].value +`

Example:(If this pertains to the customer's site, please provide links to the relevant pages.)
${output_example}

Screenshot:
${screenshot_output}

Video:
${video_output}

EXPECTED RESULTS:
`+ $('#expectation_input')[0].value +`

CONSOLE ERRORS:
`+ $('#console_input')[0].value;
$('#bug-glitch-ticket')[0].value = ticket_output;
popupControl('open','generated_popup');
};
function copyTicket() {
    // Get the text field
    var copyText = document.getElementById("bug-glitch-ticket");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //console.log("Copied the text: " + copyText.value);
}
function resetCheck(){
    $('div.reset-popup')[0].setAttribute('style','');
}
function goBack(){
    $('div.reset-popup')[0].setAttribute('style','display: none;');
}
function popupControl(x,y){
    if(x === 'close'){
        $(`.container.${y}`)[0].setAttribute('style','display: none');
    }else if(x === 'open'){
        $(`.container.${y}`)[0].removeAttribute('style');
    }
}
function newRow(table){
    if($(`#${table} > table > tbody tr`).length > 0){
        let x = parseInt($(`#${table} > table > tbody > tr:last-child > td:first-child`)[0].innerText);
        x++;
        //create table row element
        const  trow = $(document)[0].createElement("tr");
        //create row cell step number
        const td_num = $(document)[0].createElement("td");
        td_num.innerText = x;
        trow.appendChild(td_num);
        //create row cell for step details
        const td_detail = $(document)[0].createElement("td");
        const in_detail = $(document)[0].createElement("input");
        in_detail.setAttribute('type', 'text');
        td_detail.appendChild(in_detail);
        const span_delete = $(document)[0].createElement("span");
        span_delete.innerText = "X";
        span_delete.setAttribute('onclick', `deleteRow('${table}',${x})`);
        td_detail.appendChild(span_delete);
        trow.appendChild(td_detail);
        $(`#${table} table tbody`)[0].appendChild(trow);
    }else{
        //set's row one if no row's are currently there
        //create table row element
        const  trow = $(document)[0].createElement("tr");
        //create row cell step number
        const td_num = $(document)[0].createElement("td");
        td_num.innerText = '1';
        trow.appendChild(td_num);
        //create row cell for step details
        const td_detail = $(document)[0].createElement("td");
        const in_detail = $(document)[0].createElement("input");
        in_detail.setAttribute('type', 'text');
        td_detail.appendChild(in_detail);
        const span_delete = $(document)[0].createElement("span");
        span_delete.innerText = "X";
        span_delete.setAttribute('onclick', `deleteRow(${table},1)`);
        td_detail.appendChild(span_delete);
        trow.appendChild(td_detail);
        $(`#${table} table tbody`)[0].appendChild(trow);
    }
}
function saveSteps(){
    if($('#steps-table table tbody tr:first-child td:last-child input')[0].value != ''){
        $('#number-of-steps')[0].innerText = $('#steps-table table tbody tr').length;
    }else{
        $('#number-of-steps')[0].innerText = 'None';
    }
    popupControl('close','steps_popup');
}
function screenshotError(e){
    if(e === 'show'){
        $('.screenshot-error').addClass('active');
    }else if(e === 'hide'){
        $('.screenshot-error').removeClass('active');
    }
}
function saveScreenshots(){
    let x = $('#screenshot-table table tbody tr td:last-child input');
    let result = true;
    for(i=0;i<x.length;i++){
        x[i].removeAttribute('style');
    }
    for(i=0;i<x.length;i++){
        if(regex_local_path.test(x[i].value)){
            x[i].setAttribute('style','border: red solid 2px');
            result = false;
        }
    }
    if(result){
        screenshotError('hide');
        popupControl('close','screenshot_popup');
    }else{
        screenshotError('show');
    }
}
function videoError(e){
    if(e === 'show'){
        $('.video-error').addClass('active');
    }else if(e === 'hide'){
        $('.video-error').removeClass('active');
    }
}
function saveVideos(){
    let x = $('#video-table table tbody tr td:last-child input');
    let result = true;
    for(i=0;i<x.length;i++){
        x[i].removeAttribute('style');
    }
    for(i=0;i<x.length;i++){
        if(regex_local_path.test(x[i].value)){
            x[i].setAttribute('style','border: red solid 2px');
            result = false;
        }
    }
    if(result){
        videoError('hide');
        popupControl('close','video_popup');
    }else{
        videoError('show');
    }
}
function deleteRow(table,row){
    $(`#${table} > table > tbody tr:nth-child(${row})`).remove();
    let x = $(`#${table} > table > tbody tr`);
    let y = 1;
    for(i=0;i<x.length;i++){
        x[i].querySelector('td:first-child').innerText = y;
        x[i].querySelector('td:last-child > span').setAttribute('onclick',`deleteRow('${table}',${y})`);
        y++;
    }
}