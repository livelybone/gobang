/**
 * Created by Livelybone on 2017-12-17.
 */

define([
    'utils/api',
    'action/action',
    'component/chessboard/chessboard',
    'component/player/role',
    'component/player/player',
    'component/player/computer',
    'component/chessboard/pop-up',
    'utils/win-dictionary',
    'component/overlay',
    'component/game-button-tips',
    'event-handler',
    'utils/get-name'
  ],
  function (api, action, chessboard, role, Player, Computer, popup, winDictionary, overlay, btnTip, handler, getName) {
    function Play() {
      // 同步实现

      // 绑定this;
      var that = this;

      this.players = {black: null, white: null};
      this.me = null;
      this.opponent = null;
      this.timmer = null;
      this.isChess = false;

      this.init = function () {
        chessboard.init();
        role.init();
        popup.init();
        btnTip.init();
      };

      this.gameStart = function (me, opponent, isReplay) {
        // 初始化棋手
        this.reInit();
        this.me = new Player(me.name, me.role, me.finger);
        this.opponent = opponent.isComputer ? new Computer(opponent.name, opponent.role) : new Player(opponent.name, opponent.role, opponent.finger);
        this.players.black = this.me.role === 'black' ? this.me : this.opponent;
        this.players.white = this.me.role === 'white' ? this.me : this.opponent;

        if (!isReplay) {
          var currentPlayer = this.players[role.currentRole];

          if (opponent.isComputer) {
            this.startWithComputer(currentPlayer);
          } else {
            this.startWithOther(currentPlayer);
          }
        }
      };

      this.gameReplay = function (me, opponent, chessboard, nextRole) {
        this.gameStart(me, opponent, true);
        chessboard.forEach(function (abs, i) {
          abs.forEach(function (ord, j) {
            if (ord && ord.indexOf(me.role) > -1) {
              that.me.pieces.createPiece({abscissa: i, ordinate: j});
            } else if (ord && ord.indexOf(opponent.role) > -1) {
              that.opponent.pieces.createPiece({abscissa: i, ordinate: j});
            }
          })
        });
        // 建立 give-up, withdraw 监听
        action.giveUpListen(handler.listenGiveUpHandler);
        action.listenWithdraw(handler.listenWithDrawHandler);

        action.getChess(that.getChess);
        if (that.players.black.pieces.piecesArr.length >= 3) btnTip.initChess();

        console.log(nextRole, me.role, opponent.role);
        // 如果下棋手不是我，则添加 geChess 监听
        if (nextRole !== me.role) {
          btnTip.turns(that.opponent);
          action.getChess(that.getChess);
        } else { // 如果不是，则添加 click handler
          btnTip.turns(that.me);
          that.addClickFn();
        }
        that.toggle(nextRole);
      };

      this.startWithComputer = function (currentPlayer) {
        popup.animation('Game start!' + (currentPlayer.finger === api.finger ? '<br>You first!' : ''), 1000, function () {
          if (currentPlayer.isComputer) {
            currentPlayer.chess();
            that.judge();
          }
          that.addClickFn();
        });
      };

      this.startWithOther = function (currentPlayer) {
        that.isChess = true;
        popup.animation('Game start!' + (currentPlayer.finger === api.finger ? '<br>You first!' : ''), 1000, function () {
          if (currentPlayer.finger !== that.me.finger) {
            action.getChess(that.getChess);
            btnTip.btnGroup.empty();
            btnTip.turns(that.opponent);
          } else {
            that.addClickFn();
            btnTip.btnGroup.empty();
            btnTip.turns(that.me);
          }
        })
      };

      this.gameOver = function () {
        that.isChess = false;
        var win = that.players[role.currentRole] === that.me;
        overlay.overlayTip(win ? 'Wow，你居然赢了电脑！' : 'Awww，你被电脑虐成渣渣了！', '', '',
          !win ? {
            text: '不服，再战！',
            clickFn: function () {
              btnTip.chooseRole();
            }
          } : ''
        );
      };

      this.reInit = function () {
        this.removeClickFn();
        this.init();
        this.players = {};
        if (this.timmer) clearTimeout(this.timmer);
      };

      this.clickFn = function clickFn(ev) {
        var currentPlayer = that.opponent.isComputer ? that.players[role.currentRole] : that.me;

        var toNext = currentPlayer.chess(ev);
        that.removeClickFn();

        if (toNext) {
          if (that.opponent.isComputer) {
            // 人机对战
            var isGameOver = that.judge();
            currentPlayer = that.players[role.currentRole];
            if (!isGameOver && currentPlayer.isComputer) {
              that.timmer = setTimeout(function () {
                toNext = currentPlayer.chess();
                if (toNext) {
                  isGameOver = that.judge();
                  if (!isGameOver) that.addClickFn();
                }
              }, Math.random() * 1000);
            }
          }
          else {
            // 双人对弈
            var piece = currentPlayer.pieces.piecesArr[currentPlayer.pieces.piecesArr.length - 1];
            that.chessAction(chessboard.coordinates, {abscissa: piece.abscissa, ordinate: piece.ordinate}, that.me.role)
          }
        } else {
          that.addClickFn();
        }
      };

      this.back = function (player) {
        var backPlayer = player.finger === that.me.finger ? that.me : that.opponent,
          acceptPlayer = player.finger === that.me.finger ? that.opponent : that.me;
        if (backPlayer.pieces.piecesArr.length < 1) {
          console.error('都没下棋，悔个毛线啊！');
          return
        }
        var piece = backPlayer.pieces.piecesArr.pop();
        piece.piece.remove();
        chessboard.coordinates[piece.abscissa][piece.ordinate] = 0;
        if (backPlayer.role === role.currentRole) {
          // 如果悔棋的一方为当前棋手，则两方都各退一子
          // 如果悔棋的一方不是当前棋手，则只退悔棋的棋手的子，并重置棋手们相应的事件和监听
          var piece1 = acceptPlayer.pieces.piecesArr.pop();
          piece1.piece.remove();
          chessboard.coordinates[piece1.abscissa][piece1.ordinate] = 0;
        } else {
          if (role.currentRole !== that.me.role) {
            that.addClickFn();
          } else {
            that.removeClickFn();
            action.getChess(that.getChess);
          }
        }
        that.toggle(backPlayer.role);
      };

      this.addClickFn = function () {
        chessboard.board.addEventListener('click', this.clickFn);
      };

      this.removeClickFn = function () {
        chessboard.board.removeEventListener('click', this.clickFn);
      };

      this.judge = function () { // 人机对弈判断
        var rolePieces = this.players[role.currentRole].pieces.piecesArr;
        if (rolePieces.length < 5) {
          // 棋子少于5，不判断
          that.toggle();
          return false;
        }
        var currentPiece = rolePieces[rolePieces.length - 1];

        // 去赢法字典里面寻找，如果没找到，则继续；如果找到了，则游戏结束，当前玩家获胜。这算法应该还能优化...
        var isGameOver = winDictionary
          .filter(function (group) {
            return group.find(function (piece) {
              return piece.abscissa === currentPiece.abscissa && piece.ordinate === currentPiece.ordinate;
            })
          })
          .find(function (group) {
            var index = 0;
            group.map(function (piece) {
              var exist = rolePieces.find(function (p) {
                return piece.abscissa === p.abscissa && piece.ordinate === p.ordinate;
              });
              if (exist) index += 1;
            });
            return index === 5;
          });

        if (isGameOver) {
          this.gameOver();
          return true;
        }
        that.toggle();
        return false;
      };

      this.toggle = function toggle(currentRole) {
        // 换手
        role.currentRole = currentRole || (role.currentRole === role.black ? role.white : role.black);
        if (!that.opponent.isComputer) btnTip.turns(role.currentRole === that.me.role ? that.me : that.opponent);
      };

      this.getChess = function getChess(data) {
        if (data.type !== 'CLOSE') {
          if (data.type !== 'GAME_OVER') {
            that.opponent.pieces.createPiece(data.data.pos);
            that.addClickFn();
            btnTip.turns(that.me);
            if (that.players.black.pieces.piecesArr.length === 3) btnTip.initChess();
            that.toggle(that.me.role);
          } else {
            that.opponent.pieces.createPiece(data.data.pos);
            var isWinner = data.data.winner.finger === api.finger;

            // 重新建立监听对弈请求的长轮询
            action.listenInvite(handler.listenInviteHandler);
            btnTip.init();
            window.chessboard.isChess = false;
            overlay.overlayTip(
              isWinner ? '你赢啦！' : 'Awww，你被虐成渣渣了！',
              isWinner ? '朕知道了' : '确定',
              '',
              {
                text: isWinner ? '再来一局！' : '不服，再战！',
                clickFn: function () {
                  // 邀请再来一局
                  action.invite(that.opponent.finger, handler.inviteHandler);
                }
              }
            );

            $('#' + that.me.finger.replace('.', '') + ' .chess-btn').removeClass('disable');
            $('#' + that.opponent.finger.replace('.', '') + ' .chess-btn').removeClass('disable');
          }
        }
      };

      this.chessAction = function chessAction(chessboard, pos, role) {
        "use strict";
        this.toggle(that.opponent.role);
        action.chess(chessboard, pos, role, function (data) {
          if (data.type !== 'GAME_OVER') {
            action.getChess(that.getChess);
          } else {
            // 重新建立监听玩家请求的长轮询
            action.listenInvite(handler.listenInviteHandler);
            btnTip.init();
            window.chessboard.isChess = false;

            overlay.overlayTip('你赢了！', '嗯， 知道了', '', {
              text: '再来一局！',
              clickFn: function () {
                // 邀请再来一局
                action.invite(that.opponent.finger, handler.inviteHandler);
              }
            });

            $('#' + that.me.finger.replace('.', '') + ' .chess-btn').removeClass('disable');
            $('#' + that.opponent.finger.replace('.', '') + ' .chess-btn').removeClass('disable');
          }
        })
      }
    }

    return Play;
  });