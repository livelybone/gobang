/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'action/action',
    'component/broadcast-animation',
    'component/overlay',
    'component/start-game',
    'utils/get-name',
    'event-handler'
  ],
  function (jquery, action, broadcast, overlay, startGame, getName, handler) {
    var Players = [];

    function init(id) {
      $(id).append($(
        '<h1 class="title">玩家列表 <span id="broadcast"></span></h1>'
      ));
    }

    function renderPlayerList(id, players) {
      $(id).find('div.player').map(function (index, child) {
        $(child).remove();
      });
      players
        .filter(function (player) {
          if (player.finger === finger) {
            renderPlayer(id, player, true);
            return false;
          }
          return true;
        })
        .map(function (player) {
          renderPlayer(id, player);
        })
    }

    function renderPlayer(parentId, player, isMe) {
      var div = $(
        '<div class="player" id="' + player.finger.replace('.', '') + '">' +
        '<h2 class="name">' +
        (isMe ? '我' : getName(player)) +
        '</h2>' +
        '<button class="chess-btn' + (player.isChess ? ' disable' : '') + '">' +
        (isMe ? '在线匹配' : player.isChess ? '正在游戏' : '对弈') +
        '</button>' +
        '</div>'
      );
      div.find('button.chess-btn').bind('click', function () {
        if (!window.chessboard.isChess) {
          if (!isMe) {
            action.invite(player.finger, handler.inviteHandler);
          } else {
            action.match(function (data) {
              if (data.match) {
                handler.matchSuccessHandler(data.opponent, data.role);
              }
            })
          }
        } else {
          var fn = function () {
            $('#overlay-tip-holder').remove();
          };
          overlay.overlayTipHolder('请先完成本局比赛！', fn, function () {
            setTimeout(fn, 1000);
          })
        }
      });
      $(parentId).append(div);
    }

    return {Players: Players, init: init, renderPlayerList: renderPlayerList, renderPlayer: renderPlayer};
  });