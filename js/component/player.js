/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/chessboard', 'component/pieces', 'component/role', 'utils/win-dictionary', 'utils/utils'], function (chessboard, Pieces, Role, winDictionary, utils) {
  function Player(name, role) {
    this.name = name;
    this.role = role !== Role.white ? Role.black : Role.white;
    this.pieces = new Pieces(this.role);
  }

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

  /**
   * @desc 计算
   * @param coordinate 落子的棋子坐标
   * */
  Player.prototype.calcWeight = function (coordinate) {
    var that = this,
      oppRole = that.role === Role.black ? Role.white : Role.black,  // 对手
      weights = chessboard.winWeights[this.role], // 我这个棋手的赢的权重
      oppWeights = chessboard.winWeights[oppRole]; // 对手的赢的权重

    // 得到目前落子的赢法，需去除被对方阻塞的
    // 计算该坐标的所有可能的赢法，得到 groups
    var groups = winDictionary
        .filter(function (group) {
          // 找到赢法（group）的坐标中有一个棋子的坐标和 coordinate 相同的赢法
          return group.some(function (p) {
            return p.abscissa === coordinate.abscissa && p.ordinate === coordinate.ordinate
          })
        }),
      // 在该坐标的所有可能的赢法中，计算：如果我在这个坐标 coordinate 落子，我有多少种赢法。得到 myGroups
      myGroups = groups.filter(function (group) {
        // 去除掉赢法（group）的坐标中已经存在对手棋子的赢法
        return !group.some(function (p) {
          return chessboard.coordinates[p.abscissa][p.ordinate] === oppRole;
        });
      }),
      // 在该坐标的所有可能的赢法中，计算：如果对方在这个坐标 coordinate 落子，对手有多少种赢法。得到 oppGroups
      oppGroups = groups.filter(function (group) {
        // 去除掉赢法（group）的坐标中已经存在我的棋子的赢法
        return !group.some(function (p) {
          return chessboard.coordinates[p.abscissa][p.ordinate] === that.role;
        });
      });

    // 计算：遍历棋盘横纵 15 * 15 的所有坐标的权重，数值越大表示权重越大
    // 如果阻塞了对方，对方相应的一些位置的权重要清除
    for (var i = 0; i < 15; i++) {
      if (!weights[i]) weights[i] = [];

      for (var j = 0; j < 15; j++) {
        // 当前的坐标 -- ij = {abscissa: i, ordinate: j}
        if (weights[i][j] === undefined || weights[i][j] === null) weights[i][j] = 0;

        if (chessboard.coordinates[i][j] === 0) {
          // 计算：在我的所有赢法中，我可能赢的权重
          myGroups.forEach(function (group) {
            // 如果这个赢法中有个坐标为当前坐标 ij，则计算这个坐标在这个赢法中能得到的权重，并累计给权重字典 weights[i][j]
            var matched = group.some(function (p) {
              return p.abscissa === i && p.ordinate === j;
            });
            if (matched) {
              // 计算这个坐标在这个赢法中能得到的权重：在该位置落子后能形成 n连 的权重，二连 +1，三连 +10，四连 +100，五连 +1000
              var coordinates = group.filter(function (p) {
                return chessboard.coordinates[p.abscissa][p.ordinate] === that.role;
              });
              weights[i][j] += that.weight(coordinates.length);
            }
          });

          // 重新计算对方权重：在对方的所有赢法中，减掉当前坐标 ij 的影响，因为对方已经失去在坐标 coordinate 落子的机会
          oppGroups.forEach(function (group) {
            // 如果这个赢法中有个坐标为当前坐标 ij，则计算这个坐标在这个赢法中能得到的权重，并更新到权重字典 oppWeights[i][j]，做减操作
            var matched = group.some(function (p) {
              return p.abscissa === i && p.ordinate === j;
            });
            if (matched) {
              // 同样计算这个坐标在这个赢法中能得到的权重：在该位置落子后能形成 n连 的权重，二连 +1，三连 +10，四连 +100，五连 +1000
              var coordinates = group.filter(function (p) {
                return chessboard.coordinates[p.abscissa][p.ordinate] === oppRole;
              });
              oppWeights[i][j] -= that.weight(coordinates.length);
            }
          })
        } else {
          // 如果已被占位，则去除该位置的可能性
          weights[i][j] = -1;
        }
      }
    }

    // -1 表示被占位，即该位置已存在棋子
    weights[coordinate.abscissa][coordinate.ordinate] = -1;
    oppWeights[coordinate.abscissa][coordinate.ordinate] = -1;

    // 更新棋盘权重字典
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