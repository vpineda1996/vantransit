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

var busStops = [new BusStop('50363', 'Name', '007', 10), new BusStop('50363', 'Name', '007', 11)];

(function(){
  var menu;
  var activateWindow = function (aNextBuses) {
    Views.buildSavedStopsStack(new NextBusSchedule().append(aNextBuses), busStops).show();

    //showNextCard(aNextBuses, 0)
    // main.hide();
  };
  Translink.getNextBus(new BusStop('50363', 'Any'), activateWindow, stringifyAndLog);
})();


main.show();

function stringifyAndLog(value) {
  console.log('Error: ' + JSON.stringify(value));
}