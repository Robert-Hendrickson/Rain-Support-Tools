//sets variable as a regular expresion that will be used to test emails against, expression build is designed to check for most common allowed character types in an email address
let email_check = new RegExp(/^[\w\-\_\+\.\&]+@[\w\-]+(?:\.[\w]{2,})+$/gm);

/*function runs through imported list of emails and checks each to see if it's a good or bad email configuration following the regular expression check from email_check*/
function runCheck(){
    //set object to hold data
    let email_lists = {
        input: [],
        good: [],
        bad: []
    }
    //get an array of emails from the input list and assign it to the input value of email_lists object
    email_lists.input = $('.inputList > textarea')[0].value.split('\n');
    //count how many emails are in the array and update the number above the input box to display correct number
    $(`.inputList count`)[0].innerText = email_lists.input.length;
    //loop through the arrayed list and compare the email address to the check
    for(i=0;i<email_lists.input.length;i++){
        if(email_lists.input[i].match(email_check)){//if it passes, add it to the good email list
            email_lists.good[email_lists.good.length] = email_lists.input[i];
        } else {//else add it to the bad email list
            email_lists.bad[email_lists.bad.length] = email_lists.input[i];
        }
    };
    //loop through good and bad email lists and display the new emails and the counts in their respective text boxes
    for(list in email_lists){
        if(list != 'input'){
            //update the count of the email list column
            $(`.${list}List count`)[0].innerText = email_lists[list].length;
            //create a string of the emails and display them in the text box for the correct column
            let temp = '';
            for(i=0;i<email_lists[list].length;i++){
                temp += email_lists[list][i] + '\n';
            }
            $(`.${list}List > textarea`)[0].value = temp.substring(0,temp.length -1);
        }
    }
}

/*function takes a string of emails provided by the user and adds them in the correct formatting to the text area for imported emails list*/
function importList(){
    //get string of emails
    let import_string = $('.import textarea')[0].value;
    //email string will look like (email_1\\nemail_2\\n...), replace all \\n with \n, this will make a readable list in the text area
    import_string = import_string.replaceAll("'","").replaceAll('\\n','\n');
    //add new string to import box
    $('.inputList textarea')[0].value = import_string;
    //close import modal
    $('.import').addClass('hide');
}
/*function resets page after confirming with user to continue*/
async function clearData(){
    if(await customDialogResponse("You are about to clear all current data and won't able to reclaim it. Are you sure you want to proceed?","Continue","Cancel")){
        let data = $('.mainContent div');
        for(i=0;i<data.length;i++){
            data[i].querySelector('count').innerText = '0';
            data[i].querySelector('textarea').value = '';
        }
    }
}