function buildBanner(bannerArray = ['Test Title','Test content','banner-test'],banner_dates = false) {
    if (banner_dates) {
        let current_date = new Date();
        let start_date = new Date(banner_dates[0]);
        let end_date = new Date(banner_dates[1]);
        if ((current_date <= end_date, current_date >= start_date) && !getCookie(bannerArray[2])) {
            let new_div = document.createElement('div');
            new_div.id = bannerArray[2];
            new_div.classList.add('banner-wrapper');
            new_div.innerHTML = `<div class="banner-content">
                <h2>${bannerArray[0]}</h2>
                <p>${bannerArray[1]}</p>
            </div>
            <button class="btn primary">Close</button>
            </div>`;
            document.querySelector('body').prepend(new_div);
            document.querySelector(`#${bannerArray[2]} button.btn`).addEventListener('click', function() {
                closeBanner(bannerArray[2],true);
            });
        }
    } else {
        let new_div = document.createElement('div');
        new_div.id = bannerArray[2];
        new_div.classList.add('banner-wrapper');
        new_div.innerHTML = `<div class="banner-content">
                <h2>${bannerArray[0]}</h2>
                <p>${bannerArray[1]}</p>
            </div>
            <button class="btn primary">Close</button>
            </div>`;
        document.querySelector('body').prepend(new_div);
        document.querySelector(`#${bannerArray[2]} button.btn`).addEventListener('click', function() {
            closeBanner(bannerArray[2]);
        });
    }
}

function closeBanner(bannerID,cookie = false){
    document.querySelector(`#${bannerID}`).remove();
    if (cookie) {
        setCookie(bannerID,'closed');
    }
}