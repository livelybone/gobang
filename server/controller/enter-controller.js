/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'GET';
exports.route = '/enter';
exports.controller = function (req, res) {
  getFinger(req, function (finger) {
    "use strict";
    var player = players.find(function (player) {
      return player.finger === finger
    });
    if (!player) {
      player = {finger: finger};
      players.map(function (p) {
        if (p.listenHandle) {
          p.listenHandle.res.end(JSON.stringify({player: player, refresh: true}))
        }
      });
      players.push(player);
    }
    res.end(JSON.stringify({players: players, isNew: !player}));
  });
};