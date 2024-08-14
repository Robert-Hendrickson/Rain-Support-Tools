function buildBanner(bannerArray = ['Test Title','Test content','banner-test'],banner_end_date) {
    if ((new Date() <= banner_end_date) && !getCookie(bannerArray[2])) {
        $('body').prepend(`<div id="${bannerArray[2]}" class="banner-wrapper">
            <div class="banner-content">
                <h2>${bannerArray[0]}</h2>
                <p>${bannerArray[1]}</p>
            </div>
            <button class="btn primary" onclick="closeBanner('${bannerArray[2]}')">Close</button>
            </div>`);
    }
}

function closeBanner(bannerID){
    $(`#${bannerID}`).remove();
    setCookie(bannerID,'closed',14);
}