/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

exports.route = '/enter';
exports.controller = function (finger, res) {
  var player = players.find(function (player) {
    return player.finger === finger
  });
  if (!player) players.push({finger: finger});
  res.end(JSON.stringify({players: players, isNew: !player}));
};