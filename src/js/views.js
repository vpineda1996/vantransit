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
            title: route.routeNo,
            items: nextBusSchedule.nextIn[route.routeNo].forEach(function (time) {
                return {
                    title: 'Leaves in',
                    subtitle: time
                }
            })
        }
    });
    console.log(JSON.stringify(sections));
    console.log(JSON.stringify(nextBusSchedule))

    return new UI.Menu({
        sections: sections
    });


}

module.exports = {
    buildNextBusScheduleCard: buildNextBusScheduleCard,
    buildMainMenu: buildMainMenu
}