function buildBanner(bannerArray = ['Test Title','Test content','banner-test'],banner_start_date,banner_end_date) {
    let current_date = new Date();
    if ((current_date <= banner_end_date, current_date >= banner_start_date) && !getCookie(bannerArray[2])) {
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
    setCookie(bannerID,'closed');
}