function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;


}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function addCookie(user_user,user_pass){
    var c_user=user_user;
    var c_pass=user_pass;
    setCookie('user',c_user,1);
    setCookie('pass',c_pass,1);
}
function checkCookie(){
    var c_user=$('#user_user').val();
    var c_pass=$('#user_pass').val();
}
function deleteCookie(){
    setCookie('user',"",-1);
    setCookie('pass',"",-1);
    location="/";
}