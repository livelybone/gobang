/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data');

exports.method = 'POST';
exports.route = '/invite';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    // console.log(data);
    var finger = data.data.finger, opponentFinger = data.data.opponentFinger;

    players.map(function (player) {
      // 给opponent发送邀请
      if (player.finger === opponentFinger) {
        var res1 = player.listendInvitedHandler && player.listendInvitedHandler.res;
        res1.end(JSON.stringify({player: {finger: finger}, type: 'invite'}));
        return
      }

      // 更新自己的inviteHandlers
      if (player.finger === finger) {
        if (!player.inviteHandlers) player.inviteHandlers = [];

        // 已邀请过，则更新handler
        var inviteHandler = player.inviteHandlers.find(function (handler) {
          if (handler.opponentFinger === opponentFinger) {
            handler.res = res;

            return true;
          }
        });

        // 未邀请，则添加handler
        if (!inviteHandler) player.inviteHandlers.push({opponentFinger: opponentFinger, res: res});
      }
    });
  })
};