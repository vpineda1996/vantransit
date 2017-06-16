
var UI = require('ui');
var Vector2 = require('vector2');

function buildNextBusMenu(aNextBus) {
  var items = aNextBus.map(nb => {
    return { 
      title: nb.destination,
      subtitle: nb.nextBuseIn
    }
  })
  var menu = new UI.Menu({
    sections: [{
      items: items
    }]
  });
}

module.exports = {
  buildNextBusMenu: buildNextBusMenu
}