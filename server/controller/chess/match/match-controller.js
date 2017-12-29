/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../../../utils/get-finger'), initPlayer = require('../../../utils/init-player');

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

    if (!me) res.end(JSON.stringify({status: 400, errMsg: '玩家不存在！'}));

    // 如果有正在匹配的玩家，则匹配成功，否则给自己添加matchHandler，等待其他玩家加入
    if (matches.length > 0) {
      matched(me, matches[0], res);
    } else me.matchHandler = {res: res};
  })
};

exports.matchedDeal = matched;

function matched(me, opponent, myRes) {
  // 如果对方还在等待，则同意opponent的邀请，并随机指定黑白方，更新双方的状态

  var role = Math.random() >= .5 ? ['black', 'white'] : ['white', 'black'];

  // 双方添加opponent
  opponent.opponent = {finger: me.finger};
  me.opponent = {finger: opponent.finger};
  me.role = role[0];
  opponent.role = role[1];

  opponent.matchHandler.res.end(JSON.stringify({
    opponent: {finger: me.finger, role: me.role},
    match: 'SUCCESS',
    role: opponent.role
  }));

  // 返回匹配结果
  myRes.end(JSON.stringify({
    opponent: {finger: opponent.finger, role: opponent.role},
    match: 'SUCCESS',
    role: me.role
  }));

  initPlayer.initPlayerChess(opponent);
  initPlayer.initPlayerChess(me);

  // 刷新所有玩家的列表
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
  p.map(function (player) {
    "use strict";
    if (player.listenHandler) player.listenHandler.res.end(JSON.stringify({players: p, type: 'MATCH'}));
  });
}