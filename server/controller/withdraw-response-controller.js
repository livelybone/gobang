/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data');

exports.method = 'POST';
exports.route = '/withdraw/response';
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

    var res1 = opponent.listenWithdrawResponseHandler && opponent.listenWithdrawResponseHandler.res;
    if (accept) {
      // 接受，我赢了
      if (res1)
        res1.end(JSON.stringify({
          type: 'WITHDRAW',
          accepted: true,
          player: {finger: opponent.finger, role: opponent.role}
        }));

      res.end(JSON.stringify({
        type: ' WITHDRAW',
        accepted: true,
        player: {finger: opponent.finger, role: opponent.role}
      }));

    } else {
      // 拒绝，继续游戏
      if (res1)
        res1.end(JSON.stringify({type: 'WITHDRAW', accepted: false}));

      res.end(JSON.stringify({type: 'WITHDRAW', accepted: false}));
    }

    // 初始化 listenWithdrawResponseHandler
    opponent.listenWithdrawResponseHandler = null;
  })
};