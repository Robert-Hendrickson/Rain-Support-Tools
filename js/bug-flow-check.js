/*
    css classes for fontawesome good and bad visuals
    good: fa-regular fa-circle-check
    bad: fa-regular fa-circle-xmark


*/
//takes changed value and updates display area at the bottom to show good or bad depending on the value entered into the box
function updateDisplay(el){
    let event_id = el.target.id;
    let event_value = el.target.value;
    console.log(event_id);
    console.log(event_value);
}
//sets all boxes to auto run script on udpate
$(window).ready(function (){
    $('[entry] input').on('keyup',updateDisplay);
    $('[entry] textarea').on('keyup',updateDisplay)
});