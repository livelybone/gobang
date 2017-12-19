/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/player', 'component/chessboard', 'utils/win-dictionary', 'component/role'], function (Player, chessboard, winDictionary, Role) {
  function Computer(name, role, opponent) {
    // opponent: Player实例化对象

    Player.apply(this, [name, role]);

    this.isComputer = true;
    this.opponent = opponent;

    /*this.computeCoordinate = function () {
      // 简单智能计算电脑落子的坐标，后期可以优化字典，利用权重提高AI水平
      var opponentPieces = this.opponent.pieces.piecesArr,
        opponentCoordinate = opponentPieces[opponentPieces.length - 1], options = [];
      if (!opponentCoordinate) return {abscissa: 7, ordinate: 7};

      // 创建周围1格内的落子位置数组
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          var option = {};
          option.abscissa = opponentCoordinate.abscissa + i;
          option.ordinate = opponentCoordinate.ordinate + j;
          if ((i !== 0 || j !== 0)
            && option.abscissa >= 0
            && option.abscissa <= (chessboard.lineCount - 1)
            && option.ordinate >= 0
            && option.ordinate <= (chessboard.lineCount - 1)) {
            if (chessboard.coordinates[option.abscissa][option.ordinate] === 0) {
              options.push(option);
            }
          }
        }
      }
      var coordinate = options[Math.floor(Math.random() * options.length) % 15];

      // 如果出现死胡同 - 九宫格，则随机取点
      if (!coordinate) {
        var abscissa = Math.floor(Math.random() * 15), ordinate = Math.floor(Math.random() * 15);
        while (chessboard.coordinates[abscissa][ordinate] !== 0) {
          abscissa = Math.floor(Math.random() * 15);
          ordinate = Math.floor(Math.random() * 15);
        }
        coordinate = {abscissa: abscissa, ordinate: ordinate}
      }
      return coordinate;
    };*/
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

    // console.log(myWeight, opponentWeight, my_abscissa, my_ordinate, opp_abscissa, opp_ordinate);

    if (myWeight >= opponentWeight) {
      return {abscissa: my_abscissa, ordinate: my_ordinate};
    } else {
      return {abscissa: opp_abscissa, ordinate: opp_ordinate};
    }
  };

  return Computer;
});