/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.route = '/enter';
exports.controller = function (req, res) {
  var finger = getFinger(req.url);
  var player = players.find(function (player) {
    return player.finger === finger
  });
  if (!player) {
    player = {finger: finger};
    players.push(player);
    queue.map(function (q) {
      if (q.type === 'player')
        q.res.end(JSON.stringify({player: player, enter: true}));
    })
  }
  res.end(JSON.stringify({players: players, isNew: !player}));
};