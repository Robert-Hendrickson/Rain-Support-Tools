let email_check = new RegExp(/^[\w\-\_\+\.]+@[\w\-]{2,}(\.[\w]{2,})+$/gm);

function runCheck(){
    let email_lists = {
        input: [],
        good: [],
        bad: []
    }
    email_lists.input = $('.inputList > textarea')[0].value.split('\n');
    for(i=0;i<email_lists.input.length;i++){
        if(email_lists.input[i].match(email_check)){
            email_lists.good[email_lists.good.length] = email_lists.input[i];
        } else {
            email_lists.bad[email_lists.bad.length] = email_lists.input[i];
        }
    };
    for(list in email_lists){
        if(list != 'input'){
            $(`.${list}List count`)[0].innerText = email_lists[list].length + 1;
            let temp = '';
            for(i=0;i<email_lists[list].length;i++){
                temp += email_lists[list][i] + '\n';
            }
            //email_lists[list] = temp;
            $(`.${list}List > textarea`)[0].value = temp;
        }
    }
}


function importList(){
    //'05mortiz@gmail.com\n10spracklen@gmail.com\n1107danijo@gmail.com' test string
    //need to replace all ' single quotes to remove beginning and end quotes
    //then replace all '\\n' with '\n' then set imported list as the value. 
    // ~.replaceAll("'","").replaceAll('\\n','\n');
}