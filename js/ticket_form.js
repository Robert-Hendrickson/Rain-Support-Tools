//set regex value to be checked against
let regex_na = new RegExp('^(n|N)\/*(a|A)');
function reset() {
    $('#error-borders')[0].innerHTML =''
    $('#input_error').css('display','none');
    var reset_values = ["crm_input", "system_input", "steps_input", "description_input", "example_input", "screenshot_input", "video_input", "expectation_input", "console_input"]
    for(let i = 0; i < reset_values.length; i++){
        let remove = reset_values[i];
        $(`#${remove}`)[0].value = '';
    };
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
function checkInputs() {
    $('#input_error').css('display','none');
    var inputs = {
        "crm": $('#crm_input')[0].value,
        "area": $('#system_input')[0].value,
        "replicable": $('#replicable_input')[0].value,
        "steps": $('#steps_input')[0].value,
        "description": $('#description_input')[0].value,
        "example": $('#example_input')[0].value,
        "screenshots": $('#screenshot_input')[0].value,
        "videos": $('#video_input')[0].value,
        "expectation": $('#expectation_input')[0].value,
        "console": $('#console_input')[0].value
    };
    if(inputs.crm && inputs.area && inputs.replicable && inputs.steps && inputs.description && (inputs.example && !regex_na.test(inputs.example)) && (inputs.screenshots && !regex_na.test(inputs.screenshots)) && (inputs.videos && !regex_na.test(inputs.videos)) && inputs.expectation && inputs.console){
        $('#error-borders')[0].innerHTML ='';
        generateTicket();
    }else{
        let borders = '';
        function addBorder(newborder){
            if(borders){
                borders = borders +`, ${newborder}`;
            }else{
                borders = borders +`${newborder}`;
            };
        };
        $('#input_error').css('display','block');
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
            addBorder('#steps_input');
        };
        if(!inputs.description){
            addBorder('#description_input');
        };
        if(!inputs.example | regex_na.test(inputs.example)){
            addBorder('#example_input');
        };
        if(!inputs.screenshots | regex_na.test(inputs.screenshots)){
            addBorder('#screenshot_input');
        };
        if(!inputs.videos | regex_na.test(inputs.videos)){
            addBorder('#video_input');
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
    replication_steps = '';
    entered_info = $('#steps_input')[0].value;
    split_info = entered_info.split('\n');
    for(var i=0; i<split_info.length; i++){
        let z = i + 1;
        replication_steps = replication_steps + `${z}.${split_info[i]}\n`;
    };
    output_example = '';
    entered_info = $('#example_input')[0].value;
    split_info = entered_info.split('\n');
    for(var i=0; i<split_info.length; i++){
        output_example = output_example + `${split_info[i]}\n`;
    };
    screenshot_output = '';
    entered_info = $('#screenshot_input')[0].value;
    split_info = entered_info.split('\n');
    for(var i=0; i<split_info.length; i++){
        screenshot_output = screenshot_output + `${split_info[i]}\n`;
    };
    video_output = '';
    entered_info = $('#video_input')[0].value;
    split_info = entered_info.split('\n');
    for(var i=0; i<split_info.length; i++){
        video_output = video_output + `${split_info[i]}\n`;
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
popupControl('open','ticket');
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
    if(x === 'close' && y === 'ticket'){
        $('.container.generated_popup')[0].setAttribute('style','display: none;');
    }else if(x === 'open' && y === 'ticket'){
        $('.container.generated_popup')[0].removeAttribute('style');
    }else if(x === 'close' && y === 'steps'){
        $('.container.steps_popup')[0].setAttribute('style','display: none;');
    }else if(x === 'open' && y === 'steps'){
        $('.container.steps_popup')[0].removeAttribute('style');
    }
}