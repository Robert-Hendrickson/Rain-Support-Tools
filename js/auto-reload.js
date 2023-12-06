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
$(window).ready(  
    () => {
        if(!getCookie('reloadpage')){
            //document.cookie = 'reload=1; expires=Wed, 29 Nov 2023 00:00:00 UTC;';
            setCookie();
            document.location.pathname = document.location.pathname;
        };
        if(getCookie('reloadpage') === '1'){
            console.log('no reload executed');
        };
      }
);
function setCookie(){
  let x = new Date();
  x.setDate(x.getDate() + 7);
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
  let cookieExpiration = ';expires='+get_day(x.getDay())+', '+get_dd(x.getDate())+', '+get_month(x.getMonth())+' '+ x.getFullYear()+' 01:00:00 GMT';;
  document.cookie = 'reloadpage=1'+ cookieExpiration;
 };