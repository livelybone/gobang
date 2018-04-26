/**
 * Created by Livelybone on 2017-12-17.
 */

define(function () {
  function comparePlayers(oldPlayers, players) {
    var playerArr = [];
    var playerFac = function (finger, name, enterOrLeave) {
      return {finger: finger, name: name, enterOrLeave: enterOrLeave || 'enter'}
    };
    // 新增的玩家
    players.forEach(function (player) {
      var isNew = !oldPlayers.some(function (p) {
        return p.finger === player.finger
      });
      if (isNew) playerArr.push(playerFac(player.finger, player.name))
    });
    // 离开的玩家
    oldPlayers.forEach(function (player) {
      var isLeave = !players.some(function (p) {
        return p.finger === player.finger
      });
      if (isLeave) playerArr.push(playerFac(player.finger, player.name, 'leave'))
    });
    return playerArr
  }

  return comparePlayers;
});