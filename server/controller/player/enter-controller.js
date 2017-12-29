/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../../utils/get-finger');

exports.method = 'GET';
exports.route = '/enter';
exports.controller = function (req, res) {
  getFinger(req, function (finger) {
    "use strict";
    var player1 = players.find(function (player) {
      return player.finger === finger
    });
    if (!player1) {
      var player2 = {finger: finger};
      players.map(function (p) {
        if (p.listenHandler) {
          p.listenHandler.res.end(JSON.stringify({
            player: player2,
            refresh: true,
            enterOrLeave: 'enter',
            type: 'ENTER'
          }))
        }
      });
      players.push(player2);
    }

    var p = players.filter(function (player) {
      return !player.role
    }).concat(players.filter(function (player) {
      return player.role
    })).map(function (player) {
      return {
        name: player.name,
        finger: player.finger,
        role: player.role,
        isChess: !!player.role
      }
    });
    // console.log(players.length, p);
    res.end(JSON.stringify({players: p, isNew: true}));
  });
};