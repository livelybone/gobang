/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../../../utils/get-finger');
var matchedDeal = require('./accept-controller').matchedDeal;

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

    if (!me || !opponent) res.end(JSON.stringify({status: 400, errMsg: '不在对弈中'}));

    // 如果有正在匹配的玩家，则匹配成功，否则给自己添加matchHandler，等待其他玩家加入
    if (matches.length > 0) {
      matchedDeal(me, matches[0], res);
    } else me.matchHandler = {res: res};
  })
};
