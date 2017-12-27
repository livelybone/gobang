/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'action/action',
    'component/broadcast-animation',
    'utils/get-name',
    'component/overlay-tip'
  ],
  function (jquery, action, broadcast, getName, overlayTip) {
    function renderOverlay(tip) {
      "use strict";
      var overlay = $(
        '<div id="overlay">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title">' + tip + '</h1>\n' +
        '    <div class="float-btn-group">\n' +
        '      <button class=\'float-btn\' id="refuse">拒绝</button>\n' +
        '      <button class=\'float-btn\' id="accept">接受</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      );
      overlay.find('#refuse').bind('click', function () {
        overlay.remove()
      });
      overlay.find('#accept').bind('click', function () {
        overlay.remove()
      });
      $(document.body).append(overlay);
      return overlay;
    }

    function inviteOverlay(player) {
      "use strict";
      var tip = getName(player) + '邀请您对弈';
      var overlay = renderOverlay(tip);
      overlay.find('#refuse').bind('click', function () {
        action.inviteRefuse(player.finger);
      });
      overlay.find('#accept').bind('click', function () {
        action.inviteAccept(player.finger, function (data) {
          if (data.match === 'FAILED') overlayTip.matchFailed(data.opponent);
          else if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
        });
      });
    }

    function giveUpOverlay(player) {
      "use strict";
      var tip = getName(player) + '向您投降了';
      var overlay = renderOverlay(tip);
      overlay.find('#refuse').bind('click', function () {
        action.giveUpResponse(false, function (data) {
          if (!data.gameOver) {
            overlayTip.refuseGiveUp(data.player);

            // 重新建立监听玩家投降的长轮询
            action.giveUpListen(function (data) {
              "use strict";
              if (data.gameOver === false) renderOverlay(data.player, 'GIVEUP');
            });
          }
        });
      });
      overlay.find('#accept').bind('click', function () {
        action.giveUpResponse(true, function (data) {
          if (data.gameOver) {
            overlayTip.giveUp(data.winner);
            window.chessboard.restart();

            action.listenInvite(function (data) {
              "use strict";
              if (data.type === 'invite') {
                renderOverlay(data.player);
              }
            })
          }
        });
      });
    }

    function withdrawOverlay(player) {
      "use strict";
      var tip = getName(player) + '想要悔棋，您接受吗？';
      var overlay = renderOverlay(tip);
      overlay.find('#refuse').bind('click', function () {
        action.withdrawAccept(false, function (data) {
          if (data.accept === false) {
            // 重新建立监听悔棋的长轮询
            action.listenWithdraw(function (data2) {
              withdrawOverlay(data2.player);
            })
          }
        });
      });
      overlay.find('#accept').bind('click', function () {
        action.withdrawAccept(true, function (data) {
          if (data.accept) {
            // 回退一步
            window.chessboard.back(data.player);

            // 重新建立监听悔棋的长轮询
            action.listenWithdraw(function (data2) {
              withdrawOverlay(data2.player);
            })
          }
        });
      });
    }

    function accepted(opponent, myRole) {
      window.chessboard.restart(myRole);
      begin(myRole, opponent);

      // 建立监听玩家投降的长轮询
      action.giveUpListen(function (data) {
        "use strict";
        if (data.gameOver === false) renderOverlay(data.player, 'GIVEUP');
      });

      // 建立监听悔棋的长轮询
      action.listenWithdraw(function (data1) {
        withdrawOverlay(data1.player);
      })
    }

    return {
      renderOverlay: renderOverlay,
      inviteOverlay: inviteOverlay,
      giveUpOverlay: giveUpOverlay,
      withdrawOverlay: withdrawOverlay,
      accepted: accepted
    };
  });