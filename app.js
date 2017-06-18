/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var Translink = require('./translink.js')
var Model = require('./model.js')
var BusStop = Model.BusStop;
var Departure = Model.Departure;
var NextBusSchedule = Model.NextBusSchedule;

var Views = require('./views.js');

var main = Views.buildSplashScreen();
var stackView;
var interval;
var busStops = [new BusStop('50363', 'Name', '007', 10), new BusStop('50363', 'Name', '025', 11)];


function onFirstLoad() {
  main.hide();
  console.log('Setting interval');
  interval = setInterval(function () {
    console.log('Running interval');
    stackView.refresh();
  }, 45000);
}

function onExit() {
  console.log('Stop interval');
  if (interval) clearInterval(interval);
  Views.buildSplashScreen().show();
}

var activateWindow = function (aNextBuses) {
  stackView = Views.buildSavedStopsStack(new NextBusSchedule().append(aNextBuses), busStops, onFirstLoad, onExit);
  stackView.show();
};

Translink.getNextBus(new BusStop('50363', 'Any'), activateWindow, stringifyAndLog);

main.show();

function stringifyAndLog(value) {
  console.log('Error: ' + JSON.stringify(value));
}