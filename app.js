var UI = require('ui');
var Vector2 = require('vector2');

var AppSettings = require('./appSettings.js');

var Views = require('./views.js');

var busStops = AppSettings.getSavedBuses();
var mainView = Views.buildMainMenu(busStops);


mainView.init();

navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos.coords.latitude + ", " + pos.coords.longitude)
}, function () {

},{
    enableHighAccuracy: false,
    maximumAge: 10000,
    timeout: 10000
});