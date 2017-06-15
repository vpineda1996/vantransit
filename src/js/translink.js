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

function BusStop(number, name, lat, long, routes){
    this.number = number;
    this.name = name;
    this.lat = lat;
    this.long = long;
    this.routes = routes;
}


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
    var stopsXML = xmlDoc.getElementsByTagName('Stop');
    var stops = [];
    
    for(var i = 0; i < stopsXML.length; i++) {
        var element = stopsXML.item(i);
        console.log(element.textContent);
        stops.push(new BusStop(
            element.getElementsByTagName('StopNo').item(0).textContent,
            element.getElementsByTagName('Name').item(0).textContent,
            element.getElementsByTagName('Latitude').item(0).textContent,
            element.getElementsByTagName('Longitude').item(0).textContent,
            element.getElementsByTagName('Routes').item(0).textContent
        ));
    }
    console.log(stops)
    return stops;
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