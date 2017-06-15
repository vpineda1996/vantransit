var method = 'GET';
var api = (function(){
    var url = "http://api.translink.ca/rttiapi/v1"
    var apiKey = '0GKoVlC6TgpNJJNRjZ1r'
    function getWithApiKey(url, routes, fields) {
        fields["apiKey"] = apiKey
        return url + routes.join("") + "?" + Object.keys(fields).map(function(arg){ return arg + "=" + fields[arg]}).join("&")
    }
    return {
        stops: url + "/stops",
        buses: url + "/buses",
        route: url + "/routes",
        getWithApiKey: getWithApiKey
    }
})()


function getStops(lat, long, radius) {
    var url = api.getWithApiKey(api.stops, [], {
        lat: lat,
        long: long,
        radius: radius
    });
    console.log(url)
    request(url, parseStopsXML, parseStopsXML)
}

function parseStopsXML(xmlRes) {
    var xmlDoc = xmlRes.responseXML;
    console.log(xmlRes.responseText);
    console.log(xmlDoc);
}

function request(url, callbackSuccess, callbackFail) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.status == 200) callbackSuccess(this)
        else callbackFail(this)
    };
    request.open(method, url);
    request.send();
}

module.exports = {
    echo: 'echo',
    getStops: getStops
}