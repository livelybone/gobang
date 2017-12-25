/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger'), initPlayer = require('../utils/init-player');

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

    // 对方赢了
    var res1 = opponent.chessHandler && opponent.chessHandler.res;
    if (res1) res1.end(JSON.stringify({
      gameOver: true,
      winner: {finger: opponent.finger, role: opponent.role}
    }));
    initPlayer(opponent);

    res.end(JSON.stringify({gameOver: true, winner: {finger: opponent.finger, role: opponent.role}}));
    initPlayer(me);
  })
};