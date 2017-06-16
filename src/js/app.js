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
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hi',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

function stringifyAndLog(value) {
  console.log(JSON.stringify(value));
}

// Translink.getStops(49.248523, -123.108800, 500, stringifyAndLog, stringifyAndLog);
(function(){
  var showNextCard = function(aNextBuses, idx) {
    var nb = aNextBuses[idx];
    var card = new UI.Card();
    card.title(nb.destination);
    card.subtitle(nb.nextBusIn);
    card.body('The simplest window type in Pebble.js.');
    card.on('click', 'up', function (e) {
      if(idx++ < aNextBuses.length) showNextCard(aNextBuses, idx)
    });
    card.show();
  }
  var activateWindow = function (aNextBuses) {
    var menu = Views.buildMainMenu(new NextBusSchedule().append(aNextBuses));
    menu.show();
    //showNextCard(aNextBuses, 0)
  }
  main.on('click', 'up', function (e) {
    Translink.getNextBus(new BusStop('60980', 'Any', '007'), activateWindow, stringifyAndLog);
  });
})()

main.on('click', 'select', function (e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
    textAlign: 'center'
  });
  var windSize = wind.size();
  // Center the radial in the window
  var radialPos = radial.position()
    .addSelf(windSize)
    .subSelf(radial.size())
    .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
    .addSelf(windSize)
    .subSelf(textfield.size())
    .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function (e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
