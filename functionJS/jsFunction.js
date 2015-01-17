//แปลง query string ซ้ำกันเป็น Array Json
function queryStingtoArray(queryString){
    var str = queryString.split('|');
    var json=[];
    for(var i=0; i<str.length; i++){
        json[i] = queryStringToJSON(str[i]);
    }
    return json;
}
//แปลง query string เป็น Json
function queryStringToJSON(url) {
    if (url === '')
        return '';
    var pairs = (url || location.search).slice(1).split('&');
    var result = {};
    for (var idx in pairs) {
        var pair = pairs[idx].split('=');
        if (!!pair[0])
            result[pair[0].toLowerCase()] = decodeURIComponent(pair[1] || '');
    }
    return result;
}