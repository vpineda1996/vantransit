function BusStop(number, name, route, distance) {
  /** @type {string} */
  this.number = number;
  /** @type {string} */
  this.name = name;
  /** @type {string} */
  this.route = route;
  /** @type {number} */
  this.distance = (typeof (distance) === "string") ? parseFloat(distance) : distance;
}

function Departure(routeNo, destination, nextBusIn, busStop) {
  /** @type {string} */
  this.routeNo = routeNo;
  /** @type {string} */
  this.destination = destination;
  /** @type {string} */
  this.nextBusIn = nextBusIn;
  /** @type {BusStop} */
  this.busStop = busStop
}

function NextBusSchedule() {
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

  this.append = function (aNextBus) {
    Array.prototype.push.apply(this.allDepartures, aNextBus);
    this._appendToMaps(aNextBus);
    return this;
  };

  this.appendStops = function (aBusStops) {
    Array.prototype.push.apply(this.proximity, aBusStops);

  }

  this._appendToMaps = function (aNextBus) {
    var that = this;
    aNextBus.forEach(function (nb) {
      if(that.stops[nb.busStop.number] === undefined) {
        that.stops[nb.busStop.number] = {}
      }
      if(that.stops[nb.busStop.number][nb.routeNo] === undefined) {
        that.stops[nb.busStop.number][nb.routeNo] = [];
        that.proximity.push({
          bus: nb.busStop,
          dist: nb.busStop.distance
        });
      }

      if(that.routes[nb.routeNo] === undefined) {
        that.routes[nb.routeNo] = {}
      }
      if(that.routes[nb.routeNo][nb.busStop.number] === undefined) {
        that.routes[nb.routeNo][nb.busStop.number] = []
      }
      that.routes[nb.routeNo][nb.busStop.number].push(nb);
      that.stops[nb.busStop.number][nb.routeNo].push(nb);
    });

    this.proximity.sort((function (l, r) {
      return l.dist - r.dist;
    }));
    this.rebuildProximityMap();
    return this;
  };

  this.rebuildProximityMap = function () {
    var that = this;
    this.proximityMap = {};
    this.proximity.forEach(function (value, idx) {
      that.proximityMap[value.bus.number] = idx;
    })
  };

  this.rebuildMaps = function() {
    this.clearMaps();
    this._appendToMaps(this.allDepartures);
  }

  this.clearMaps = function() {
    this.routes = {};
    this.stops = {};
    this.proximity = [];
  }
}

module.exports = {
  BusStop: BusStop,
  Departure: Departure,
  NextBusSchedule: NextBusSchedule
}
