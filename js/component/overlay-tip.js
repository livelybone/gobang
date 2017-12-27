/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'action/action',
    'component/broadcast-animation',
    'utils/get-name',
    'utils/api',
    'component/start-game',
    'component/overlay',
  ],
  function (jquery, action, broadcast, getName, api, begin, overlay) {
    function overlayTip(tip, btnText, win, finger) {
      "use strict";
      var overlayTip = $(
        '<div id="overlay-tip">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
        '    <div class="float-btn-group">\n' +
        '      <button class=\'float-btn\' id="ok">' + btnText + '</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      );
      overlayTip.find('button#ok').bind('click', function () {
        overlayTip.remove()
      });
      if (win === false && finger) {
        overlayTip.find('div.float-btn-group').append($('<button class=\'float-btn\' id="again">不服，再战！</button>\n'));
        overlayTip.find('#again').bind('click', function () {
          overlayTip.remove()
        });
        overlayTip.find('#again').bind('click', function () {
          action.invite(finger, function (data) {
            if (data.match === 'REFUSE') broadcast.refused(data.opponent);
            if (data.match === 'SUCCESS') overlay.accepted(data.opponent, data.role);
          });
        });
      }
      $(document.body).append(overlayTip);
    }

    function winOrNot(player, win) {
      "use strict";
      var tip = win ? 'Wao! 你赢啦' : 'Opps! ' + getName(player) + '把虐你成XX啦', btnText = win ? '朕知道了' : 'Oh No! 快逃';
      overlayTip(tip, btnText, win, player.finger);
    }

    function matchFailed(player) {
      "use strict";
      var tip = getName(player) + '已经开始游戏了', btnText = '好吧，挺遗憾的！';
      overlayTip(tip, btnText);
    }

    function giveUp(winner) {
      "use strict";
      var tip, btnText;
      if (winner.finger !== api.finger) {
        tip = getName(winner) + '接受了你的投降';
        btnText = '嗯，我输了';
      } else {
        tip = '你赢了';
        btnText = '嗯，知道了';
      }
      overlayTip(tip, btnText);
    }

    function refuseGiveUp(opponent) {
      "use strict";
      if (opponent.finger !== api.finger) {
        // 提示投降者
        var tip, btnText;
        tip = getName(opponent) + '拒绝了你的投降';
        btnText = '好吧';
        overlayTip(tip, btnText);
      } else {
        // 拒绝者重新建立监听对手投降的长轮询
        action.giveUpListen(function (data) {
          "use strict";
          if (data.gameOver === false) overlay(data.player, 'GIVEUP');
        });
      }
    }

    return {
      overlayTip: overlayTip,
      winOrNot: winOrNot,
      matchFailed: matchFailed,
      giveUp: giveUp,
      refuseGiveUp: refuseGiveUp
    };
  });