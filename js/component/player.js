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
      var toNext = this.pieces.createPiece(this.convertCoordinate(clickDot));
      if (!toNext) return false;

      try {
        if (callback) callback();
      } catch (e) {
        console.error(e);
      }

      // 返回true表示已经落子
      return true;
    }
  };

  Player.prototype.getRelativePos = function (absPos) {
    // 计算落子相对于棋盘的位置
    var scroll = utils.getScroll();
    return {
      x: absPos.x - chessboard.boardOffset.offsetLeft + scroll.scrollLeft,
      y: absPos.y - chessboard.boardOffset.offsetTop + scroll.scrollTop
    };
  };

  Player.prototype.convertCoordinate = function (relPos) {
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