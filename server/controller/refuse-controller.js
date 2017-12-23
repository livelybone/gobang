/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data');

exports.method = 'POST';
exports.route = '/refuse';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    // console.log(data);
    var finger = data.data.finger, opponentFinger = data.data.opponentFinger;

    var me = players.find(function (player) {
        return player.finger === finger
      }),
      opponent = players.find(function (player) {
        return player.finger === opponentFinger
      });

    // 更新对方的inviteHandlers
    var inviteHandlers = opponent.inviteHandlers;

    inviteHandlers.find(function (handler, index) {
      if (handler.opponentFinger === finger) {
        handler.res.end(JSON.stringify({opponent: {finger: finger}, match: 'REFUSE'}));
        inviteHandlers.splice(index, 1);
        return true;
      }
    });

    res.end(JSON.stringify({match: 'REFUSE', opponent: {finger: opponentFinger}}));
  })
};