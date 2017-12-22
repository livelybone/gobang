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
    console.log(data);
    var finger = data.data.finger, opponent = data.data.opponent;

    players.map(function (player) {
      // 给opponent发送邀请
      if (player.finger = opponent.finger) {
        var res = player.listendInvitedHandle && player.listendInvitedHandle.res;
        res.end(JSON.stringify({player: {finger: finger}, type: 'invite'}));
        return
      }

      // 给自己添加inviteHandle
      if (player.finger === finger) {
        player.inviteHandle = {res: res};
      }
    })
  })
};