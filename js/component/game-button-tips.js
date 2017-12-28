/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'component/start-game',
    'action/action',
    'utils/api',
    'component/overlay',
    'utils/get-name',
  ],
  function (jquery, begin, action, api, overlay, getName) {
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

    function withdrawBtn() {
      "use strict";
      var back = $('<button class="black">悔棋</button>');
      back.on('click', function () {
        var overlayTipHolder = overlay.overlayTipHolder('等待对方回应...');
        action.withdraw(function (data) {
          if (data.accepted) {
            // 后退一步
            overlayTipHolder.find('#result').html('对方同意了你的请求').fadeOut('fast', function () {
              window.chessboard.back(data.player);
              overlayTipHolder.remove();
            })
          } else {
            // 继续游戏
            overlayTipHolder.find('#result').html('对方拒绝了你的请求').fadeOut('fast', function () {
              overlayTipHolder.remove();
            })
          }
        })
      });
      btnGroup.append(back);
    }


    function giveUpBtn() {
      "use strict";
      var giveUp = $('<button class="black">投降认输</button>');
      giveUp.on('click', function () {
        var overlayTipHolder = overlay.overlayTipHolder('等待对方回应...');
        action.giveUp(function (data) {
          overlayTipHolder.remove();

          if (data.gameOver) {
            overlay.giveUp(data.winner);
            window.chessboard.restart();

            action.listenInvite(function (data) {
              "use strict";
              if (data.type === 'invite') {
                overlay.inviteOverlay(data.player);
              }
            })
          } else {
            overlay.refuseGiveUp(data.player);
          }
        })
      });
      btnGroup.append(giveUp);
    }

    function initChess(bool) {
      "use strict";
      if (bool !== false) {
        btnGroup.empty();
        giveUpBtn();
        withdrawBtn();
      }
    }


    function turns(player) {
      "use strict";
      var tip = $('#tip');
      if (!tip[0]) {
        tip = $('<span id="tip"></span>');
        btnGroup.append(tip);
      }
      if (player.finger !== api.finger) tip.html('------------ 我执' + (window.chessboard.me.role === 'black' ? '黑子' : '白子') + '，现在是' + getName(player) + '执子 ------------');
      else tip.html('------------ 我执' + (window.chessboard.me.role === 'black' ? '黑子' : '白子') + '，现在是' + '我执子 ------------')
    }

    return {
      init: init,
      btnGroup: btnGroup,
      chooseRole: chooseRole,
      restartBtn: restartBtn,
      giveUpBtn: giveUpBtn,
      withdrawBtn: withdrawBtn,
      initChess: initChess,
      turns: turns
    };
  });