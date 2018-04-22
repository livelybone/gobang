/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'utils/api',
    'action/action',
    'component/broadcast-animation',
    'utils/get-name',
    'component/start-game',
    'component/player/role',
  ],
  function (jquery, api, action, broadcast, getName, begin, Role) {
    function renderOverlay (tip, cancelText, confirmText, cancelFn, confirmFn) {
      "use strict";
      var overlay = $(
        '<div id="overlay">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title">' + tip + '</h1>\n' +
        '    <div class="float-btn-group">\n' +
        '      <button class="float-btn" id="confirm">' + (confirmText || '接受') + '</button>\n' +
        '      <button class="float-btn" id="cancel">' + (cancelText || '拒绝') + '</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      );
      overlay.find('#cancel').bind('click', function () {
        if (cancelFn) cancelFn();
        overlay.remove();
        overlay = null;
      });
      overlay.find('#confirm').bind('click', function () {
        if (confirmFn) confirmFn();
        overlay.remove();
        overlay = null;
      });
      $(document.body).append(overlay);
      return overlay;
    }

    function overlayTip (tip, btnText, confirmFn, otherBtn) {
      "use strict";
      var overlayTip = $(
        '<div id="overlay-tip">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
        '    <div class="float-btn-group">\n' +
        '      <button class=\'float-btn\' id="confirm">' + (btnText || '确定') + '</button>\n' +
        (otherBtn ? '      <button class=\'float-btn\' id="other-btn">' + (otherBtn.text || '不服，再战！') + '</button>\n' : '') +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      );
      overlayTip.find('button#confirm').bind('click', function () {
        if (confirmFn) confirmFn();
        overlayTip.remove();
        overlayTip = null;
      });
      if (overlayTip.find('button#other-btn')) {
        overlayTip.find('button#confirm').bind('click', function () {
          if (otherBtn.clickFn instanceof Function) otherBtn.clickFn();
          overlayTip.remove();
          overlayTip = null;
        });
      }
      $(document.body).append(overlayTip);
      return overlayTip;
    }

    function overlayTipHolder (tip, clickFn) {
      "use strict";
      var overlayTip = $(
        '<div id="overlay-tip">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
        '  </div>\n' +
        '</div>'
      );
      $(document.body).append(overlayTip);
      overlayTip.bind('click', function () {
        if (clickFn) clickFn();
      });
      setTimeout(function () {
        overlayTip.remove();
        overlayTip = null;
      }, 3000);
      return overlayTip;
    }
    //
    // function inviteOverlay(player) {
    //   "use strict";
    //   var tip = getName(player) + '邀请您对弈';
    //   var overlay = renderOverlay(tip);
    //   overlay.find('#refuse').bind('click', function () {
    //     action.inviteRefuse(player.finger);
    //   });
    //   overlay.find('#accept').bind('click', function () {
    //     action.inviteAccept(player.finger, function (data) {
    //       if (data.match === 'FAILED') matchFailed(data.opponent);
    //       else if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
    //     });
    //   });
    // }
    //
    // function giveUpOverlay(player) {
    //   "use strict";
    //   var tip = getName(player) + '向您投降了';
    //   var overlay = renderOverlay(tip);
    //   overlay.find('#refuse').bind('click', function () {
    //     action.giveUpResponse(false, function (data) {
    //       if (!data.gameOver) {
    //         refuseGiveUp(data.player);
    //
    //         // 重新建立监听玩家投降的长轮询
    //         action.giveUpListen(function (data) {
    //           "use strict";
    //           if (data.gameOver === false) giveUpOverlay(data.player);
    //         });
    //       }
    //     });
    //   });
    //   overlay.find('#accept').bind('click', function () {
    //     action.giveUpResponse(true, function (data) {
    //       if (data.gameOver) {
    //         giveUp(data.winner);
    //         window.chessboard.restart();
    //
    //         action.listenInvite(function (data) {
    //           "use strict";
    //           if (data.type === 'invite') {
    //             renderOverlay(data.player);
    //           }
    //         })
    //       }
    //     });
    //   });
    // }
    //
    // function withdrawOverlay(player) {
    //   "use strict";
    //   var tip = getName(player) + '想要悔棋，您接受吗？';
    //   var overlay = renderOverlay(tip);
    //   overlay.find('#refuse').bind('click', function () {
    //     action.withdrawAccept(false, function (data) {
    //       if (data.accepted === false) {
    //         // 重新建立监听悔棋的长轮询
    //         action.listenWithdraw(function (data2) {
    //           if (data2.player) withdrawOverlay(data2.player);
    //         })
    //       }
    //     });
    //   });
    //   overlay.find('#accept').bind('click', function () {
    //     action.withdrawAccept(true, function (data) {
    //       if (data.accepted) {
    //
    //         // 如果悔棋方不是当前棋手，则当前棋手需要重新建立监听下棋的长轮询
    //         var currentPlayer = window.chessboard.players[Role.currentRole];
    //         if (player.finger !== currentPlayer.finger) {
    //           action.chess('', '', Role.currentRole, function (data) {
    //             window.chessboard.chessCallback(data);
    //           })
    //         }
    //
    //         // 回退一步
    //         window.chessboard.back(data.player);
    //
    //         // 重新建立监听悔棋的长轮询
    //         action.listenWithdraw(function (data2) {
    //           if (data2.player) withdrawOverlay(data2.player);
    //         });
    //       }
    //     });
    //   });
    // }
    //
    // function accepted(opponent, myRole) {
    //   window.chessboard.restart(myRole);
    //   begin(myRole, opponent);
    //
    //   // 建立监听玩家投降的长轮询
    //   action.giveUpListen(function (data) {
    //     "use strict";
    //     if (data.gameOver === false) giveUpOverlay(data.player);
    //   });
    //
    //   // 建立监听悔棋的长轮询
    //   action.listenWithdraw(function (data1) {
    //     if (data1.player) withdrawOverlay(data1.player);
    //   })
    // }
    //
    // function winOrNot(player, win) {
    //   "use strict";
    //   var tip = win ? 'Wao! 你赢啦' : 'Opps! ' + getName(player) + '把虐你成XX啦', btnText = win ? '朕知道了' : 'Oh No! 快逃';
    //   overlayTip(tip, btnText, win, player.finger);
    // }
    //
    // function matchFailed(player) {
    //   "use strict";
    //   var tip = getName(player) + '已经开始游戏了', btnText = '好吧，挺遗憾的！';
    //   overlayTip(tip, btnText);
    // }
    //
    // function matchSuccess(player) {
    //   "use strict";
    //   var tip = '成功匹配到' + getName(player) + '，游戏开始！';
    //   var $overlayTip = overlayTipHolder(tip);
    //   setTimeout(function () {
    //     $overlayTip.remove();
    //     accepted(player, player.role);
    //   }, 1000);
    // }
    //
    // function giveUp(winner) {
    //   "use strict";
    //   var tip, btnText;
    //   if (winner.finger !== api.finger) {
    //     tip = getName(winner) + '接受了你的投降';
    //     btnText = '嗯，我输了';
    //   } else {
    //     tip = '你赢了';
    //     btnText = '嗯，知道了';
    //   }
    //   overlayTip(tip, btnText);
    // }
    //
    // function refuseGiveUp(opponent) {
    //   "use strict";
    //   if (opponent.finger !== api.finger) {
    //     // 提示投降者
    //     var tip, btnText;
    //     tip = getName(opponent) + '拒绝了你的投降';
    //     btnText = '好吧';
    //     overlayTip(tip, btnText);
    //   } else {
    //     // 拒绝者重新建立监听对手投降的长轮询
    //     action.giveUpListen(function (data) {
    //       "use strict";
    //       if (data.gameOver === false) giveUpOverlay(data.player);
    //     });
    //   }
    // }

    return {
      renderOverlay: renderOverlay,
      // inviteOverlay: inviteOverlay,
      // giveUpOverlay: giveUpOverlay,
      // withdrawOverlay: withdrawOverlay,
      // accepted: accepted,
      overlayTipHolder: overlayTipHolder,
      overlayTip: overlayTip,
      // winOrNot: winOrNot,
      // matchFailed: matchFailed,
      // matchSuccess: matchSuccess,
      // giveUp: giveUp,
      // refuseGiveUp: refuseGiveUp
    };
  });