//set regex value to be checked against
//new regex for 'exampleLink' will return an array of every instance that is found new check can make sure array returned isn't null then display links that need changed.
let regex = {
    "na": new RegExp(/^(n|N)\/*(a|A)/),
    "googleDrive": new RegExp(/^.*drive\.google\.com\/.*/),
    "exampleLink": new RegExp(/rainadmin|quiltstorewebsites/g)
};
//base variables to be adjusted later
let ticket_output = '';
let entered_info = '';
let split_info = '';
let replicable_steps = '';
let output_example = '';
let screenshot_output = '';
let video_output = '';
let screenshot_current;
let video_current;
let list_current = {
    'screenshot': [],
    'video': []
};
//reset function
function reset() {
    location.reload();
};
//end reset function
//controls popup for when the reset button is pressed
function resetCheck(){
    $('div.reset-popup')[0].setAttribute('style','');
};
//hides the popup for reset confirmation without reseting the data
function goBack(){
    $('div.reset-popup')[0].setAttribute('style','display: none;');
};
//functions for checking data input used as boollean returns in the checkInputs function
function steps_check(){
    if($('#steps-table tbody tr').length > 0 && $('#steps-table tbody tr td:last-child input')[0].value != '' && !regex.na.test($('#steps-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    };
};
function screenshot_check(){
    if($('#screenshot-table tbody tr').length > 0 && $('#screenshot-table tbody tr td:last-child input')[0].value != '' && !regex.na.test($('#screenshot-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    };
};
function video_check(){
    if($('#video-table tbody tr').length > 0 && $('#video-table tbody tr td:last-child input')[0].value != '' && !regex.na.test($('#video-table tbody tr td:last-child input')[0].value)){
        return true;
    }else{
        return false;
    };
};
function exampleCheck(){
    if($('#example_input')[0].value.match(regex.exampleLink) == null){
        return true;
    }else{
        return false;
    };
};
function duplicateLinksCheck(){
    let all_links_data = {
        _get_video_links: () =>{
            let video_input_list = $('#video-table tbody tr > td:nth-child(2) input');
            let video_list = [];
            for(i=0;i<video_input_list.length;i++){
                video_list[i] = video_input_list[i].value;
            };
            return video_list;
        },
        _get_screenshot_links: () =>{
            let screenshot_input_list = $('#screenshot-table tbody tr > td:nth-child(2) input');
            let screenshot_list = [];
            for(i=0;i<screenshot_input_list.length;i++){
                screenshot_list[i] = screenshot_input_list[i].value;
            };
            return screenshot_list;
        },
        _set_compile_list: () =>{
            let full_list = '';
            for(i=0;i<all_links_data.screenshot_links.length;i++){
                full_list += all_links_data.screenshot_links[i];
            };
            for(i=0;i<all_links_data.video_links.length;i++){
                full_list += all_links_data.video_links[i];
            };
            return full_list;
        },
        "pattern": null,
        "temp_pattern": (url) => {
            let temp = '';
            for(u=0;u<url.length;u++){
                if(url[u] === '?'){
                    break;
                }else{
                    temp += url[u];
                };
            };
            return temp;
        }
    };
    all_links_data["screenshot_links"] = all_links_data._get_screenshot_links();
    all_links_data["video_links"] = all_links_data._get_video_links();
    all_links_data["link_list"] = all_links_data._set_compile_list();
    var duplicates = false;
    //maybe change the below to find shortest list first and only check it?
    if(all_links_data.video_links.length <= all_links_data.screenshot_links.length){
        for(i=0;i<all_links_data.video_links.length;i++){
            all_links_data.pattern = new RegExp(all_links_data.temp_pattern(all_links_data.video_links[i]),'g');
            if(all_links_data.link_list.match(all_links_data.pattern).length > 1){
                duplicates = true;
            };
        };
    }else{
        for(i=0;i<all_links_data.screenshot_links.length;i++){
            all_links_data.pattern = new RegExp(all_links_data.temp_pattern(all_links_data.screenshot_links[i]),'g');
            if(all_links_data.link_list.match(all_links_data.pattern).length > 1){
                duplicates = true;
            };
        };
    };
    return duplicates;
};
//end functions for boollean checks
//check that inputed data is good before generating ticket info
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
        "console": $('#console_input')[0].value,
        "duplicates": duplicateLinksCheck()
    };
    //begin check video and screenshot links for duplicates

    //end  check video and screenshot links for duplicates
    if(inputs.crm && inputs.area && inputs.replicable && inputs.steps && inputs.description && (inputs.example && !regex.na.test(inputs.example) && exampleCheck()) && inputs.screenshots && inputs.videos && inputs.expectation && inputs.console && !inputs.duplicates){
        $('#input_error')[0].classList = '';
        $('#error-wrapper').removeClass("active");
        $('#error-wrapper').removeClass("input");
        $('#error-borders')[0].innerHTML ='';
        $('#steps_input td:last-child button')[0].removeAttribute('style');
        $('#video-input')[0].removeAttribute('style');
        $('#screenshot-input')[0].removeAttribute('style');
        if($('#duplicate_error')[0].classList == "active"){
            $('#duplicate_error').removeClass('active');
            $('#error-wrapper').removeClass("duplicate");
        };
        generateTicket();
    }else{
        $('#steps_input td:last-child button')[0].removeAttribute('style');
        $('#video-input')[0].removeAttribute('style');
        $('#screenshot-input')[0].removeAttribute('style');
        $('#error-wrapper').addClass("input");
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
        if(!inputs.example | regex.na.test(inputs.example) | !exampleCheck()){
            addBorder('#example_input');
        };
        if(exampleCheck()){
            $('#error-wrapper').removeClass("example");
            $('#example_error').removeClass("active");
        }else{
            $('#error-wrapper').addClass("example");
            $('#example_error').addClass("active");
            console.error('Unacceptable data entered for examples');
        };
        if(!inputs.screenshots || regex.na.test(inputs.screenshots) || inputs.duplicates){
            $('#screenshot-input')[0].setAttribute('style','background-color: red;');
        };
        if(!inputs.videos || regex.na.test(inputs.videos) || inputs.duplicates){
            $('#video-input')[0].setAttribute('style','background-color: red;');
        };
        if(!inputs.duplicates){
            $('#error-wrapper').removeClass("duplicate");
            $('#duplicate_error').removeClass('active');
        }else{
            $('#error-wrapper').addClass("duplicate");
            $('#duplicate_error').addClass('active');
        }
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
//end check that inputed data is good before generating ticket info
//script for collecting data from input area's and compiling them into a single text area
function generateTicket() {
    //update get steps
    replication_steps = '';
    entered_info = $('#steps-table tbody tr td:last-child input');
    for(var i=0; i<entered_info.length; i++){
        let z = i + 1;
        replication_steps = replication_steps + `${z}. ${entered_info[i].value}\n`;
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
popupControl('open','generated');
};
//END script for collecting data from input area's and compiling them into a single text area
//coppies data from compiled info to computers clipboard
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
};
//controls opening and closing different popup modals
function popupControl(x,y){
    if(y === 'steps' || y === 'generated'){
        if(x === 'close'){
            $(`.container.${y}_popup`)[0].setAttribute('style','display: none');
        }else if(x === 'open'){
            $(`.container.${y}_popup`)[0].removeAttribute('style');
        };
    }else if(y != 'steps' && y != 'generated'){
        if(x === 'close'){
            $(`.container.${y}_popup`)[0].setAttribute('style','display: none');
        }else if(x === 'open'){
            $(`.container.${y}_popup`)[0].removeAttribute('style');
            holdCurrent(y);
        };
        if(y === 'screenshot'){
            screenshotError('hide');
        };
        if(y === 'video'){
            videoError('hide');
        };
    };
};
//END popup control script
//creates new rows to tabels for inputs on replication steps and video/screenshot popups
function newRow(table){
    if($(`#${table}-table > table > tbody tr`).length > 0){
        let x = parseInt($(`#${table}-table > table > tbody > tr:last-child > td:first-child`)[0].innerText);
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
        $(`#${table}-table table tbody`)[0].appendChild(trow);
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
        span_delete.setAttribute('onclick', `deleteRow('${table}',1)`);
        td_detail.appendChild(span_delete);
        trow.appendChild(td_detail);
        $(`#${table}-table table tbody`)[0].appendChild(trow);
    };
};
//END row adding script
//saves current steps data
function saveSteps(){
    if($('#steps-table table tbody tr:first-child td:last-child input')[0].value != ''){
        $('#number-of-steps')[0].innerText = $('#steps-table table tbody tr').length;
    }else{
        $('#number-of-steps')[0].innerText = 'None';
    };
    popupControl('close','steps');
};
//controls error message display for if screenshot data has a bad link
function screenshotError(e){
    if(e === 'show'){
        $('.screenshot-error').addClass('active');
    }else if(e === 'hide'){
        $('.screenshot-error').removeClass('active');
    };
};
//saves entered data for screenshots and displays an error message if the data to be saved doesn't meet expected criteria
function savedLinksCheck(area){
    let no_duplicates = true;
    let area_data = {
        "list": $(`#${area}-table table tbody`)[0].querySelectorAll('tr'),
        "_get_links": () => {
            let url_list = '';
            for(i=0;i<area_data.list.length;i++){
                url_list += area_data.list[i].querySelector('td:nth-child(2) input').value + ',';
            };
            return url_list;
        },
        "pattern": null,
        "temp_pattern": (url) => {
            let temp = '';
            for(u=0;u<url.length;u++){
                if(url[u] === '?'){
                    break;
                }else{
                    temp += url[u];
                };
            };
            return temp;
        }
    };
    area_data['links'] = area_data._get_links();
    //reset outlines
    for(i=0;i<area_data.list.length;i++){
        area_data.list[i].querySelector('td:nth-child(2) input').removeAttribute('style');
    };
    for(i=0;i<area_data.list.length;i++){
        area_data.pattern = new RegExp(area_data.temp_pattern(area_data.list[i].querySelector('td:nth-child(2) input').value),'g');
        if(area_data.links.match(area_data.pattern).length > 1){
            console.log(`Duplicate links found in the ${area} list`);
            area_data.list[i].querySelector('td:nth-child(2) input').setAttribute('style','border: red solid 2px');
            no_duplicates = false;
        };
    };
    return no_duplicates;
};
function saveScreenshots(){
    let x = $('#screenshot-table table tbody tr td:last-child input');
    let result = true;
    for(i=0;i<x.length;i++){
        x[i].removeAttribute('style');
    };
    for(i=0;i<x.length;i++){
        if(!regex.googleDrive.test(x[i].value)){
            x[i].setAttribute('style','border: red solid 2px');
            result = false;
        };
    };
    if(result && savedLinksCheck('screenshot')){
        screenshotError('hide');
        popupControl('close','screenshot');
    }else{
        screenshotError('show');
    };
};
//controls error message display for if entered video link data has a bad link or doesn't meet the expected criteria
function videoError(e){
    if(e === 'show'){
        $('.video-error').addClass('active');
    }else if(e === 'hide'){
        $('.video-error').removeClass('active');
    };
};
//saves entered data for videos and displays an error message if the data to be saved doesn't meet expected criteria
function saveVideos(){
    let x = $('#video-table table tbody tr td:last-child input');
    let result = true;
    for(i=0;i<x.length;i++){
        x[i].removeAttribute('style');
    };
    for(i=0;i<x.length;i++){
        if(!regex.googleDrive.test(x[i].value)){
            x[i].setAttribute('style','border: red solid 2px');
            result = false;
        };
    };
    if(result && savedLinksCheck('video')){
        videoError('hide');
        popupControl('close','video');
    }else{
        videoError('show');
    };
};
//remove selected row from a table and renames the remaining rows to be ordered correctly
function deleteRow(table,row){
    $(`#${table}-table > table > tbody tr:nth-child(${row})`).remove();
    let x = $(`#${table}-table > table > tbody tr`);
    let y = 1;
    for(i=0;i<x.length;i++){
        x[i].querySelector('td:first-child').innerText = y;
        x[i].querySelector('td:last-child > span').setAttribute('onclick',`deleteRow('${table}',${y})`);
        y++;
    };
};
//saves current data in the table in case the modal is closed with no changes saved
function holdCurrent(table){
    let list = $(`#${table}-table table tbody tr td:last-child input`);
    list_current[`${table}`] = [];
    for(i=0;i<list.length;i++){
        list_current[`${table}`][i] = list[i].value;
    };
};
//puts the previously held information back if the modal is closed without saving
function replaceCurrent(table){
    popupControl('close', `${table}`)
    $(`#${table}-table table tbody`).remove();
    let replace_body = $(document)[0].createElement('tbody');
    $(`#${table}-table table`)[0].appendChild(replace_body);
    for(i=0;i<list_current[`${table}`].length;i++){
        let l = i +1;
        newRow(table);
        $(`#${table}-table table tbody tr:nth-child(${l}) td:last-child input`)[0].value = list_current[`${table}`][i];
    };
};