/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/player', 'component/chessboard'], function (Player, chessboard) {
  function Computer(name, role, opponent) {
    // opponent: Player实例化对象

    Player.apply(this, [name, role]);

    this.isComputer = true;
    this.opponent = opponent;

    this.computeCoordinate = function () {
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
    };
  }

  Computer.prototype.chess = function (callback) {
    var coordinate = this.computeCoordinate();
    this.pieces.createPiece(coordinate);
    try {
      if (callback) callback();
    } catch (e) {
      console.error(e);
    }
  };

  return Computer;
});