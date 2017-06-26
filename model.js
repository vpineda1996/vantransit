/**
 *
 * @param number
 * @param name
 * @param route
 * @param distance?
 * @constructor
 */
function BusStop(number, name, route, distance) {
  "use strict";
  /** @type {string} */
  this.number = number;
  /** @type {string} */
  this.name = name || "";
  /** @type {string} */
  this.route = route;
  /** @type {number} */
  this.distance = (typeof (distance) === "string") ? parseFloat(distance) : (distance || -1);
}

function Departure(routeNo, destination, nextBusIn, busStop) {
  "use strict";
  /** @type {string} */
  this.routeNo = routeNo;
  /** @type {string} */
  this.destination = destination;
  /** @type {string} */
  this.nextBusIn = nextBusIn;
  /** @type {BusStop} */
  this.busStop = busStop;
}

function NextBusSchedule() {
  "use strict";
  /** @type {Object.<string, Object.<string, Array<Departure>>>} */
  this.routes = {};
  /** @type {Array.<{bus: BusStop,dist: number}>} */
  this.proximity = [];
  /** @type {Object.<string, number>} */
  this.proximityMap = {};
  /** @type {Object.<string, Object.<string, Array<Departure>>>} */
  this.stops = {};
  /** @type {Array.<Departure>} */
  this.allDepartures = [];

  /**
   * @param {Array.<Departure>} aNextBus
   * @return {NextBusSchedule}
   */
  this.append = function (aNextBus) {
    this._removeOldBuses(aNextBus);
    Array.prototype.push.apply(this.allDepartures, aNextBus);
    this._appendToMaps(aNextBus);
    return this;
  };
  /**
   * @param {Array.<BusStop>} aBusStops
   */
  this.appendStops = function (aBusStops) {
    this._appendStops(aBusStops);
    return this;
  };

  /**
   * @param {Array.<Departure>} aNextBus
   * @private
   */
  this._removeOldBuses = function (aNextBus) {
    var that = this;
    aNextBus.forEach(function (nb) {
      if(that.stops[nb.busStop.number] && that.stops[nb.busStop.number][nb.routeNo]) {
        that.stops[nb.busStop.number][nb.routeNo] = [];
        that.allDepartures = []; // BLOW UP ALL DEPARTURES CACHE IF WE FIND A MATCH, AVOID O(n^2) behaviour
      }

      if(that.routes[nb.routeNo] && that.routes[nb.routeNo][nb.busStop.number]) {
        that.routes[nb.routeNo][nb.busStop.number] = [];
      }
    });
  };
  /**
   * @param {Array.<BusStop>} aBusStops
   * @private
   */
  this._appendStops = function (aBusStops) {
    var that = this;
    aBusStops.forEach(function (bs) {
      if(that.stops[bs.number] === undefined) {
        that.stops[bs.number] = {};
      }
      if(that.stops[bs.number][bs.route] === undefined) {
        that.stops[bs.number][bs.route] = [];
        that.proximity.push({
          bus: bs,
          dist: bs.distance
        });
      }
      if(that.routes[bs.route] === undefined) {
        that.routes[bs.route] = {};
      }
      if(that.routes[bs.route][bs.number] === undefined) {
        that.routes[bs.route][bs.number] = [];
      }
    });
    this.rebuildProximityMap();
    return this;
  };

  /**
   * @param {Array.<Departure>} aNextBus
   * @private
   */
  this._appendToMaps = function (aNextBus) {
    var that = this;
    aNextBus.forEach(function (nb) {
      if(that.stops[nb.busStop.number] === undefined) {
        that.stops[nb.busStop.number] = {};
      }
      if(that.stops[nb.busStop.number][nb.routeNo] === undefined) {
        that.stops[nb.busStop.number][nb.routeNo] = [];
        that.proximity.push({
          bus: nb.busStop,
          dist: nb.busStop.distance
        });
      }

      if(that.routes[nb.routeNo] === undefined) {
        that.routes[nb.routeNo] = {};
      }
      if(that.routes[nb.routeNo][nb.busStop.number] === undefined) {
        that.routes[nb.routeNo][nb.busStop.number] = [];
      }
      that.routes[nb.routeNo][nb.busStop.number].push(nb);
      that.stops[nb.busStop.number][nb.routeNo].push(nb);
    });
    this.rebuildProximityMap();
    return this;
  };

  this.rebuildProximityMap = function () {
    var that = this;
    this.proximityMap = {};
    this.proximity.sort(function (l, r) {
      return l.dist - r.dist;
    });
    this.proximity.forEach(function (value, idx) {
      that.proximityMap[value.bus.number] = idx;
    });
  };

  this.rebuildMaps = function() {
    this.clearMaps();
    this._appendToMaps(this.allDepartures);
  };

  this.clearMaps = function() {
    this.routes = {};
    this.stops = {};
    this.proximity = [];
  };
}

module.exports = {
  BusStop: BusStop,
  Departure: Departure,
  NextBusSchedule: NextBusSchedule
};
