/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const RouteManager = require("./utils/RouteManager");
const ChessController = require('./controller/ChessController');
const PlayerController = require('./controller/PlayerController');

class Controllers {

  constructor() {
    this.routes = RouteManager.routes;
    new ChessController();
    new PlayerController();
  }
}

module.exports = new Controllers();