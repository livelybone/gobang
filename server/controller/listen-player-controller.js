/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'GET';
exports.route = '/listen/players';
exports.controller = function (req, res) {
  getFinger(req, function (finger) {
    "use strict";
    // 刷新玩家的listenHandler
    players.find(function (player) {
      if (player.finger === finger) {
        player.listenHandler = {res: res};
      }
    })
  });
};