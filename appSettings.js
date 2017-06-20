/**
 * Created by vpineda1996 on 6/19/2017.
 */

var Settings = require('settings');
var Clay = require('./../clay/clay');
var clayConfig = require('./config/config.js');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});
var Model = require('./model.js');
var BusStop = Model.BusStop;

Pebble.addEventListener('showConfiguration', function(e) {
    Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (e && !e.response) {
        return;
    }
    var dict = clay.getSettings(e.response);

    // Save the Clay settings to the Settings module.
    Settings.option(dict);
});

function cssColor(color) {
    color = color.toString(16);
    while (color.length < 6) {
        color = '0' + color;
    }
    return '#' + color;
}

function getSavedBuses() {
    return [0, 1, 2, 3, 4, 5].map(function (number) {
        var routeNo = Settings.option('routeNo' + number), busStopNo = Settings.option('stopNo' + number);
        if (routeNo && busStopNo) {
            return new BusStop(busStopNo, Settings.option('description' + number), routeNo);
        }
        return null;
    }).filter(function (obj) { return obj !== null });
}

module.exports = {
    getSavedBuses: getSavedBuses,
    cssColor: cssColor
}