/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../../../utils/get-finger');

exports.method = 'GET';
exports.route = '/give-up/listen';
exports.controller = function (req, res) {
  "use strict";
  getFinger(req, function (finger) {
    if (players.length < 1) return;

    // 给自己添加listenGiveUpHandler
    players.find(function (player) {
      if (player.finger === finger) {
        player.listenGiveUpHandler = {res: res};
        return true;
      }
    })
  })
};