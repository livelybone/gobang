/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../../../utils/get-data'), initPlayer = require('../../../utils/init-player');

exports.method = 'POST';
exports.route = '/give-up/response';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    var finger = data.finger, accept = data.accept;

    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.opponent.finger === finger
      });

    var res1 = opponent.listenGiveUpResponseHandler && opponent.listenGiveUpResponseHandler.res;
    if (accept) {
      // 接受，我赢了
      if (res1)
        res1.end(JSON.stringify({gameOver: true, winner: {finger: me.finger, role: me.role}, type: 'GIVEUP'}));

      res.end(JSON.stringify({gameOver: true, winner: {finger: me.finger, role: me.role}, type: 'GIVEUP'}));

      initPlayer(opponent);
      initPlayer(me);
    } else {
      // 拒绝，继续游戏
      if (res1)
        res1.end(JSON.stringify({gameOver: false, winner: '', player: {finger: me.finger, role: me.role}}));

      res.end(JSON.stringify({gameOver: false, winner: '', player: {finger: me.finger, role: me.role}}));
    }

    // 初始化 listenGiveUpResponseHandler
    opponent.listenGiveUpResponseHandler = null;
  })
};