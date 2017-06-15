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
    request(url, parseStopsXML, function(){
        console.log("ERROR!!!")
    })
}

function parseStopsXML(xmlRes) {
    var xmlDoc = xmlRes.responseXML;
    console.log(xmlRes.responseText);
    console.log(xmlDoc);
    console.log(xmlDoc.childNodes);
    if(xmlDoc.childNodes) {
        xmlDoc.childNodes.forEach(function(element) {
            console.log(element.nodeName + ": " + element.textContent)
        });
    }
}

function request(url, callbackSuccess, callbackFail) {
    var request = new XMLHttpRequest();
    request.onload = function() {
        if (request.readyState === request.DONE && request.status === 200) {
            callbackSuccess(this)
        } else callbackFail(this)
    };
    request.open(method, url);
    request.send();
}

module.exports = {
    echo: 'echo',
    getStops: getStops
}