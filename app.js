var UI = require('ui');
var Vector2 = require('vector2');

var AppSettings = require('./appSettings.js');
var Views = require('./views.js');

/**
 * @param {function(number, number)} f
 */
function getLocation(f) {
  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos.coords.latitude + ", " + pos.coords.longitude);
    f(pos.coords.latitude, pos.coords.longitude)
  }, function () {},{
    enableHighAccuracy: false,
    maximumAge: 10000,
    timeout: 10000
  });
}

var busStops = AppSettings.getSavedBuses();
var mainView = Views.buildMainMenu(busStops, getLocation);


mainView.init();