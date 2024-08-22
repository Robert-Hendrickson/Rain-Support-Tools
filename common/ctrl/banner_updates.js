function buildBanner(bannerArray = ['Test Title','Test content','banner-test'],banner_dates = false) {
    if (banner_dates) {
        let current_date = new Date();
        let start_date = new Date(banner_dates[0]);
        let end_date = new Date(banner_dates[1]); 
        if ((current_date <= end_date, current_date >= start_date) && !getCookie(bannerArray[2])) {
            $('body').prepend(`<div id="${bannerArray[2]}" class="banner-wrapper">
                <div class="banner-content">
                    <h2>${bannerArray[0]}</h2>
                    <p>${bannerArray[1]}</p>
                </div>
                <button class="btn primary" onclick="closeBanner('${bannerArray[2]}')">Close</button>
                </div>`);
        }
    } else {
        $('body').prepend(`<div id="${bannerArray[2]}" class="banner-wrapper">
            <div class="banner-content">
                <h2>${bannerArray[0]}</h2>
                <p>${bannerArray[1]}</p>
            </div>
            </div>`);
    }
}

function closeBanner(bannerID){
    $(`#${bannerID}`).remove();
    setCookie(bannerID,'closed');
}