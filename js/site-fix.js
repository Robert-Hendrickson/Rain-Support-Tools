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
    for(i=0;i<ticket_info.pages.value.length;i++){
        ticket_output += `*****Page ${i+1}*****
URL: ${ticket_info.pages.value[i].querySelector('input#url').value}

Screenshot: ${ticket_info.pages.value[i].querySelector('input#screenshot').value}

`;
        if(ticket_info.pages.value[i].querySelector('input#video').value != ''){
            ticket_output += `Video: ${ticket_info.pages.value[i].querySelector('input#video').value}\n\n`;
        };
        ticket_output += `Description: ${ticket_info.pages.value[i].querySelector('textarea#description').value}\n\n`;
    };
    //need to compile table data from page info
    $('textarea#site-fix-ticket')[0].value = ticket_output;
    $('.container.generated_popup').removeClass('hide');

    /*
**Site Fix Ticket**
Store ID: 

Type of Work: 

Page 1:
URL:
description:

screenshot:

video: optional
*/
};
/*verify required info is present*/
function authenticateDate(){
    let check_data = {
        'crm': {
            'boolean': ()=>{if($('input#crm_input')[0].value){return true;}else{return false}},
            'value': $('input#crm_input')[0].value
        },
        'type': {
            'boolean': ()=>{if($('select#fix_or_custom')[0].value != 'none'){return true;}else{return false}},
            'value': $('select#fix_or_custom')[0].value
        },
        'pages': {
            'boolean': ()=>{if($('table#page_list > tbody tr')[0]){return true;}else{return false}},
            'value': $('table#page_list > tbody > tr')
        }
    };
    let ready = true;
    for(let check in check_data){
        if(!check_data[check].boolean()){
            ready = false;
        };
    };
    if(ready){
        generateTicket(check_data);
    }else{
        console.log('not ready');
    };
};