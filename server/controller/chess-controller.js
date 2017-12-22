/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getData = require('../utils/get-data');

exports.method = 'POST';
exports.route = '/chess';
exports.controller = function (req, res) {
  "use strict";
  getData(req, function (data) {
    console.log(data);
    var finger = data.data.finger, pos = data.data.pos;


    players.map(function (player) {
      // 给对手发送棋子位置，并清除对手的chessHandle
      if (player.opponent.finger = finger) {
        var res = player.chessHandle && player.chessHandle.res;
        res.end(JSON.stringify({pos: pos, opponent: {finger: finger}}));
        player.chessHandle = null;
        console.log('after res.end');
        return
      }

      // 给自己添加chessHandle
      if (player.finger === finger) {
        player.chessHandle = {res: res};
      }
    })
  })
};