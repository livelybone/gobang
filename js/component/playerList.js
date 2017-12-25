/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'action/action'], function (jquery, action) {
  function renderPlayerList(players) {
    $('#players').find('div.player').map(function (index, child) {
      $(child).remove();
    });
    players
      .filter(function (player) {
        if (player.finger === finger) {
          renderPlayer(player, true);
          return false;
        }
        return true;
      })
      .map(function (player) {
        renderPlayer(player);
      })
  }

  function renderPlayer(player, isMe) {
    console.log(player);
    var div = $(
      '<div class="player">' +
      '<h2 class="name">' +
      (isMe ? '我' : getName(player)) +
      '</h2>' +
      '<button class="chess-btn' + (player.isChess ? ' disable' : '') + '">' +
      (isMe ? '匹配' : player.isChess ? '正在游戏' : '对弈') +
      '</button>' +
      '</div>'
    );
    div.find('button.chess-btn').bind('click', function () {
      action.invite(player.finger, function (data) {
        if (data.match === 'REFUSE') refused(data.opponent);
        if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
      });
    });
    $('#players').append(div);
  }

  return {renderPlayerList: renderPlayerList, renderPlayer: renderPlayer};
});