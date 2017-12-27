/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'POST';
exports.route = '/give-up';
exports.controller = function (req, res) {
  "use strict";
  getFinger(req, function (finger) {
    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.opponent.finger === finger
      });

    // 给对方发送请求
    var res1 = opponent.listenGiveUpHandler && opponent.listenGiveUpHandler.res;
    if (res1)
      res1.end(JSON.stringify({gameOver: false, player: {finger: me.finger, role: me.role}}));

    me.listenGiveUpReponseHandler = {res: res};
  })
};