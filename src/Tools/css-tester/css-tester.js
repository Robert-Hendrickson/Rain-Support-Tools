import { cssDefaults } from './css-defaults.js';

function updateCSS(){
    let new_css = document.querySelector('textarea').value.replaceAll('\n','');
    document.getElementById('page-css').innerHTML = new_css;
};
function toggleControl(){
    let current = document.getElementById('userInput').classList[0];
    if(current === 'closed'){
        document.getElementById('userInput').classList = 'open';
        document.querySelector('#panelToggle span').classList.remove('fa-angles-left');
        document.querySelector('#panelToggle span').classList.add('fa-angles-right');
    }else{
        document.getElementById('userInput').classList = 'closed';
        document.querySelector('#panelToggle span').classList.remove('fa-angles-right');
        document.querySelector('#panelToggle span').classList.add('fa-angles-left');
    };
};
let base_css = document.getElementById('page-css').innerHTML.replaceAll(/\n\s*/g,'\n').substring(1);
function setBaseCSS(){
    document.getElementById('user-css').value = base_css;
    updateCSS();
};
setBaseCSS();
//this is for the color getter to display the hex color code easily
function getColor(){
    document.querySelector('.container input[type="text"]').value = document.querySelector('.container input[type="color"]').value;
};
function checkColor(){
    document.querySelector('.container input[type="color"]').value = document.querySelector('.container input[type="text"]').value;
};
document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('.container input[type="color"]').addEventListener('change',getColor);
    document.querySelector('.container input[type="text"]').addEventListener('change',checkColor);
    document.getElementById('panelToggle').addEventListener('click',toggleControl);
    document.getElementById('submit').addEventListener('click',updateCSS);
    document.getElementById('reset').addEventListener('click',setBaseCSS);
    document.getElementById('home').addEventListener('click',() => {location.pathname = '/Rain-Support-Tools/';});
    document.querySelectorAll('style[id$="-css"]').forEach(style => {
        style.innerHTML = cssDefaults[style.id];
    });
    document.querySelectorAll('textarea[id$="-css"]').forEach(textarea => {
        textarea.value = cssDefaults[textarea.id];
    });
});