/*
    css classes for fontawesome good and bad visuals
    good: fa-regular fa-circle-check
    bad: fa-regular fa-circle-xmark


*/
//takes changed value and updates display area at the bottom to show good or bad depending on the value entered into the box
function toggleDisplay(id,good_bad){
    if (good_bad === 'good') {
        $(`[check-list] #${id}`).removeClass('bad');
        $(`[check-list] #${id}`).addClass('good');
        $(`[check-list] #${id} > span`).removeClass('fa-circle-xmark');
        $(`[check-list] #${id} > span`).addClass('fa-circle-check');
    } else {
        $(`[check-list] #${id}`).removeClass('good');
        $(`[check-list] #${id}`).addClass('bad');
        $(`[check-list] #${id} > span`).removeClass('fa-circle-check');
        $(`[check-list] #${id} > span`).addClass('fa-circle-xmark');
    }
}
function updateDisplay(el){
    let event_id = el.target.id;
    let event_value = el.target.value;
    console.log(event_id);
    console.log(event_value);
    switch (event_id) {
        case 'owner':
            if ((/^[\s]?New[\s\_\-]Unsolved[\s\_\-]Bugs/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'status':
            if ((/^[\s]?open/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'reason':
            if ((/^[\s]?software/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'issue':
            if ((/^[\s]?bug[ ]?\-[ ]?parent/i).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        case 'description':
            if ((/\*\*LOCATION\:\*\*/g).test(event_value)) {
                toggleDisplay(event_id, 'good');
            } else {
                toggleDisplay(event_id, 'bad');
            }
            break;
        default:
            console.error(`Something didn't work right. Please try again.` + event_id + event_value);
            break;
    }
    //$($0).addClass('fa-circle-xmark')
    //$($0).removeClass('fa-circle-check')
}
//sets all boxes to auto run script on udpate
$(window).ready(function (){
    $('[entry] input').on('keyup',updateDisplay);
    $('[entry] textarea').on('keyup',updateDisplay)
});