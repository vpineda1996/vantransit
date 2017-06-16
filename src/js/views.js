var UI = require('ui');
var Vector2 = require('vector2');
var NextBusSchedule = requre('./model.js').NextBusSchedule;

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

    return new UI.Menu({
        backgroundColor: 'black',
        textColor: 'blue',
        highlightBackgroundColor: 'blue',
        highlightTextColor: 'black',
        sections: sections
    });


}

module.exports = {
    buildNextBusScheduleCard: buildNextBusScheduleCard,
    buildMainMenu: buildMainMenu
}