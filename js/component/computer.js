/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/player', 'component/chessboard', 'utils/win-dictionary', 'component/role'], function (Player, chessboard, winDictionary, Role) {
  function Computer(name, role) {
    // opponent: Player实例化对象

    // 继承 Player 对象
    Player.apply(this, [name, role]);

    this.isComputer = true;
  }

  Computer.prototype = new Player();

  Computer.prototype.constructor = Computer;

  // 电脑下棋
  Computer.prototype.chess = function (callback) {
    var coordinate = this.computeCoordinate();

    // 在棋盘上落子并计算输赢结果，如果有结果，表示没有下一步，返回 false; 无结果，表示继续下棋，返回 true
    var toNext = this.pieces.createPiece(coordinate);
    if (!toNext) return false;

    // 更新棋盘权重，为下一次下棋做准备
    this.calcWeight(coordinate);
    try {
      if (callback) callback();
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  // 简单智能计算电脑落子的坐标，后期可以优化字典，利用权重提高AI水平
  Computer.prototype.computeCoordinate = function () {
    if (this.role === 'black' && this.pieces.piecesArr.length === 0) return {abscissa: 7, ordinate: 7};

    var myWeight = 0, opponentWeight = 0, my_abscissa = 0, my_ordinate = 0, opp_abscissa = 0, opp_ordinate = 0,
      myWeights = chessboard.winWeights[this.role],
      opponentWeights = chessboard.winWeights[this.role === Role.black ? Role.white : Role.black];

    myWeights.map(function (middle, abscissa) {
      middle.map(function (weight, ordinate) {
        if (myWeight < weight) {
          myWeight = weight;
          my_abscissa = abscissa;
          my_ordinate = ordinate;
        }
      })
    });

    opponentWeights.map(function (middle, abscissa) {
      middle.map(function (weight, ordinate) {
        if (opponentWeight < weight) {
          opponentWeight = weight;
          opp_abscissa = abscissa;
          opp_ordinate = ordinate;
        }
      })
    });

    if (myWeight >= opponentWeight) {
      return {abscissa: my_abscissa, ordinate: my_ordinate};
    } else {
      return {abscissa: opp_abscissa, ordinate: opp_ordinate};
    }
  };

  return Computer;
});