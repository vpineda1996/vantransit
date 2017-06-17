var UI = require('ui');
var Vector2 = require('vector2');
var NextBusSchedule = require('./model.js').NextBusSchedule;
var BusStop = require('./model.js').BusStop;
/**
 *
 * @param {NextBusSchedule} nextBusSchedule
 */
function buildNextBusScheduleCard(nextBusSchedule) {

}
/**
 *
 * @param {NextBusSchedule} nextBusSchedule
 */
function buildMainMenu(nextBusSchedule) {
  // TODO
}

/**
 * Builds a view displaying when the bus is coming
 * @param {NextBusSchedule} dictionary
 * @param {BusStop} busStop
 */
function buildBusView(dictionary, busStop) {
  var wind = new UI.Window({
    backgroundColor: '#0000AA'
  });

  var textfield = new UI.Text({
    size: new Vector2(60, 38),
    font: 'leco-38-bold-numbers',
    text: dictionary.stops[busStop.number][busStop.route][0].nextBusIn,
    textAlign: 'center'
  });

  var minsFild = new UI.Text({
    size: new Vector2(54, 18),
    font: 'gothic-18-bold',
    text: 'min',
    textAlign: 'left'
  });

  console.log(JSON.stringify(dictionary))

  var andInStr = dictionary.stops[busStop.number][busStop.route].length > 1 ? 'and in '
    + dictionary.stops[busStop.number][busStop.route].slice(1, 3).map(function(a){
        return a.nextBusIn
    }).join(", ") + ' min' : "";

  var andIn = new UI.Text({
    size: new Vector2(140, 18),
    font: 'gothic-18-bold',
    text: andInStr,
    textAlign: 'center'
  });

  var busStopTag = new UI.Text({
    size: new Vector2(60, 18),
    font: 'gothic-18-bold',
    text: busStop.number,
    textAlign: 'left'
  });

  var busNumber = new UI.Text({
    size: new Vector2(80, 36),
    font: 'leco-36-bold-numbers',
    text: busStop.route,
    textAlign: 'right'
  });

  var busDirection = new UI.Text({
    size: new Vector2(140, 14),
    font: 'gothic-14-bold',
    text: dictionary.stops[busStop.number][busStop.route][0].destination,
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

  return wind;
}

module.exports = {
  buildNextBusScheduleCard: buildNextBusScheduleCard,
  buildMainMenu: buildMainMenu,
  buildBusView: buildBusView
}