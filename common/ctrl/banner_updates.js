function buildBanner(bannerArray = ['Test Title','Test content','banner-test']) {
    $('body').prepend(`<div id="${bannerArray[2]}" class="banner-wrapper">
        <div class="banner-content">
            <h2>${bannerArray[0]}</h2>
            <p>${bannerArray[1]}</p>
        </div>
        <button class="btn primary" onclick="closeBanner('${bannerArray[2]}')">Close</button>
        </div>`);
}

function closeBanner(bannerID){
    $(`#${bannerID}`).remove();
    setCookie(bannerID,'closed',14);
}

$(window).ready(function (){
    if((/bug-ticket-v2/).test(location.pathname)){
        if(!getCookie('banner-format')){
            buildBanner(['Tool Update!','The expected Results field has been removed. You will no longer be required to enter the expected outcome of the system.', 'banner-format']);
        }
    }
})