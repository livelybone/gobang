/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../../../utils/get-data'), initPlayer = require('../../../utils/init-player');

exports.method = 'POST';
exports.route = '/accept';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    var finger = data.data.finger, opponentFinger = data.data.opponentFinger;

    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.finger === opponentFinger
      });

    if (!me || !opponent) res.end(JSON.stringify({status: 400, errMsg: '不在对弈中'}));

    if (opponent.opponent) {
      // 如果对方已匹配
      res.end(JSON.stringify({match: 'FAILED', msg: '已经开始游戏', opponent: {finger: opponent.finger}}))
    } else {
      matched(me, opponent, res);
    }
  })
};
exports.matchedDeal = matched;

function matched(me, opponent, myRes) {
// 如果对方还在等待，则同意opponent的邀请，并随机指定黑白方，更新双方的状态

  var role = Math.random() >= .5 ? ['black', 'white'] : ['white', 'black'];

  // 双方添加opponent
  opponent.opponent = {finger: me.finger};
  me.opponent = {finger: opponent.finger};
  me.role = role[0];
  opponent.role = role[1];

  opponent.inviteHandlers.map(function (handler) {
    if (handler.opponentFinger === me.finger) {
      handler.res.end(JSON.stringify({
        opponent: {finger: me.finger, role: role[0]},
        match: 'SUCCESS',
        role: role[1]
      }));
      return true;
    }
    // 结束handler
    handler.res.end('chess');
  });

  // 返回匹配结果
  myRes.end(JSON.stringify({opponent: {finger: opponent.finger, role: role[1]}, match: 'SUCCESS', role: role[0]}));

  initPlayer.initPlayerChess(opponent);
  initPlayer.initPlayerChess(me);
}