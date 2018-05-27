
$localhost = "https://jk520.cc";
$(document).ready(function () {
    setTimeout('load()', 60);
})
function load() {
    $(".InputFocus input").focus(function () {
        $(this).blur();
    });
}
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
var applocalStorage={
    getItem:function(name){
        name=="guest_id"?name='uid':'';
        return localStorage.getItem(name)||10774;
    },
    setItem:function(name,val){
    	   localStorage.setItem(name,val);
    }
}


