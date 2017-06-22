var UI = require('ui');
var Vector2 = require('vector2');

var Translink = require('./translink.js');
var Model = require('./model.js');
var AppSettings = require('./appSettings.js');
var BusStop = Model.BusStop;
var Departure = Model.Departure;
var NextBusSchedule = Model.NextBusSchedule;

var Views = require('./views.js');

var main = Views.buildSplashScreen();
var stackView;
var busStops = AppSettings.getSavedBuses();


function onFirstLoad() {
  main.hide();
}

function onExit() {
  Views.buildSplashScreen().show();
}

var activateWindow = function (aNextBuses) {
  stackView = Views.buildSavedStopsStack(new NextBusSchedule().append(aNextBuses), busStops, onFirstLoad, onExit);
  stackView.show();
};

Translink.getNextBus(new BusStop('50363', 'Any'), activateWindow, stringifyAndLog);

main.show();

navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos.coords.latitude + ", " + pos.coords.longitude)
}, function () {

},{
    enableHighAccuracy: false,
    maximumAge: 10000,
    timeout: 10000
});

function stringifyAndLog(value) {
  console.log('Error: ' + JSON.stringify(value));
}