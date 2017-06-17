var UI = require('ui');
var Vector2 = require('vector2');
var NextBusSchedule = require('./model.js').NextBusSchedule;

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

    var sections = nextBusSchedule.routes.map(function (route) {
        return {
            title: route.busStop.number + " " + route.busStop.name,
            items: nextBusSchedule.nextIn[route.routeNo].map(function (time) {
                return {
                    title: route.routeNo + " " + route.destination,
                    subtitle: 'Leaves in ' + time
                }
            })
        }
    });

    return new UI.Menu({
        highlightBackgroundColor: '#00AAFF',
        highlightTextColor: 'black',
        sections: sections
    });
}

module.exports = {
    buildNextBusScheduleCard: buildNextBusScheduleCard,
    buildMainMenu: buildMainMenu
}