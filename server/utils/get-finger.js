var URL = require('url'), getData = require('./get-data');
module.exports = function getFinger(req, callback) {
  getData(req, function (data) {
    "use strict";
    console.log(data);
    var finger = data.data.finger || '';

    // 判断玩家是否已存在，不存在，则记录下来，并通知其他玩家
    var player = players.find(function (player) {
      return player.finger === finger;
    });
    if (!player) {
      player = {finger: finger};
      players.push(player);
      global.queue = queue.filter(function (q) {
        if (q.finger === finger && q.type === 'player') {
          q.res.end(JSON.stringify(player));
          return false;
        }
        return true
      })
    }

    if (callback) callback(finger);
  });
};