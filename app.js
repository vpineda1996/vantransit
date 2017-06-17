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

var main = new UI.Card({
  title: 'Please wait while we get your schedule',
  icon: 'images/menu_icon.png',
  subtitle: 'Hi',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
  //   sections: [{
  //       title: 'First section',
  //       items: [{
  //           title: 'First Item',
  //           subtitle: 'Some subtitle'
  //           // icon: 'images/menu_icon.png'
  //       }, {
  //           title: 'Second item'
  //       }]
  //   }]
});

(function(){
  var menu;
  var activateWindow = function (aNextBuses) {
    if(!menu) menu = Views.buildBusView(new NextBusSchedule().append(aNextBuses), new BusStop('60980', 'Any', '007'));
    main.hide();
    menu.show();
    //showNextCard(aNextBuses, 0)
  };
  Translink.getNextBus(new BusStop('60980', 'Any', '007'), activateWindow, stringifyAndLog);
})();


main.show();

function stringifyAndLog(value) {
  console.log(JSON.stringify(value));
}