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
    'component/overlay-tip',
    'component/overlay',
    'component/game-button-tips',
  ],
  function (api, action, chessboard, role, Player, Computer, popup, winDictionary, overlayTip, overlay, btnTip) {
    function Play() {
      // 同步实现

      // 绑定this;
      var that = this;

      this.players = {black: null, white: null};
      this.me = null;
      this.opponent = null;
      this.timmer = null;

      this.init = function () {
        chessboard.init();
        popup.init();
        btnTip.init();
      };

      this.gameStart = function (me, opponent) {
        // 初始化棋手
        this.me = new Player(me.name, me.role, me.finger);
        this.opponent = opponent.isComputer ? new Computer(opponent.name, opponent.role) : new Player(opponent.name, opponent.role, opponent.finger);
        this.players.black = this.me.role === 'black' ? this.me : this.opponent;
        this.players.white = this.me.role === 'white' ? this.me : this.opponent;

        var currentPlayer = this.players[role.currentRole];

        if (opponent.isComputer)
          popup.animation('Game start!' + (currentPlayer.finger === api.finger ? '<br>You first!' : ''), 1000, function () {
            if (currentPlayer.isComputer) {
              currentPlayer.chess();
              that.judge();
            }
            that.addClickFn();
          });
        else
          popup.animation('Game start!' + (currentPlayer.finger === api.finger ? '<br>You first!' : ''), 1000, function () {
            if (currentPlayer.finger !== api.finger) {
              chessAction('', '', 'white');
            } else {
              that.addClickFn();
            }
          })
      };

      this.gameOver = function () {
        // this.removeClickFn();
        overlayTip.winOrNot(this.players[role.currentRole], !this.players[role.currentRole].isComputer)
      };

      this.restart = function () {
        this.removeClickFn();
        this.init();
        role.init();
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
            var piece = currentPlayer.pieces.piecesArr.slice(0).pop();
            chessAction(chessboard.coordinates, {abscissa: piece.abscissa, ordinate: piece.ordinate}, that.me.role)
          }
        } else {
          that.addClickFn();
        }
      };

      this.back = function (player) {
        "use strict";
        var backPlayer = player.finger === that.me ? that.me : that.opponent,
          acceptPlayer = player.finger === that.me ? that.opponent : that.me;
        if (backPlayer.pieces.piecesArr.length < 1) {
          console.error('都没下棋，悔个毛线啊！');
          return
        }
        var piece = backPlayer.pieces.piecesArr.pop();
        piece.piece.remove();
        chessboard.coordinates[piece.abscissa][piece.ordinate] = 0;
        if (backPlayer.role === role.currentRole) {
          // 如果悔棋的一方为当前棋手，则两方都各退一子
          // 如果悔棋的一方不是当前棋手，则只退悔棋的棋手的子
          var piece1 = acceptPlayer.pieces.piecesArr.pop();
          piece1.piece.remove();
          chessboard.coordinates[piece1.abscissa][piece1.ordinate] = 0;
        }
      };

      this.addClickFn = function () {
        chessboard.board.addEventListener('click', this.clickFn);
      };

      this.removeClickFn = function () {
        chessboard.board.removeEventListener('click', this.clickFn);
      };

      this.judge = function () {
        var rolePieces = this.players[role.currentRole].pieces.piecesArr;
        if (rolePieces.length < 5) {
          // 棋子少于5，不判断
          toggle();
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
        toggle();
        return false;
      };

      function toggle(currentRole) {
        // 换手
        role.currentRole = currentRole || (role.currentRole === role.black ? role.white : role.black);
      }

      function chessCallback(data) {
        if (!data.gameOver) {
          if (data.pos) {
            that.opponent.pieces.createPiece(data.pos);
          }
          that.addClickFn();
          btnTip.turns(that.me);
          toggle(that.me.role);
          if (that.players.black.pieces.piecesArr.length === 3) btnTip.initChess();
        } else {
          if (data.type === 'NORMAL') overlayTip.winOrNot(data.winner, data.winner.finger === api.finger);
          else overlayTip.giveUp(data.winner);

          action.listenInvite(function (data) {
            "use strict";
            if (data.type === 'invite') {
              overlay.inviteOverlay(data.player);
            }
          })
        }
      }

      function chessAction(chessboard, pos, role) {
        "use strict";
        toggle(that.opponent.role);
        action.chess(chessboard, pos, role, function (data) {
          chessCallback(data);
        })
      }
    }

    return Play;
  });