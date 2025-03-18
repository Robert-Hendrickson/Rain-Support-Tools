function search(){
    //get error message from user
    let error_message = document.getElementById('searchbar').value;
    //clear active classes
    document.querySelectorAll('.results-wrapper').forEach((el) => {
        el.classList.remove('active');
    });
    //check for errors
    //likely a template issue of expected fields or formatting
    if((/You must use the Bug Ticket Form Generator and insert the template to the Description field and set the Issue field to an acceptable value/).test(error_message)){
        document.getElementById('template-issue').classList.add('active');
    }
    //no contact assigned to case
    if ((/Probably Limit Exceeded or 0 recipients/).test(error_message)){
        document.getElementById('no-contact').classList.add('active');
    }
    //default if no match
    if(document.querySelectorAll('.results-wrapper.active').length === 0 && error_message !== ''){
        document.getElementById('default').classList.add('active');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchbar').addEventListener('input', search);
});