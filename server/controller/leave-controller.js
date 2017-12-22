/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'GET';
exports.route = '/leave';
exports.controller = function (req, res) {
  getFinger(req, function (finger) {
    "use strict";
    // 移除玩家
    var p = players.find(function (player, index) {
      if (player.finger === finger) {
        players.splice(index, 1);
        return true;
      }
    });

    // 终止玩家的棋局，并通知其他玩家，该玩家离开
    players.map(function (player) {
      var res;

      if (player.opponent.finger === finger) {
        player.opponent = null;
        player.chessHandle = null;
      }

      res = player.listenHandle && player.listenHandle.res;
      if (res)
        res.end(JSON.stringify({player: p, leave: true}));
    });
  });
};