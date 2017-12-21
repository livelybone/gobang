/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.route = '/leave';
exports.controller = function (req, res) {
  var finger = getFinger(req.url);
  var player = players.find(function (player) {
    return player.finger === finger
  });

  //
  queue.find(function (q, index) {
    if (q.finger === finger && q.type === 'player') {
      queue.splice(index, 1);
      return true;
    }
  });

  global.players = players.filter(function (player) {
    return player.finger !== finger;
  });

  global.chessPlayers = chessPlayers.filter(function (players) {
    var isBlack = players.black.finger === finger, isWhite = player.white.finger === finger;
    if (isBlack || isWhite) {
      queue.find(function (q, index) {
        // players.wait 正在等待的对弈方：black、white
        if (q.finger === players[players.wait].finger && q.type === 'chess') {
          q.res.end(JSON.stringify({type: 'escape', player: {finger: q.finger}}));
          queue.splice(index, 1);
          return true;
        }
      });
    }
    return !(isBlack || isWhite);
  });

  // 通知其他玩家，该玩家离开
  queue.map(function (q) {
    if (q.type === 'player')
      q.res.end(JSON.stringify({player: player, leave: true}));
  });
};