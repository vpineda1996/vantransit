var UI = require('ui');
var Vector2 = require('vector2');
var NextBusSchedule = require('./model.js').NextBusSchedule;
var BusStop = require('./model.js').BusStop;
var Translink = require('./translink.js');
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
 *
 * @param {NextBusSchedule} dictionary
 * @param {Array.<BusStop>} aBusStops
 * @param {Function} fOnFirstCardOn
 * @param {Function} fOnFirstCardLeave
 */
function buildSavedStopsStack(dictionary, aBusStops, fOnFirstCardOn, fOnFirstCardLeave) {
  var aSortedBusStops = Array.from(aBusStops).sort(function (lBusStop, rBusStop) {
    if(dictionary.proximityMap[lBusStop.number] === undefined) {
      return -1;
    } else if(dictionary.proximityMap[rBusStop.number] === undefined) {
      return 1;
    } else return dictionary.proximityMap[lBusStop.number] - dictionary.proximityMap[lBusStop.number]
  });

  return (function () {
    var i = 0;
    var splashScreen;
    var currentBusView;

    function nextWindow() {
      if(aSortedBusStops.length > i && !splashScreen) {
        splashScreen = buildSplashScreen();
        splashScreen.show();
        Translink.getNextBus(aSortedBusStops[i], getBusesSuccess, getBusesFailure);
      }
    }

    function hideWindow(window) {
      window.hide();
    }

    function onStackPop(window, index) {
      i = index - 1;
      if (fOnFirstCardLeave && index === 0) {
        fOnFirstCardLeave();
      }
      hideWindow(window);
    }

    function onStackPush() {
      i++;
      nextWindow();
    }

    function onWindowRender(oBusView) {
      currentBusView = oBusView;
    }

    function bindBusView(oBusView, index) {
      oBusView.on('click', 'down', onStackPush);
      oBusView.on('click', 'up', onStackPop.bind(null, oBusView, index));
      oBusView.on('click', 'back', onStackPop.bind(null, oBusView, index));
      oBusView.on('show', onWindowRender.bind(null, oBusView));
      return oBusView;
    }

    function renderNewWindow(oBusStop, index) {
      if(splashScreen) {
        splashScreen.hide();
        splashScreen = undefined;
      }
      if (fOnFirstCardOn) {
        fOnFirstCardOn();
        fOnFirstCardOn = null;
      }

      var window = bindBusView(buildBusView(dictionary, oBusStop), index);
      window.show();
    }
    
    function refreshView() {
      if(currentBusView) {
        Translink.getNextBus(aSortedBusStops[i], function (aNewBuses) {
          currentBusView.hide();
          dictionary.append(aNewBuses);
          bindBusView(buildBusView(dictionary, aSortedBusStops[i])).show();
        }, function () {});
      }
    }

    function getBusesSuccess(aNextBus) {
      dictionary.append(aNextBus);
      renderNewWindow(aSortedBusStops[i], i);
    }

    function getBusesFailure() {
      throw new Error('Cannot get buses!')
    }

    function init() {
      nextWindow();
    }

    return { 
      show: init,
      refresh: refreshView
    };

  })();

}

function buildSplashScreen() {
  return new UI.Card({
    title: 'Please wait while we get your schedule',
    subtitleColor: 'indigo' // Named colors
  });
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
  buildBusView: buildBusView,
  buildSplashScreen: buildSplashScreen,
  buildSavedStopsStack: buildSavedStopsStack
}