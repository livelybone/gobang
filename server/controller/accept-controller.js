/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data');

exports.method = 'POST';
exports.route = '/accept';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    console.log(data);
    var finger = data.data.finger, opponentFinger = data.data.opponentFinger;

    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.finger === opponentFinger
      });

    if (opponent.opponent) {
      // 如果对方已匹配
      res.end(JSON.stringify({match: 'FAILED', msg: '已经开始游戏', opponent: {finger: opponent.finger}}))
    } else {
      console.log(1);
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

  if (me.inviteHandlers) me.inviteHandlers.map(function (handler) {
    // 结束handler
    handler.res.end('chess')
  });

  // 返回匹配结果
  console.log(10);
  myRes.end(JSON.stringify({opponent: {finger: opponent.finger, role: role[1]}, match: 'SUCCESS', role: role[0]}));
  console.log(11);


  // 删除双方的inviteHandlers
  opponent.inviteHandlers = null;
  me.inviteHandlers = null;

  // 删除双方的listenInvitedHandle
  console.log(opponent.listenInvitedHandle && opponent.listenInvitedHandle.res ? 'have listenInvitedHandle' : '')
  if (opponent.listenInvitedHandle && opponent.listenInvitedHandle.res)
    opponent.listenInvitedHandle.res.end('chess');
  if (me.listenInvitedHandle && me.listenInvitedHandle.res)
    me.listenInvitedHandle.res.end('chess');
  opponent.listenInvitedHandle = null;
  me.listenInvitedHandle = null;

  // 删除双方的matchHandler
  if (opponent.matchHandler && opponent.matchHandler.res)
    opponent.matchHandler.res.end('chess');
  if (me.matchHandler && me.matchHandler.res)
    me.matchHandler.res.end('chess');
  opponent.matchHandler = null;
  me.matchHandler = null;
}