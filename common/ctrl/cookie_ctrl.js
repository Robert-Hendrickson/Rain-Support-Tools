//reloadpage=1; expires=Thu, 01 Jan 1970 00:00:00 UTC; delete a cookie
function getCookie(cookie_name) {
	cookie_name += "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let cookie_array = decodedCookie.split(';');
	for(let i = 0; i <cookie_array.length; i++) {
		let cookie_iteration = cookie_array[i];
		while (cookie_iteration.charAt(0) == ' ') {
			cookie_iteration = cookie_iteration.substring(1);
		};
		if (cookie_iteration.indexOf(cookie_name) == 0) {
			return cookie_iteration.substring(cookie_name.length, cookie_iteration.length);
		};
	};
	return "";
};
function setCookie(cookie_name,cookie_value,cookie_life_length = 7){
	let current_date = new Date();
	current_date.setDate(current_date.getDate() + cookie_life_length);
	function get_day(day){
		switch(day){
			case 0: return 'Sun';
			case 1: return 'Mon';
			case 2: return 'Tue';
			case 3: return 'Wed';
			case 4: return 'Thu';
			case 5: return 'Fri';
			case 6: return 'Sat';
		}
	};
	function get_dd(dd){
	if(dd < 10){
		return '0'+dd;
	}else{
		return dd;
	};
	};
	function get_month(month){
		switch(month){
			case 0: return 'Jan';
			case 1: return 'Feb';
			case 2: return 'Mar';
			case 3: return 'Apr';
			case 4: return 'May';
			case 5: return 'Jun';
			case 6: return 'Jul';
			case 7: return 'Aug';
			case 8: return 'Sep';
			case 9: return 'Oct';
			case 10: return 'Nov';
			case 11: return 'Dec';
		}
	};
	let cookieExpiration = ';expires='+get_day(current_date.getDay())+', '+get_dd(current_date.getDate())+', '+get_month(current_date.getMonth())+' '+ current_date.getFullYear()+' 01:00:00 GMT';
	document.cookie = cookie_name + '=' + cookie_value + cookieExpiration;
};

function deleteCookie(cookie_name){
	//sets cookie expiration to yesterday which causes the browser to delete the cookie
	setCookie(cookie_name,'deleted',-1);
}