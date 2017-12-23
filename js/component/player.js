/**
 * Created by Livelybone on 2017-12-17.
 */
define(['utils/api', 'component/chessboard', 'component/pieces', 'component/role', 'utils/win-dictionary', 'utils/utils'], function (api, chessboard, Pieces, Role, winDictionary, utils) {
  function Player(name, role, finger) {
    this.name = name;
    this.finger = finger;
    this.role = role !== Role.white ? Role.black : Role.white;
    this.pieces = new Pieces(this.role);
  }

  Player.prototype.waitOpponent = function () {

  };

  Player.prototype.chess = function (ev, callback) {
    var clickDot = {x: ev.clientX, y: ev.clientY};
    clickDot = this.getRelativePos(clickDot);

    // 判断是否在棋盘内
    if (clickDot.x >= chessboard.margin && clickDot.x <= (chessboard.width - chessboard.margin)
      && clickDot.y >= chessboard.margin && clickDot.y <= (chessboard.width - chessboard.margin)) {
      // 找到对应的横纵坐标，并落子
      var coordinate = this.convertCoordinate(clickDot);
      var toNext = this.pieces.createPiece(coordinate);
      if (!toNext) return false;

      this.calcWeight(coordinate);

      try {
        if (callback) callback();
      } catch (e) {
        console.error(e);
      }

      // 返回true表示已经落子
      return true;
    }
  };

  Player.prototype.calcWeight = function (coordinate) {
    var that = this, oppRole = that.role === Role.black ? Role.white : Role.black,
      weights = chessboard.winWeights[this.role], oppWeights = chessboard.winWeights[oppRole];

    // 得到目前落子的赢法，需去除被对方阻塞的
    var groups = winDictionary
        .filter(function (group) {
          return group.find(function (p) {
            return p.abscissa === coordinate.abscissa && p.ordinate === coordinate.ordinate
          })
        }),
      myGroups = groups.filter(function (group) {
        return !group.find(function (p) {
          return chessboard.coordinates[p.abscissa][p.ordinate] === oppRole;
        });
      }),
      oppGroups = groups.filter(function (group) {
        return group.filter(function (p) {
            return chessboard.coordinates[p.abscissa][p.ordinate] === that.role;
          }).length <= 1;
      });

    // 计算权重，数值越大权重越大
    // 如果阻塞了对方，对方相应的一些位置的权重要清除
    for (var i = 0; i < 15; i++) {
      if (!weights[i]) weights[i] = [];
      for (var j = 0; j < 15; j++) {
        if (weights[i][j] === undefined || weights[i][j] === null) weights[i][j] = 0;
        // 如果已被占位，则去除该位置的可能性

        if (chessboard.coordinates[i][j] === 0) {
          // 计算己方权重
          myGroups.map(function (group) {
            var pos = group.find(function (p) {
              return p.abscissa === i && p.ordinate === j;
            });
            if (pos) {
              // 在该位置落子后能形成n连的权重：二连 +1，三连 +10，四连 +100，五连 +1000
              var coordinates = group.filter(function (p) {
                return chessboard.coordinates[p.abscissa][p.ordinate] === that.role;
              });
              weights[i][j] += that.weight(coordinates.length);
            }
          });

          // 重新计算对方权重（受到当前己方落子的影响）
          oppGroups.filter(function (group) {
            var pos = group.find(function (p) {
              return p.abscissa === i && p.ordinate === j;
            });
            if (pos) {
              var coordinates = group.filter(function (p) {
                return chessboard.coordinates[p.abscissa][p.ordinate] === oppRole;
              });
              oppWeights[i][j] -= that.weight(coordinates.length);
            }
          })
        } else {
          weights[i][j] = -1;
        }
      }
    }
    weights[coordinate.abscissa][coordinate.ordinate] = -1;
    oppWeights[coordinate.abscissa][coordinate.ordinate] = -1;
    chessboard.winWeights[this.role] = weights;
    chessboard.winWeights[oppRole] = oppWeights;
  };

  Player.prototype.weight = function (val) {
    // 权重
    switch (val) {
      case 1:
        return 1;
      case 2:
        return 10;
      case 3:
        return 100;
      case 4:
        return 1000;
      default:
        return 1;
    }
  };

  Player.prototype.getRelativePos = function (absPos) {
    // 计算鼠标相对于棋盘的位置
    var scroll = utils.getScroll();
    return {
      x: absPos.x - chessboard.boardOffset.offsetLeft + scroll.scrollLeft,
      y: absPos.y - chessboard.boardOffset.offsetTop + scroll.scrollTop
    };
  };

  Player.prototype.convertCoordinate = function (relPos) {
    // 计算落子相对于棋盘的坐标
    var abscissa = 0, ordinate = 0;
    while (!(this.pieces.calcPos(abscissa) + (abscissa > 0 ? -chessboard.cellWidth / 2 - chessboard.lineWidth : -chessboard.borderWidth) <= relPos.x
    && this.pieces.calcPos(abscissa) + (abscissa === chessboard.lineCount - 1 ? 0 : +chessboard.cellWidth / 2) > relPos.x)) {
      abscissa += 1;
      if (abscissa > chessboard.lineCount - 1) break;
    }
    while (!(this.pieces.calcPos(ordinate) + (ordinate > 0 ? -chessboard.cellWidth / 2 - chessboard.lineWidth : -chessboard.borderWidth) <= relPos.y
    && this.pieces.calcPos(ordinate) + (ordinate === chessboard.lineCount - 1 ? 0 : +chessboard.cellWidth / 2) > relPos.y)) {
      ordinate += 1;
      if (ordinate > chessboard.lineCount - 1) break;
    }
    return {abscissa: abscissa, ordinate: ordinate};
  };

  return Player;
});