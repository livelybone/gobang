/**
 * Created by Livelybone on 2017-12-17.
 */

define(['component/chessboard', 'component/role', 'component/player', 'component/computer', 'component/pop-up', 'utils/win-dictionary', 'utils/utils'],
  function (chessboard, role, Player, Computer, Popup, winDictionary, utils) {
    function Chess() {
      // 同步实现

      // 绑定this;
      var that = this;

      this.players = {black: null, white: null};

      this.init = function () {
        chessboard.init();
        Popup.init();
      };

      this.gameStart = function (roleBlack, roleWhite) {
        // 初始化棋手
        if (roleBlack.isComputer) {
          this.players.white = new Player(roleWhite.name, 'white');
          this.players.black = new Computer(roleBlack.name, 'black', this.players.white);
        } else if (roleWhite.isComputer) {
          this.players.black = new Player(roleBlack.name, 'black');
          this.players.white = new Computer(roleWhite.name, 'white', this.players.black);
        } else if (!roleBlack.isComputer && !roleWhite.isComputer) {
          this.players.white = new Player(roleWhite.name, 'white');
          this.players.black = new Player(roleBlack.name, 'black');
        } else console.error('Two computer player is forbidden!');


        Popup.animation('Game start!', 1000, function () {
          var currentPlayer = that.players[role.currentPlayer];

          if (currentPlayer.isComputer) {
            currentPlayer.chess();
            that.judge();
          }
          that.addClickFn();
        });
      };

      this.addClickFn = function () {
        chessboard.board.addEventListener('click', this.clickFn);
      };

      this.removeClickFn = function () {
        chessboard.board.removeEventListener('click', this.clickFn);
      };

      this.restart = function () {
        chessboard.init();
        Popup.init();
        this.players = null;
      };

      this.clickFn = function clickFn(ev) {
        var currentPlayer = that.players[role.currentPlayer];
        if (!currentPlayer.isComputer) {
          var toNext = currentPlayer.chess(ev);
          if (toNext) {
            var isGameOver = that.judge();

            //再次赋值
            currentPlayer = that.players[role.currentPlayer];
            if (!isGameOver && currentPlayer.isComputer) {
              setTimeout(function () {
                currentPlayer.chess();
                that.judge();
              }, Math.random() * 1000);
            }
          }
        }
      };

      this.judge = function () {
        var rolePieces = this.players[role.currentPlayer].pieces.piecesArr;
        if (rolePieces.length < 5) {
          // 棋子少于5，不判断
          // 换手
          role.currentPlayer = role.currentPlayer === role.black ? role.white : role.black;
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
        // 换手
        role.currentPlayer = role.currentPlayer === role.black ? role.white : role.black;
        return false;
      };

      this.gameOver = function () {
        this.removeClickFn();
        Popup.animation(this.players[role.currentPlayer].name + ' win<br/>Game Over!');
      };
    }

    return Chess;
  });