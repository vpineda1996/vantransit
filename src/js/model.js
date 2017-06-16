/**
 * Created by vpineda on 2017-06-16.
 */
function BusStop(number, name, route, distance) {
    this.number = number;
    this.name = name;
    this.route = route;
    this.distance = distance;
}

function Departure(routeNo, destination, nextBusIn, busStop) {
    this.routeNo = routeNo;
    this.destination = destination;
    this.nextBusIn = nextBusIn;
    this.busStop = busStop
}

function NextBusSchedule() {
    /** @type {Array<Departure>} */
    this.routes = []
    /** @type {Array<{bus: BusStop,dist: number}>} */
    this.proximity = []
    /** @type {Object.<string, Array<String>>} */
    this.nextIn = {}

    this.append = function (aNextBus) {
        var that = this;
        aNextBus.forEach(function(nb) {
            if (that.nextIn[nb.nextIn] === undefined) {
                that.routes.push(nb);
                that.nextIn[nb.routeNo] = [];
                that.proximity.push({
                    bus: nb.busStop,
                    dist: nb.busStop.distance
                });
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
