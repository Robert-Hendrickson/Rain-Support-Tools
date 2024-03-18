//regex object to use when checking values
let regex = {
    "googleDrive": new RegExp(/^.*drive\.google\.com\/.*view/)
};
//tracks number of pages used. Sets as 0 then is increased for each new line added
var number_of_pages = 0;
/*add new row for pages*/
function addPageLine(){
    number_of_pages++;
    $('table#page_list > tbody')[0].append($.parseHTML(`<tr id='page_${number_of_pages}'><td>${number_of_pages}.</td><td><table><tbody><tr><td><input id='url' placeholder='URL' /></td><td><textarea placeholder='Description' id='description'></textarea></td></tr><tr><td><input placeholder='Screenshot' id='screenshot' /></td><td><input placeholder='Video(optional)' id='video' /></tr></tbody></table><input type='button' value='Delete' onclick='removePageLine(${number_of_pages})' /></td></tr>`)[0]);
};
/*remove row from pages*/
function removePageLine(row){
    number_of_pages--;
    $(`tr#page_${row}`).remove();
    lineReadjust();
};
/*make sure remaining rows have correct numbers*/
function lineReadjust(){
    let temp = $('table#page_list > tbody > tr');
    for(i=0;i<temp.length;i++){
        let x = i + 1;
        temp[i].setAttribute('id',`page_${x}`);
        temp[i].querySelector('td:first-child').innerText = `${x}.`;
        temp[i].querySelector('td:nth-child(2) > input[type="button"]').setAttribute('onclick',`removePageLine(${x})`);
    };
};
/*generate ticket information*/
function generateTicket(ticket_info){
    console.log(ticket_info);
    let ticket_output = `**Site Fix Ticket**
Store ID: ${ticket_info.crm.value}

Type of Work: ${ticket_info.type.value}

`;
    for(i=0;i<ticket_info.pages.length;i++){
        ticket_output += `*****Page ${i+1}*****
URL: ${ticket_info.pages[i].querySelector('input#url').value}

Screenshot: ${ticket_info.pages[i].querySelector('input#screenshot').value}

`;
        if(ticket_info.pages[i].querySelector('input#video').value != ''){
            ticket_output += `Video: ${ticket_info.pages[i].querySelector('input#video').value}\n\n`;
        };
        ticket_output += `Description: ${ticket_info.pages[i].querySelector('textarea#description').value}\n\n`;
    };
    //need to compile table data from page info
    $('textarea#site-fix-ticket')[0].value = ticket_output;
    $('.container.generated_popup').removeClass('hide');
    $('textarea#site-fix-ticket')[0].focus();
};
/*verify required info is present*/
function authenticateDate(){
    let ready = true;
    let check_data = {
        'crm': $('input#crm_input')[0],
        'type': $('select#fix_or_custom')[0],
        'pages': $('table#page_list > tbody > tr')
    };
    if(!check_data.crm.value.match(/([Cc][Rr][Mm]){0,1}\d{3,}/)){
        ready = false;
        check_data.crm.setAttribute('style','border: 2px red solid');
    }else{
        check_data.crm.removeAttribute('style');
    };
    if(check_data.type.value === 'none'){
        ready = false;
        check_data.type.setAttribute('style','border: 2px red solid');
    }else{
        check_data.type.removeAttribute('style');
    };
    for(row = 0;row<check_data.pages.length;row++){
        if(check_data.pages[row].querySelector('input#url').value === ''){
            ready = false;
            check_data.pages[row].querySelector('input#url').setAttribute('style','border: 2px red solid');
        }else{
            check_data.pages[row].querySelector('input#url').removeAttribute('style');
        };
        if(check_data.pages[row].querySelector('textarea#description').value === ''){
            ready = false;
            check_data.pages[row].querySelector('textarea#description').setAttribute('style','border: 2px red solid');
        }else{
            check_data.pages[row].querySelector('textarea#description').removeAttribute('style');
        };
        if(check_data.pages[row].querySelector('input#screenshot').value === '' || !regex.googleDrive.test(check_data.pages[row].querySelector('input#screenshot').value)){
            ready = false;
            check_data.pages[row].querySelector('input#screenshot').setAttribute('style','border: 2px red solid');
        }else{
            check_data.pages[row].querySelector('input#screenshot').removeAttribute('style');
        };
    };
    if(ready){
        generateTicket(check_data);
        if(!$('#error_message')[0].classList.value.match(/hide/)){
            $('#error_message').addClass('hide');
        };
    }else{
        $('#error_message').removeClass('hide');
    };
};
function copyTicket() {
    // Get the text field
    var copyText = document.getElementById("site-fix-ticket");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    //console.log("Copied the text: " + copyText.value);
};