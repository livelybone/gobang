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
      res.end(JSON.stringify({match: 'FAILED', msg: '该玩家已经开始游戏'}))
    } else {
      // 如果对方还在等待，则同意opponent的邀请，并随机指定黑白方，更新双方的状态

      var role = Math.random() >= .5 ? ['black', 'white'] : ['white', 'black'];
      me.role = role[0];
      opponent.role = role[1];

      opponent.inviteHandlers.map(function (handler) {
        if (handler.opponentFinger === finger) {
          handler.res.end(JSON.stringify({
            opponent: {finger: finger, role: role[0]},
            match: 'SUCCESS',
            role: role[1]
          }));
          return true;
        }
        // 结束handler
        handler.res.end('chess');
      });

      me.inviteHandlers.map(function (handler) {
        // 结束handler
        handler.res.end('chess')
      });

      //
      res.end(JSON.stringify({opponent: {finger: opponentFinger, role: role[1]}, match: 'SUCCESS', role: [0]}));

      // 双方添加opponent
      opponent.opponent = {finger: finger};
      me.opponent = {finger: opponentFinger};

      // 删除双方的inviteHandlers
      opponent.inviteHandlers = null;
      me.inviteHandlers = null;

      // 删除双方的listenInvitedHandle
      opponent.listenInvitedHandle.res.end('chess');
      me.listenInvitedHandle.res.end('chess');
      opponent.listenInvitedHandle = null;
      me.listenInvitedHandle = null;

      // 删除双方的matchHandler
      opponent.matchHandler.res.end('chess');
      me.matchHandler.res.end('chess');
      opponent.matchHandler = null;
      me.matchHandler = null;
    }
  })
};