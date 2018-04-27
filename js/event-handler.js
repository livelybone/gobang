define(['action/action', 'utils/get-name', 'component/overlay', 'component/start-game', 'component/broadcast-animation', 'utils/api'],
  function (action, getName, overlay, startGame, broadcast, api) {
    function listenInviteHandler(data) {
      if (data.type === 'INVITE') {
        var player = data.data.opponent;
        var tip = getName(player) + '邀请您对弈';
        overlay.renderOverlay(tip, '', '', function () {
          action.inviteRefuse(player.finger);

          // 再次建立监听邀请请求的长轮询
          action.listenInvite(listenInviteHandler);
        }, function () {
          action.inviteAccept(player.finger, function (data) {
            if (data.type === 'MATCH_FAILED') matchFailedHandler(data.data.opponent);
            else if (data.type === 'MATCH_SUCCESS') matchSuccessHandler(data.data.opponent, data.data.role);
          });
        });
      }
    }

    function inviteHandler(data) {
      if (data.type === 'TIMEOUT') broadcast.inviteTimeout();
      else if (data.type === 'MATCH_REFUSE') broadcast.refused(data.data.opponent);
      else if (data.type === 'MATCH_FAILED') matchFailedHandler(data.data.opponent);
      else if (data.type === 'MATCH_SUCCESS') matchSuccessHandler(data.data.opponent, data.data.role);
    }

    function matchFailedHandler(opponent) {
      var tip = getName(opponent) + '已经开始游戏了', btnText = '好吧，挺遗憾的！';
      overlay.overlayTip(tip, btnText);
    }

    function matchSuccessHandler(opponent, myRole) {
      window.chessboard.reInit();
      startGame.begin(myRole, opponent);
      $('#' + api.finger.replace('.', '') + ' .chess-btn').addClass('disable');
      $('#' + opponent.finger.replace('.', '') + ' .chess-btn').addClass('disable');

      // 建立监听玩家投降的长轮询
      action.giveUpListen(listenGiveUpHandler);

      // 建立监听悔棋的长轮询
      action.listenWithdraw(listenWithDrawHandler)
    }

    function listenGiveUpHandler(data) {
      if (data.type === 'GIVE_UP') {
        var player = data.data.opponent;
        var tip = getName(player) + '向您投降了';
        overlay.renderOverlay(tip, '拒绝', '接受', function () {
          action.giveUpResponse(false, function (data) {
            if (data.type !== 'GAME_OVER') {
              // 重新建立监听玩家投降的长轮询
              action.giveUpListen(listenGiveUpHandler);
            }
          });
        }, function () {
          action.giveUpResponse(true, function (data) {
            if (data.type === 'GAME_OVER') {
              overlay.overlayTip('你赢了！', '嗯， 知道了');
              window.btnTip.init();
              console.log(window.btnTip);
              window.chessboard.isChess = false;

              // 重新建立监听玩家请求的长轮询
              action.listenInvite(listenInviteHandler)
            }
          });
        });
      }
    }

    function giveUpHandler(data) {
      var overlayTipHolder = $("#overlay-tip-holder");
      overlayTipHolder.remove();
      overlayTipHolder = null;

      if (data.type === 'GAME_OVER') {
        // 投降被接受
        overlay.overlayTip(getName(data.data.winner) + '接受了你的投降', '嗯，我输了');
        window.btnTip.init();
        window.chessboard.isChess = false;

        $('#' + api.finger.replace('.', '') + ' .chess-btn').removeClass('disable');
        $('#' + data.data.winner.finger.replace('.', '') + ' .chess-btn').removeClass('disable');

        action.listenInvite(listenInviteHandler)
      } else {
        // 投降被拒绝
        var tip, btnText;
        tip = getName(data.data.player) + '拒绝了你的投降';
        btnText = '好吧';
        overlay.overlayTip(tip, btnText);
      }
    }

    function listenWithDrawHandler(data) {
      if (data.type === 'WITHDRAW') {
        var player = data.data.opponent;
        var tip = getName(player) + '想要悔棋，您接受吗？';
        overlay.renderOverlay(tip, '', '', function () {
          action.withdrawAccept(false, withdrawRefuseHandler);
        }, function () {
          action.withdrawAccept(true, withDrawAcceptHandler);
        });
      }
    }

    function withdrawHandler(data) {
      var overlayTipHolder = $("#overlay-tip-holder");
      if (data.data.accepted) {
        // 后退一步
        overlayTipHolder.find('#result').html('对方同意了你的请求').fadeOut('fast', function () {
          window.chessboard.back(data.data.player);
          overlayTipHolder.remove();
          overlayTipHolder = null;
        })
      } else {
        // 继续游戏
        overlayTipHolder.find('#result').html('对方拒绝了你的请求').fadeOut('fast', function () {
          overlayTipHolder.remove();
          overlayTipHolder = null;
        })
      }
    }

    function withdrawRefuseHandler(data) {
      if (data.data.accepted === false) {
        // 重新建立监听悔棋的长轮询
        action.listenWithdraw(listenWithDrawHandler)
      }
    }

    function withDrawAcceptHandler(data) {
      if (data.data.accepted) {
        // 回退一步
        window.chessboard.back(data.data.player);

        // 重新建立监听悔棋的长轮询
        action.listenWithdraw(listenWithDrawHandler);
      }
    }

    return {
      listenInviteHandler: listenInviteHandler,
      inviteHandler: inviteHandler,
      matchFailedHandler: matchFailedHandler,
      matchSuccessHandler: matchSuccessHandler,
      listenGiveUpHandler: listenGiveUpHandler,
      giveUpHandler: giveUpHandler,
      listenWithDrawHandler: listenWithDrawHandler,
      withdrawHandler: withdrawHandler,
      withdrawRefuseHandler: withdrawRefuseHandler,
      withDrawAcceptHandler: withDrawAcceptHandler,
    }
  });