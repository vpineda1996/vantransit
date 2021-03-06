var UI = require("ui");
var Vector2 = require("vector2");
var NextBusSchedule = require("./model.js").NextBusSchedule;
var BusStop = require("./model.js").BusStop;
var Translink = require("./translink.js");

/**
 * @param title
 * @returns Card
 */
function buildSplashScreen(title) {
  "use strict";
  return new UI.Card({
    title: title,
    subtitleColor: "indigo" // Named colors
  });
}

/**
 * @param {string} error
 * @returns Card
 */
function buildErrorWindow(error) {
  "use strict";
  return new UI.Card({
    title: error,
    titleColor: "white",
    backgroundColor: "red" // Named colors
  });
}

/**
 * Builds a view displaying when the bus is coming
 * @param {NextBusSchedule} dictionary
 * @param {BusStop} busStop
 */
function buildBusView(dictionary, busStop) {
  "use strict";
  var wind = new UI.Window({
    backgroundColor: "#0000AA"
  });

  var textfield = new UI.Text({
    size: new Vector2(60, 38),
    font: "leco-38-bold-numbers",
    text: dictionary.stops[busStop.number][busStop.route][0].nextBusIn,
    textAlign: "center"
  });

  var minsFild = new UI.Text({
    size: new Vector2(54, 18),
    font: "gothic-18-bold",
    text: "min",
    textAlign: "left"
  });

  var andInStr = dictionary.stops[busStop.number][busStop.route].length > 1 ? "and in " +
    dictionary.stops[busStop.number][busStop.route].slice(1, 3).map(function (a) {
      return a.nextBusIn;
    }).join(", ") + " min" : "";

  var andIn = new UI.Text({
    size: new Vector2(140, 18),
    font: "gothic-18-bold",
    text: andInStr,
    textAlign: "center"
  });

  var busStopTag = new UI.Text({
    size: new Vector2(60, 18),
    font: "gothic-18-bold",
    text: busStop.number,
    textAlign: "left"
  });

  var busNumber = new UI.Text({
    size: new Vector2(80, 36),
    font: "leco-36-bold-numbers",
    text: busStop.route,
    textAlign: "right"
  });

  var busDirection = new UI.Text({
    size: new Vector2(140, 14),
    font: "gothic-14-bold",
    text: dictionary.stops[busStop.number][busStop.route][0].destination,
    textAlign: "center"
  });

  var busStopName = new UI.Text({
    size: new Vector2(200, 14),
    font: "gothic-14-bold",
    text: busStop.name.substring(0, 200 / 10),
    textAlign: "center"
  });
  var windSize = wind.size();

  var busNumberPos = busNumber.position()
    .addSelf(new Vector2(windSize.x * 0.5, 10))
    .subSelf(new Vector2(busNumber.size().x + busStopTag.size().x).multiplyScalar(0.5));

  var busStopNamePos = busStopName.position()
    .addSelf(new Vector2(windSize.x * 0.5, 2))
    .subSelf(new Vector2(busStopName.size().x * 0.5));

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
  busStopName.position(busStopNamePos);
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
  wind.add(busStopName);

  return wind;
}

/**
 * @param {function(function(number,number))} fOLatLon
 * @param {function} onMenuLoad
 * @param {function} fBackButtonLeavePressed
 * @returns {{show: function, refresh: function}|null}
 */
function buildLocationMenu(fOLatLon, onMenuLoad, fBackButtonLeavePressed) {
  "use strict";
  var dictionary = new NextBusSchedule();

  function onSelectBus(sectionDef, item) {
    var section = sectionDef[item.sectionIndex];
    var itemDef = section.items[item.itemIndex];
    var busStop = new BusStop(section.title.substr(0,5), section.title.substr(7),itemDef.title);
    buildSavedStopsStack(dictionary, [busStop]).show();
  }

  function buildMenu() {
    var displayedBusesMap = {};
    /**
     *
     * @param {BusStop} stop
     * @param {string} route
     * @returns {string}
     */
    var displayBusKey = function (stop, route) {
      return route + stop.name.substr(0, 2);
    };
    var sectionDef = dictionary.proximity.splice(0, 15).map(function (oBusDef) {
      var busStopNo = oBusDef.bus.number;
      var routesInStop = dictionary.stops[busStopNo];
      var items = Object.keys(routesInStop).map(function (route) {
        if (displayedBusesMap[displayBusKey(oBusDef.bus, route)] || route.length === 0) {
          return null;
        } else {
          displayedBusesMap[displayBusKey(oBusDef.bus, route)] = true;
          return {
            title: route
          };
        }
      }).filter(function (obj) {return obj !== null;});
      if (items.length > 0) {
        return {
          title: busStopNo + " - " + oBusDef.bus.name,
          items: items
        };
      } else {
        return null;
      }
    }).filter(function (obj) {return obj !== null;});

    var menu = new UI.Menu({
      sections: sectionDef
    });
    menu.on("click", "back", fBackButtonLeavePressed);
    menu.on("select", onSelectBus.bind(null, sectionDef));
    return menu;
  }

  function newView() {
    /**
     * @param {BusStop} aBusStops
     * @param splashScreen
     */
    function onReceiveStops(splashScreen, aBusStops) {
      dictionary.appendStops(aBusStops);
      buildMenu().show();
      splashScreen.hide();
    }

    function onFailStops(splashScreen) {
      splashScreen.hide();
    }

    var splashScreen = buildSplashScreen("Getting location and stops near you!");
    splashScreen.show();
    fOLatLon(function (lat, lon) {
      Translink.getStops(lat,
        lon,
        200,
        onReceiveStops.bind(null, splashScreen),
        onFailStops.bind(null, splashScreen));
    });
  }

  function init() {
    newView();
    onMenuLoad();
  }

  function refresh() {
    newView();
  }

  return {
    show: init,
    refresh: refresh
  };
}

/**
 * @param {NextBusSchedule} dictionary
 * @param {Array.<BusStop>} aBusStops
 * @param {Function} fOnFirstCardOn
 * @param {Function} fOnUpButtonLeavePressed
 * @return {{show: function, refresh: function}|null}
 */
function buildSavedStopsStack(dictionary, aBusStops, fOnFirstCardOn, fOnUpButtonLeavePressed) {
  "use strict";
  var i = 0;
  var splashScreen;
  var currentBusView;
  var aSortedBusStops = Array.from(aBusStops).sort(function (lBusStop, rBusStop) {
    if (dictionary.proximityMap[lBusStop.number] === undefined) {
      return -1;
    } else if (dictionary.proximityMap[rBusStop.number] === undefined) {
      return 1;
    } else {
      return dictionary.proximityMap[lBusStop.number] - dictionary.proximityMap[lBusStop.number];
    }
  });

  if (!aBusStops || aBusStops.length === 0) {
    return null;
  }

  console.log("Starting stack with: " + JSON.stringify(aSortedBusStops));

  function getBusesSuccess(aNextBus) {
    dictionary.append(aNextBus);
    renderNewWindow(aSortedBusStops[i], i);
  }

  function getBusesFailure() {
    if(splashScreen) {
      splashScreen.hide();
    }
    buildErrorWindow("Schedule not available for the current selection!").show();
  }

  function nextWindow() {
    if (aSortedBusStops.length > i && !splashScreen) {
      splashScreen = buildSplashScreen("Please wait while we get your schedule");
      splashScreen.show();
      Translink.getNextBus(aSortedBusStops[i], getBusesSuccess, getBusesFailure);
    }
  }

  function onStackPop(window, index) {
    i = index - 1;
    window.hide();
  }

  function onBackButtonPressed(window, index) {
    onStackPop(window, index);
  }

  function onUpButtonPressed(window, index) {
    if (fOnUpButtonLeavePressed && index === 0) {
      fOnUpButtonLeavePressed();
    }
    onStackPop(window, index);
  }

  function onStackPush() {
    i += 1;
    nextWindow();
  }

  function onWindowRender(oBusView) {
    currentBusView = oBusView;
  }

  function bindBusView(oBusView, index) {
    oBusView.on("click", "down", onStackPush);
    oBusView.on("click", "up", onUpButtonPressed.bind(null, oBusView, index));
    oBusView.on("click", "back", onBackButtonPressed.bind(null, oBusView, index));
    oBusView.on("show", onWindowRender.bind(null, oBusView));
    return oBusView;
  }

  function renderNewWindow(oBusStop, index) {
    if (splashScreen) {
      splashScreen.hide();
      splashScreen = undefined;
    }
    if (fOnFirstCardOn) {
      fOnFirstCardOn();
      fOnFirstCardOn = null;
    }
    UI.Vibe.vibrate("short");
    var window = bindBusView(buildBusView(dictionary, oBusStop), index);
    window.show();
  }

  function refreshView() {
    if (currentBusView) {
      Translink.getNextBus(aSortedBusStops[i], function (aNewBuses) {
        currentBusView.hide();
        dictionary.append(aNewBuses);
        bindBusView(buildBusView(dictionary, aSortedBusStops[i])).show();
      }, getBusesFailure);
    }
  }

  function init() {
    nextWindow();
  }

  return {
    show: init,
    refresh: refreshView
  };
}

/**
 * @param {Array.<BusStop>} aBusStops
 * @param {{function(function(number,number))}} fReturnLatLon
 * @returns {{init, refresh}}
 */
function buildMainMenu(aBusStops, fReturnLatLon) {
  "use strict";
  /** @type {{show: Function, refresh: Function}} */
  var currentView;

  function onLeaveBusStack() {
    showLocationMenu();
  }

  function onBusStackOpen() {
    return null;
  }

  function showBusStack() {
    currentView = buildSavedStopsStack(new NextBusSchedule(), aBusStops, onBusStackOpen, onLeaveBusStack);
    if (currentView) {
      currentView.show();
      return true;
    } else {
      return false;
    }
  }

  function onLocationMenuDisplay() {
    return null;
  }

  function onLeaveLocationMenu() {
    showBusStack();
  }

  function showLocationMenu() {
    currentView = buildLocationMenu(fReturnLatLon, onLocationMenuDisplay, onLeaveLocationMenu);
    if (currentView) {
      currentView.show();
      return true;
    } else {
      return false;
    }
  }

  function init() {
    if (!showBusStack()) {
      var eWindow = buildErrorWindow("No saved bus stops!, press up to find one");
      eWindow.on("click", "up", showLocationMenu);
      eWindow.show();
    }
  }

  function refresh() {
    if (currentView) {
      currentView.refresh();
    }
  }

  return {
    init: init,
    refresh: refresh
  };
}

module.exports = {
  buildMainMenu: buildMainMenu,
  buildBusView: buildBusView,
  buildSplashScreen: buildSplashScreen,
  buildSavedStopsStack: buildSavedStopsStack,
  buildLocationMenu: buildLocationMenu
};