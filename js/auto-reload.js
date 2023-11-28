//username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; delete a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      };
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      };
    };
    return "";
  };
$(document).ready(
    ()=>{
        if(!getCookie('reload')){
            document.cookie = 'reload=1; expires=Wed, 29 Nov 2023 00:00:00 UTC;';
            document.location.pathname = document.location.pathname;
        };
        if(getCookie('reload') === '1'){
            console.log('cookie exists');
        };
    }
);