/**
 * Created by Livelybone on 2017-12-17.
 */
define(['component/chessboard', 'component/pop-up'], function (chessboard, popup) {
  function Pieces(role) {
    // 棋子30px*30px
    this.pieceWidth = 30;
    this.src = role === 'black' ? './images/black.png' : './images/white.png';

    // 棋子信息数组，元素属性：abscissa 横坐标，ordinate 纵坐标，piece 棋子dom元素
    this.piecesArr = [];

    this.createPiece = function createPiece(coordinate) {
      //不能重复落子
      if (chessboard.coordinates[coordinate.abscissa][coordinate.ordinate] !== 0) {
        popup.animation("Don't play<br/>at the same place", 500);
        return false;
      }

      var piece = document.createElement('img'), pos = this.coordinateConvertToPos(coordinate);
      piece.src = this.src;
      piece.style.position = 'absolute';
      piece.style.left = pos.left;
      piece.style.top = pos.top;
      piece.style.margin = '-' + (this.pieceWidth / 2 + chessboard.lineWidth) + 'px ' + '0 0 -' + (this.pieceWidth / 2 + chessboard.lineWidth) + 'px ';
      chessboard.board.appendChild(piece);

      // 保存棋子信息
      this.piecesArr.push({piece: piece, abscissa: coordinate.abscissa, ordinate: coordinate.ordinate});
      chessboard.coordinates[coordinate.abscissa][coordinate.ordinate] = role;
      return true
    };

    this.coordinateConvertToPos = function coordinateConvertToPos(coordinate) {
      // 计算棋子的落位
      var pos = {left: '', top: ''};
      pos.left = this.calcPos(coordinate.abscissa) + 'px';
      pos.top = this.calcPos(coordinate.ordinate) + 'px';
      return pos;
    };

    this.calcPos = function calcPos(ordinate) {
      // ordinate: 横坐标或者纵坐标
      return chessboard.margin + chessboard.borderWidth +
        chessboard.cellWidth * ordinate + chessboard.lineWidth * (ordinate - 1) +
        (ordinate === chessboard.lineCount - 1 ? chessboard.borderWidth : chessboard.lineWidth)
    }
  }

  return Pieces;
});