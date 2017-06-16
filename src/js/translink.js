var method = 'GET';
var api = (function () {
  var url = "http://api.translink.ca"
  var apiKey = '0GKoVlC6TgpNJJNRjZ1r'
  function getWithApiKey(entry, routes, fields) {
    fields["apiKey"] = apiKey
    routes.unshift("rttiapi", "v1", entry)
    var routesStr = routes.map(v => "/" + v).join("")
    return url + routesStr + "?" + Object.keys(fields).map(function (arg) { return arg + "=" + fields[arg] }).join("&")
  }
  return {
    stops: "stops",
    buses: "buses",
    route: "routes",
    getWithApiKey: getWithApiKey
  }
})()

function BusStop(number, name, route) {
  this.number = number;
  this.name = name;
  this.route = route;
}

function Departure(routeNo, destination, nextBuseIn) {
  this.routeNo = routeNo;
  this.destination = destination;
  this.nextBussIn = nextBuseIn;
}

function getStops(lat, long, radius, callbackSuccess, callbackFail) {
  var url = api.getWithApiKey(api.stops, [], {
    lat: lat,
    long: long,
    radius: radius
  });

  request(url, callback, callbackFail)

  function callback(xmlRes) {
    callbackSuccess(parseStopsXML(xmlRes))
  }

  function parseStopsXML(xmlRes) {
    var xmlDoc = xmlRes.responseXML;
    var stopsXML = xmlDoc.getElementsByTagName('Stop');
    var stops = [];
    console.log('Got ' + stopsXML.length + ' stops!');
    for (var i = 0; i < stopsXML.length; i++) {
      var element = stopsXML.item(i);
      elementVal(element, 'Routes').split(", ").forEach(function (element) {
        stops.push(new BusStop(
          elementVal(element, 'StopNo'),
          elementVal(element, 'Name'),
        ));
      });
    }
    return stops;

    function elementVal(elementToSearch, str) {
      if(element) {
        var children = elementToSearch.getElementsByTagName(str)
        if (children.length) return children.item(0).textContent
      }
      console.log('Error processing:' + elementToSearch.textContent)
      return "";
    }
  }
}

function getNextBus(busStop, callbackSuccess, callbackFail) {
  var url = api.getWithApiKey(api.stops, [busStop.number, "estimates"], {
    count: 3,
    routeNo: busStop.route
  });

  request(url, callback, callbackFail)

  function callback(xmlRes) {
    callbackSuccess(parseStopsXML(xmlRes))
  }

  function parseStopsXML(xmlRes) {
    var xmlDoc = xmlRes.responseXML;
    var stopsXML = xmlDoc.getElementsByTagName('NextBus');
    var stops = [];
    for (var i = 0; i < stopsXML.length; i++) {
      var element = stopsXML.item(i);
      var routeNumber = elementVal(element, 'RouteNo');
      var routeXML = element.getElementsByTagName('Schedule');
      console.log('Got ' + routeXML.length + ' buses!');
      for (var j = 0; j < routeXML.length; j++) {
        var scheduleElement = routeXML.item(j);
        stops.push(new Departure(
          routeNumber,
          elementVal(scheduleElement, 'Destination'),
          elementVal(scheduleElement, 'ExpectedCountdown')
        ));
      }
    }
    return stops;

    function elementVal(scheduleElement, str) {
      var children = scheduleElement.getElementsByTagName(str)
      if (children.length) return children.item(0).textContent
      console.log('Error processing:' + scheduleElement.textContent)
      return "";
    }
  }
}

function request(url, callbackSuccess, callbackFail) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    if (request.readyState === request.DONE && request.status === 200) {
      callbackSuccess(this)
    } else callbackFail(this)
  };
  request.open(method, url);
  request.send();
}

module.exports = {
  getStops: getStops,
  getNextBus: getNextBus,
  BusStop: BusStop,
  Departure: Departure
}