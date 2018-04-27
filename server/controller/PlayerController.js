const Utils = require("../utils/Utils");
const resFormat = require("../utils/ResponseFormat").resFormat;
const Players = require("../Players");
const RouteManager = require('../utils/RouteManager');
const errorFn = require("../utils/Utils").errorFn;

class PlayerController {
  constructor() {
    RouteManager.addRoute('GET', '/enter', this.enter);
    RouteManager.addRoute('GET', '/listen/players', this.listenPlayer)
  }

  enter(req, res) {
    Utils.getFinger(req, finger => {
      Players.add({finger},res);
    }, e => errorFn(res, e));
  }

  listenPlayer(req, res) {
    Utils.getFinger(req, finger => {
      // 刷新玩家的 listenPlayersHandler
      const player = Players.players.find(player => player.finger === finger);
      player.listenPlayersHandler = {res: res};
    }, e => errorFn(res, e));
  }
}

module.exports = PlayerController;