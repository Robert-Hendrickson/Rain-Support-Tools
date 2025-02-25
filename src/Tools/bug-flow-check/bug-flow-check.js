//This funciton takes an element and checks it's value to make sure it meets the necessary criteria
function updateDisplay(el){
    //get id value of the element being checked
    let event_id = el.target.id;
    //get the value of the element being checked
    let event_value = el.target.value;
    //pass id through switch to find which set of instructions to follow based on what event_id is
    switch (event_id) {
        case 'owner':
            //check that owner exactly equals 'New-Unsolved-Bugs'
            if ((/^[\s]?New[\s\_\-]Unsolved[\s\_\-]Bugs/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'status':
            //check that status exactly matches 'Open'
            if ((/^[\s]?open/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'reason':
            //check that reason exactly matches 'software'
            if ((/^[\s]?software/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'issue':
            //check that issue exactly matches 'bug-parent'
            if ((/^[\s]?bug[ ]?\-[ ]?parent/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'description':
            //make sure that description contains exactly '**LOCAITON:**'
            if ((/\*\*LOCATION\:\*\*/g).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        default:
            //if none of the above are run, log an error to the console that gives the passed id and values that weren't used
            console.error(`Something didn't work right. Please try again.` + event_id + event_value);
            break;
    }
}
//takes changed value and updates display area at the bottom to show good or bad depending on the value entered into the box
function toggleDisplay(id,good_bad){
    //if passed value from updateDisplay function was 'good' do the first set of instructions, otherwise do the second set
    if (good_bad === 'good') {
        //using passed id value change classes of elements to be good or a check mark in a circle
        document.querySelector(`[check-list] #${id}`).classList.remove('bad');
        document.querySelector(`[check-list] #${id}`).classList.add('good');
        document.querySelector(`[check-list] #${id} > span`).classList.remove('fa-circle-xmark');
        document.querySelector(`[check-list] #${id} > span`).classList.add('fa-circle-check');
    } else {
        //using passed id value change classes of elements to be bad or an 'X' in a circle
        document.querySelector(`[check-list] #${id}`).classList.remove('good');
        document.querySelector(`[check-list] #${id}`).classList.add('bad');
        document.querySelector(`[check-list] #${id} > span`).classList.remove('fa-circle-check');
        document.querySelector(`[check-list] #${id} > span`).classList.add('fa-circle-xmark');
    }
}
//This function is jquery that when the window is finished loading everything sets a listener on each input and text area so that as the data is typed in it runs the listed function name on the element
$(window).ready(function (){
    document.querySelectorAll('[entry] input').forEach(function (element) {
        element.addEventListener('keyup',updateDisplay)
    });
    document.querySelector('[entry] textarea').addEventListener('keyup',updateDisplay)
});