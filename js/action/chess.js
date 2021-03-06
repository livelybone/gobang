/**
 * Created by Livelybone on 2017-12-17.
 */

define(['component/chessboard', 'component/role', 'component/player', 'component/computer', 'component/pop-up', 'utils/win-dictionary'],
  function (chessboard, role, Player, Computer, popup, winDictionary) {
    function Chess() {
      // 同步实现

      // 绑定this;
      var that = this;

      // 黑白两方
      this.players = {black: null, white: null};

      // 初始化
      this.init = function () {
        // 棋盘初始化
        chessboard.init();
        // 弹框初始化s
        popup.init();
      };

      this.gameStart = function (roleBlack, roleWhite) {
        // 初始化棋手
        this.players.white = roleWhite.isComputer ? new Computer(roleWhite.name, 'white') : new Player(roleWhite.name, 'white');
        this.players.black = roleBlack.isComputer ? new Computer(roleBlack.name, 'black') : new Player(roleBlack.name, 'black');

        // 弹窗结束时：绑定落棋事件；如果当前棋手为电脑，电脑下棋
        popup.animation(
          'Game start!',
          1000,
          function () {
            var currentPlayer = that.players[role.currentPlayer];

            if (currentPlayer.isComputer) {
              currentPlayer.chess();
              that.judge();
            }
            that.addClickFn();
          }
        );
      };

      this.addClickFn = function () {
        chessboard.board.addEventListener('click', this.clickFn);
      };

      this.removeClickFn = function () {
        chessboard.board.removeEventListener('click', this.clickFn);
      };

      this.restart = function () {
        this.removeClickFn();
        chessboard.init();
        popup.init();
        role.init();
        this.players = {};
      };

      this.clickFn = function clickFn(ev) {
        var currentPlayer = that.players[role.currentPlayer];
        if (!currentPlayer.isComputer) {
          var toNext = currentPlayer.chess(ev);
          that.removeClickFn();
          if (toNext) {
            var isGameOver = that.judge();

            //再次赋值
            currentPlayer = that.players[role.currentPlayer];
            if (!isGameOver && currentPlayer.isComputer) {
              setTimeout(function () {
                toNext = currentPlayer.chess();
                if (toNext) {
                  isGameOver = that.judge();
                  if (!isGameOver) that.addClickFn();
                }
              }, Math.random() * 1000);
            }
          } else {
            that.addClickFn();
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
        popup.animation(this.players[role.currentPlayer].name + ' win<br/>Game Over!');
      };
    }

    return Chess;
  });