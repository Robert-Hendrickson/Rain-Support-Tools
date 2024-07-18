let email_check = new RegExp(/^[\w\-\_\+\.\&]+@[\w\-]+(?:\.[\w]{2,})+$/gm);

function runCheck(){
    let email_lists = {
        input: [],
        good: [],
        bad: []
    }
    email_lists.input = $('.inputList > textarea')[0].value.split('\n');
    $(`.inputList count`)[0].innerText = email_lists.input.length;
    for(i=0;i<email_lists.input.length;i++){
        if(email_lists.input[i].match(email_check)){
            email_lists.good[email_lists.good.length] = email_lists.input[i];
        } else {
            email_lists.bad[email_lists.bad.length] = email_lists.input[i];
        }
    };
    for(list in email_lists){
        if(list != 'input'){
            $(`.${list}List count`)[0].innerText = email_lists[list].length;
            let temp = '';
            for(i=0;i<email_lists[list].length;i++){
                temp += email_lists[list][i] + '\n';
            }
            //email_lists[list] = temp;
            $(`.${list}List > textarea`)[0].value = temp.substring(0,temp.length -1);
        }
    }
}


function importList(){
    let import_string = $('.import textarea')[0].value;
    import_string = import_string.replaceAll("'","").replaceAll('\\n','\n');
    $('.inputList textarea')[0].value = import_string;
    $('.import').addClass('hide');
}

async function clearData(){
    if(await customDialogResponse("You are about to clear all current data and won't able to reclaim it. Are you sure you want to proceed?","Continue","Cancel")){
        let data = $('.mainContent div');
        for(i=0;i<data.length;i++){
            data[i].querySelector('count').innerText = '0';
            data[i].querySelector('textarea').value = '';
        }
    }
}