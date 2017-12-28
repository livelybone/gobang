/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../../../utils/get-finger');

exports.method = 'GET';
exports.route = '/listen/withdraw';
exports.controller = function (req, res) {
  getFinger(req, function (finger) {
    "use strict";
    if (players.length < 1) return;

    console.log('withdraw-listen');

    // 刷新玩家的 listenWithdrawHandler
    players.find(function (player) {
      if (player.finger === finger) {
        player.listenWithdrawHandler = {res: res};
        return true;
      }
    })
  });
};