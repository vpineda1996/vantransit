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

main.show();

function stringifyAndLog(value) {
  console.log(JSON.stringify(value));
}

// Translink.getStops(49.248523, -123.108800, 500, stringifyAndLog, stringifyAndLog);
(function(){
  var menu;
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
    if(!menu) menu = Views.buildMainMenu(new NextBusSchedule().append(aNextBuses));
    menu.show();
    //showNextCard(aNextBuses, 0)
  }
  main.on('click', 'up', function (e) {
    Translink.getNextBus(new BusStop('60980', 'Any', '007'), activateWindow, stringifyAndLog);
  });
})()

main.on('click', 'select', function (e) {
  var wind = new UI.Window({
    backgroundColor: '#0000AA'
  });
  // var radial = new UI.Radial({
  //   size: new Vector2(140, 140),
  //   angle: 0,
  //   angle2: 300,
  //   radius: 20,
  //   backgroundColor: 'white',
  //   borderColor: 'celeste',
  //   borderWidth: 1
  // });
  var textfield = new UI.Text({
    size: new Vector2(60, 38),
    font: 'leco-38-bold-numbers',
    text: '25',
    textAlign: 'center'
  });

  var minsFild = new UI.Text({
    size: new Vector2(54, 18),
    font: 'gothic-18-bold',
    text: 'min',
    textAlign: 'left'
  });

  var andIn = new UI.Text({
    size: new Vector2(140, 18),
    font: 'gothic-18-bold',
    text: 'and in 4, 10 min',
    textAlign: 'center'
  });

  var busStopTag = new UI.Text({
    size: new Vector2(60, 18),
    font: 'gothic-18-bold',
    text: '45654',
    textAlign: 'left'
  });

  var busNumber = new UI.Text({
    size: new Vector2(80, 36),
    font: 'leco-36-bold-numbers',
    text: '007',
    textAlign: 'right'
  });

  var busDirection = new UI.Text({
    size: new Vector2(140, 14),
    font: 'gothic-14-bold',
    text: 'BROADWAY CITY HALL',
    textAlign: 'center'
  });
  var windSize = wind.size();


  var busNumberPos = busNumber.position()
    .addSelf(new Vector2(windSize.x * 0.5, 10))
    .subSelf(new Vector2(busNumber.size().x + busStopTag.size().x).multiplyScalar(0.5));

  var busStopTagPos = busStopTag.position()
    .addSelf(busNumberPos)
    .addSelf(busNumber.size())
    .subSelf(new Vector2(0, busStopTag.size().y));

  var busDirectionPos = busDirection.position()
    .addSelf(new Vector2(0, busNumberPos.y))
    .addSelf(new Vector2(0, busNumber.size().y))
    .addSelf(new Vector2(windSize.x, 0).multiplyScalar(0.5))
    .subSelf(new Vector2(busDirection.size().x, 0).multiplyScalar(0.5));

  // and in field
  var andInPos = andIn.position()
    .addSelf(new Vector2(windSize.x * 0.5, windSize.y))
    .subSelf(new Vector2(andIn.size().x * 0.5, andIn.size().y))
    .subSelf(new Vector2(0, 20));

  var textfieldPos = textfield.position()
    .addSelf(new Vector2(0, andInPos.y))
    .addSelf(new Vector2(windSize.x * 0.5, 0))
    .subSelf(new Vector2(textfield.size().x * 0.5, textfield.size().y));

  // mins field
  var minsFildPos = minsFild.position()
    .addSelf(textfieldPos)
    .addSelf(textfield.size())
    .subSelf(new Vector2(0, minsFild.size().y));

  busStopTag.position(busStopTagPos);
  busNumber.position(busNumberPos);
  busDirection.position(busDirectionPos);
  textfield.position(textfieldPos);
  minsFild.position(minsFildPos);
  andIn.position(andInPos);

  wind.add(minsFild);
  wind.add(andIn);
  wind.add(textfield);
  wind.add(busStopTag);
  wind.add(busNumber);
  wind.add(busDirection);
  wind.show();
});