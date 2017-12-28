/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../../../utils/get-data');

exports.method = 'POST';
exports.route = '/withdraw/response';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    var finger = data.data.finger, accept = data.data.accept;

    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.opponent.finger === finger
      });

    if (!me || !opponent) res.end(JSON.stringify({status: 400, errMsg: '不在对弈中'}));

    var res1 = opponent.listenWithdrawResponseHandler && opponent.listenWithdrawResponseHandler.res;
    if (accept) {
      // 接受，后退一步
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

      // 当前棋手不是悔棋方的情况下，需要结束悔棋一方的 chessHandler 监听
      var res2 = opponent.chessHandler && opponent.chessHandler.res;
      if (res2) res2.end(JSON.stringify({
        type: 'WITHDRAW',
        accepted: true,
        player: {finger: opponent.finger, role: opponent.role}
      }))
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