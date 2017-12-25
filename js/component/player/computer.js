/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/player/player', 'component/chessboard/chessboard', 'utils/win-dictionary', 'component/player/role'], function (Player, chessboard, winDictionary, Role) {
  function Computer(name, role) {
    // opponent: Player实例化对象

    Player.apply(this, [name, role]);

    this.isComputer = true;
  }

  Computer.prototype = new Player();

  Computer.prototype.constructor = Computer;

  Computer.prototype.chess = function (callback) {
    var coordinate = this.computeCoordinate();
    var toNext = this.pieces.createPiece(coordinate);
    if (!toNext) return false;

    this.calcWeight(coordinate);
    try {
      if (callback) callback();
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  Computer.prototype.computeCoordinate = function () {
    if (this.role === 'black' && this.pieces.piecesArr.length === 0) return {abscissa: 7, ordinate: 7};

    // 简单智能计算电脑落子的坐标，后期可以优化字典，利用权重提高AI水平
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