/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'GET';
exports.route = '/get/invite';
exports.controller = function (req, res) {
  "use strict";
  getFinger(req, function (finger) {
    // 给自己添加listenInvitedHandler
    players.find(function (player) {
      if (player.finger === finger) {
        player.listendInvitedHandler = {res: res};
        return true;
      }
    })
  })
};