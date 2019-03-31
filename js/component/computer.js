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
    // 如果是第一个落子，则落在正中央
    if (this.role === 'black' && this.pieces.piecesArr.length === 0) return {abscissa: 7, ordinate: 7};

    // 通过比较棋盘上我（计算机）在每个坐标落子后赢的可能性（权重），得到我最优的落子坐标
    // 通过比较棋盘上对手在每个坐标落子后赢的可能性（权重），得到对手最优的落子坐标
    // 比较两个最优坐标的权重，得到真正的最优坐标，即为结果
    var myMaxWeight = 0, // 目前我的最大权重
      opponentMaxWeight = 0, // 目前对手的最大权重
      my_abscissa = 0, my_ordinate = 0, opp_abscissa = 0, opp_ordinate = 0, // 坐标信息
      myWeights = chessboard.winWeights[this.role], // 棋盘上我（计算机）在每个坐标落子后赢的可能性（权重）
      opponentWeights = chessboard.winWeights[this.role === Role.black ? Role.white : Role.black]; // 棋盘上对手在每个坐标落子后赢的可能性（权重）

    // 遍历 myWeights
    myWeights.forEach(function (middle, abscissa) {
      middle.forEach(function (weight, ordinate) {
        // 如果现在坐标的权重大于目前我的最大权重，则更新 myMaxWeight 和坐标信息
        if (myMaxWeight < weight) {
          myMaxWeight = weight;
          my_abscissa = abscissa;
          my_ordinate = ordinate;
        }
      })
    });

    opponentWeights.forEach(function (middle, abscissa) {
      // 如果现在坐标的权重大于目前对手的最大权重，则更新 opponentMaxWeight 和坐标信息
      middle.forEach(function (weight, ordinate) {
        if (opponentMaxWeight < weight) {
          opponentMaxWeight = weight;
          opp_abscissa = abscissa;
          opp_ordinate = ordinate;
        }
      })
    });

    // 比较 myMaxWeight 和 opponentMaxWeight，返回最优解
    if (myMaxWeight >= opponentMaxWeight) {
      return {abscissa: my_abscissa, ordinate: my_ordinate};
    } else {
      return {abscissa: opp_abscissa, ordinate: opp_ordinate};
    }
  };

  return Computer;
});