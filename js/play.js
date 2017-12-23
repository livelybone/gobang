/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api', 'action/action', 'component/chessboard', 'component/role', 'component/player', 'component/computer', 'component/pop-up', 'utils/win-dictionary', 'component/overlay-tip'],
  function (api, action, chessboard, role, Player, Computer, popup, winDictionary, overlayTip) {
    function Play() {
      // 同步实现

      // 绑定this;
      var that = this;

      this.players = {black: null, white: null};
      this.timmer = null;

      this.init = function () {
        chessboard.init();
        popup.init();
      };

      this.gameStart = function (roleBlack, roleWhite) {
        // 初始化棋手
        this.players.white = roleWhite.isComputer ? new Computer(roleWhite.name, 'white') : new Player(roleWhite.name, 'white', roleWhite.finger);
        this.players.black = roleBlack.isComputer ? new Computer(roleBlack.name, 'black') : new Player(roleBlack.name, 'black', roleBlack.finger);

        var currentPlayer = that.players[role.currentPlayer];

        if (roleBlack.isComputer || roleWhite.isComputer)
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
              action.chess('', '', chessCallback)
            } else {
              that.addClickFn();
            }
          })
      };

      this.gameOver = function () {
        // this.removeClickFn();
        overlayTip.winOrNot(this.players[role.currentPlayer], !this.players[role.currentPlayer].isComputer)
      };

      this.restart = function () {
        this.removeClickFn();
        chessboard.init();
        popup.init();
        role.init();
        this.players = {};
        if (this.timmer) clearTimeout(this.timmer);
      };

      this.clickFn = function clickFn(ev) {
        var currentPlayer = that.players[role.currentPlayer];

        var toNext = currentPlayer.chess(ev);
        that.removeClickFn();

        if (toNext) {
          if (that.players.black.isComputer || that.players.white.isComputer) {
            // 人机对战
            var isGameOver = that.judge();

            currentPlayer = that.players[role.currentPlayer];
            if (!isGameOver && currentPlayer.isComputer) {
              that.timmer = setTimeout(function () {
                toNext = currentPlayer.chess();
                if (toNext) {
                  isGameOver = that.judge();
                  if (!isGameOver) that.addClickFn();
                }
              }, Math.random() * 1000);
            }
          } else {
            // 双人对弈
            var piece = currentPlayer.pieces.piecesArr.slice(0).pop();
            action.chess(chessboard.coordinates, {abscissa: piece.abscissa, ordinate: piece.ordinate}, chessCallback)
          }
        } else {
          that.addClickFn();
        }
      };

      this.addClickFn = function () {
        chessboard.board.addEventListener('click', this.clickFn);
      };

      this.removeClickFn = function () {
        chessboard.board.removeEventListener('click', this.clickFn);
      };

      this.judge = function () {
        var rolePieces = this.players[role.currentPlayer].pieces.piecesArr;
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

      function toggle() {
        // 换手
        role.currentPlayer = role.currentPlayer === role.black ? role.white : role.black;
      }

      function chessCallback(data) {
        var currentPlayer = that.players[role.currentPlayer];
        if (!data.gameOver) {
          if (data.pos) {
            currentPlayer.pieces.createPiece(pos);
          }
          that.addClickFn();
          toggle();
        } else {
          overlayTip.winOrNot(data.winner, data.winner.finger === api.finger)
        }
      }
    }

    return Play;
  });