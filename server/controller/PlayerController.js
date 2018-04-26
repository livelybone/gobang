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
      const player = Players.players.find(player => player.finger === finger);
      if (player) {
        res.end(resFormat({players: Players.getPlayers(finger)}, 'GET_PLAYERS'));
      } else {
        Players.add({finger});
        res.end(resFormat({players: Players.getPlayers()}, 'GET_PLAYERS'));
      }
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