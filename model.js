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
  /** @type {Array.<Departure>} */
  this.routes = []
  /** @type {Array.<{bus: BusStop,dist: number}>} */
  this.proximity = []
  /** @type {Object.<string, Object.<string, Array<Departure>>>} */
  this.stops = {}

  this.append = function (aNextBus) {
    var that = this;
    aNextBus.forEach(function (nb) {

      if(that.stops[nb.busStop.number] === undefined) {
        that.stops[nb.busStop.number] = {}
      }
      if(that.stops[nb.busStop.number][nb.routeNo] === undefined) {
        that.stops[nb.busStop.number][nb.routeNo] = [];
        that.routes.push(nb);
        that.proximity.push({
          bus: nb.busStop,
          dist: nb.busStop.distance
        });
      }
      that.stops[nb.busStop.number][nb.routeNo].push(nb);
    });
    this.proximity.sort((function (l, r) {
      return l.dist - r.dist;
    }));

    return this;
  }
}

module.exports = {
  BusStop: BusStop,
  Departure: Departure,
  NextBusSchedule: NextBusSchedule
}
