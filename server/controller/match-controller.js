/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.method = 'POST';
exports.route = '/match';
exports.controller = function (req, res) {
  "use strict";
  getFinger(req, function (finger) {
    var me = players.find(function (player) {
        return player.finger === finger
      }),
      matches = players.filter(function (player) {
        return player.matchHandler && player.matchHandler.res
      });

    // 如果有正在匹配的玩家，则匹配成功，并删除玩家的matchHandler，否则给自己添加matchHandler，等待其他玩家加入
    if (matches.length > 0) {
      matches[0].matchHandler.res.end(JSON.stringify({match: 'SUCCESS', player: {finger: finger}}));
      res.end(JSON.stringify({match: 'SUCCESS', player: {finger: matches[0].finger}}));
      matches[0].matchHandler = null;
    } else me.matchHandler = {res: res};
  })
};