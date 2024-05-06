function openTab(el){
    if(el.target.classList.value.match(/open/)){
        el.target.classList.value = '';
    } else {
        $('.container > h2').removeClass('open');
        el.target.classList.value = 'open';
    }
}


function displayTab(el){
    let section = el.target.id;
    $(`.container-2 div`).removeClass('active');
    $('#info-tabs div').removeClass('active');
    $(`.container-2 #${section}`).addClass('active');
    el.target.classList.value = 'active';
}

$(window).ready(function(){
    $('#info-tabs div').on('click', displayTab);
})

$(window).ready(function (){
    $('.container > h2').on('click', openTab);
})