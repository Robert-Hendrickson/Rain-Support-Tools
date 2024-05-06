function openTab(el){
    if(el.target.classList.value.match(/open/)){
        el.target.classList.value = '';
    } else {
        $('.container > h2').removeClass('open');
        el.target.classList.value = 'open';
    }
}


$(window).ready(function (){
    $('.container > h2').on('click', openTab);
})