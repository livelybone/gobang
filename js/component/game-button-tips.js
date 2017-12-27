/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'component/start-game',
    'action/action',
    'utils/api',
    'component/overlay-tip',
    'component/overlay',
    'utils/get-name',
  ],
  function (jquery, begin, action, api, overlayTip, overlay, getName) {
    var btnGroup = $('#btn-group');

    function init() {
      "use strict";
      btnGroup.empty();
      var btn = $('<button class="green">撩撩电脑</button>');
      btn.on('click', function () {
        chooseRole();
      });
      btnGroup.append(btn);
    }

    function chooseRole() {
      "use strict";
      btnGroup.empty();
      var black = $('<button class="black">我执黑子</button>'), white = $('<button class="white">我执白子</button>');
      black.on('click', function () {
        begin('black');
        restartBtn();
      });
      white.on('click', function () {
        begin('white');
        restartBtn();
      });
      btnGroup.append(black);
      btnGroup.append(white);
    }

    function restartBtn() {
      "use strict";
      btnGroup.empty();
      var refresh = $('<button class="green">重新开始</button>'), giveUp = $('<button class="white">不玩了</button>');
      refresh.on('click', function () {
        window.chessboard.restart();
        chooseRole();
      });
      giveUp.on('click', function () {
        window.chessboard.restart();
      });
      btnGroup.append(refresh);
      btnGroup.append(giveUp);
    }

    function giveUpBtn() {
      "use strict";
      btnGroup.empty();
      var giveUp = $('<button class="black">投降认输</button>');
      giveUp.on('click', function () {
        action.giveUp(function (data) {
          if (data.gameOver) {
            overlayTip.giveUp(data.winner);
            window.chessboard.restart();

            action.listenInvite(function (data) {
              "use strict";
              if (data.type === 'invite') {
                overlay.renderOverlay(data.player);
              }
            })
          } else {
            overlayTip.refuseGiveUp(data.player);
          }
        })
      });
      btnGroup.append(giveUp);
    }

    function turns(player) {
      "use strict";
      var tip = $('#tip');
      if (!tip) {
        $('<span id="tip"></span>');
        btnGroup.append(tip);
      }
      if (player.finger !== api.finger) tip.html('------------ ' + getName(player) + '执子 ------------');
    }

    return {init: init, chooseRole: chooseRole, restartBtn: restartBtn, giveUpBtn: giveUpBtn, turns: turns};
  });