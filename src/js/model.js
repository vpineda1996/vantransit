/**
 * Created by vpineda on 2017-06-16.
 */
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
    /** @type {Object.<string, Array<String>>} */
    this.nextIn = {}
    /** @type {Object.<string, Array<String>>} */
    this.stops = {}

    this.append = function (aNextBus) {
        var that = this;
        aNextBus.forEach(function(nb) {
            if (that.nextIn[nb.routeNo] === undefined) {
                that.routes.push(nb);
                that.nextIn[nb.routeNo] = [];
                that.proximity.push({
                    bus: nb.busStop,
                    dist: nb.busStop.distance
                });
            }

            if(that.stops[nb.busStop.number] === undefined) {
                that.stops[nb.busStop.number] = []
            } else if (that.stops[nb.busStop.number].indexOf(nb.routeNo) === -1) {
                that.stops[nb.busStop.number].push(nb.routeNo);
            }

            that.nextIn[nb.routeNo].push(nb.nextBusIn)
        });
        this.proximity.sort((function(l, r) {
            return l.dist < r.dist;
        }));

        return this;
    }
}

module.exports = {
    BusStop: BusStop,
    Departure: Departure,
    NextBusSchedule: NextBusSchedule
}
