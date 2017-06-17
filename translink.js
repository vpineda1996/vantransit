var Model = require('./model.js');
var Departure = Model.Departure;
var BusStop = Model.BusStop;

var method = 'GET';
var api = (function () {
  var url = "http://api.translink.ca";
  var apiKey = '0GKoVlC6TgpNJJNRjZ1r';

  function getWithApiKey(entry, routes, fields) {
    fields["apiKey"] = apiKey;
    routes.unshift("rttiapi", "v1", entry);
    var routesStr = routes.map(function (v) {
      return "/" + v
    }).join("");
    return url + routesStr + "?" + Object.keys(fields).map(function (arg) {
        return arg + "=" + fields[arg]
      }).join("&")
  }

  return {
    stops: "stops",
    buses: "buses",
    route: "routes",
    getWithApiKey: getWithApiKey
  }
})();

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
      elementVal(element, 'Routes').split(", ").forEach(function (route) {
        stops.push(new BusStop(
          elementVal(element, 'StopNo'),
          elementVal(element, 'Name'),
          route,
          elementVal(element, 'Distance')
        ));
      });
    }
    return stops;
  }
}

function getNextBus(busStop, callbackSuccess, callbackFail) {
  var args = {count: 3};
  if (busStop.routeNo) args = { routeNo: busStop.route, count: 3};
  var url = api.getWithApiKey(api.stops, [busStop.number, "estimates"], args);

  request(url, callback, callbackFail)

  function callback(xmlRes) {
    callbackSuccess(parseNextBusXML(xmlRes))
  }

  function parseNextBusXML(xmlRes) {
    var xmlDoc = xmlRes.responseXML;
    var stopsXML = xmlDoc.getElementsByTagName('NextBus');
    var stops = [];
    console.log('Got ' + stopsXML.length + ' buses!');
    for (var i = 0; i < stopsXML.length; i++) {
      var element = stopsXML.item(i);
      var routeNumber = elementVal(element, 'RouteNo');
      var routeXML = element.getElementsByTagName('Schedule');
      console.log('Got ' + routeXML.length + ' schedules for ' + routeNumber + '!');
      for (var j = 0; j < routeXML.length; j++) {
        var scheduleElement = routeXML.item(j);
        stops.push(new Departure(
          routeNumber,
          elementVal(scheduleElement, 'Destination'),
          elementVal(scheduleElement, 'ExpectedCountdown'),
          busStop
        ));
      }
    }
    return stops;
  }
}

function elementVal(elementToSearch, str) {
  if (elementToSearch) {
    var children = elementToSearch.getElementsByTagName(str);
    if (children.length) return children.item(0).textContent
  }
  console.log('Error processing:' + elementToSearch.textContent);
  return "";
}

function request(url, callbackSuccess, callbackFail) {
  console.log('Requesting: ' + url)
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
  getNextBus: getNextBus
}