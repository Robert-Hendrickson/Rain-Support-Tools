var number_of_pages = 0;
/*add new row for pages*/
function addPageLine(){
    number_of_pages++;
    $('table#page_list > tbody')[0].append($.parseHTML(`<tr id='page_${number_of_pages}'><td>${number_of_pages}.<input type='text' /></td><td><textarea></textarea><input type='button' value='Delete' onclick='removePageLine(${number_of_pages})' /></td></tr>`)[0]);
};
/*remove row from pages*/
function removePageLine(row){
    number_of_pages--;
    $(`tr#page_${row}`).remove();
    lineReadjust();
};
/*make sure existing rows have correct numbers*/
function lineReadjust(){
    let temp = $('table#page_list > tbody tr');
    for(i=0;i<temp.length;i++){
        let x = i + 1;
        temp[i].setAttribute('id',`page_${x}`);
        temp[i].querySelector('td:first-child').innerHTML = `${x}.<input type='text' />`;
        temp[i].querySelector('td:nth-child(2) input').setAttribute('onclick',`removePageLine(${x})`);
    };
};
/*verify required info is present*/
function authenticateDate(){
    let check_data = {
        'crm': {
            'boolean': ()=>{if($('input#crm_input')[0].value){return true;}else{return false}},
            'value': $('input#crm_input')[0].value
        },
        'type': {
            'boolean': ()=>{if($('select#fix_or_custom')[0].value){return true;}else{return false}},
            'value': $('select#fix_or_custom')[0].value
        },
        'video':{
            'boolean': ()=>{if($('textarea#video')[0].value){return true;}else{return false}},
            'value': $('textarea#video')[0].value
        },
        'screenshot': {
            'boolean': ()=>{if($('textarea#screenshot')[0].value){return true;}else{return false}},
            'value': $('textarea#screenshot')[0].value
        },//need to set a boolean check for pages
        'pages': $('table#page_list > tbody tr')
    };
    let ready = true;
    for(let check in check_data){
        if(!check_data[check].boolean()){
            ready = false;
        };
    };
    if(ready){
        console.log('good to go');
    }else{
        console.log('not ready');
    };
};