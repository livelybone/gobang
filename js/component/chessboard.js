/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'utils/utils'], function (jquery, utils) {
  function Chessboard(board) {
    // board 棋盘DOM元素
    this.board = board;
    this.board.style.position = 'relative';

    // 五子棋纵横15道，棋盘设计：边界宽20px、边界线宽3px、线宽2px、棋格40px*40px、棋子30px*30px
    this.lineCount = 15;
    this.margin = 20;
    this.lineWidth = 2;
    this.borderWidth = 3;
    this.cellWidth = 40;
    this.width = this.margin * 2 + this.borderWidth * 2 + this.cellWidth * this.lineCount - 1 + this.lineWidth * 13;

    // 棋盘落子情况
    this.coordinates = [];

    // 黑白两方的下一步落子能赢的机会，值越大机会越大
    // this.winWeights.black[abscissa][ordinate]=value，value表示该位置落子能赢的权重
    this.winWeights = {black: [], white: []};

    // 棋盘相对文档页面左上角的位置，与落子时鼠标在页面的上位置计算，可求落子时棋子与棋盘的相对位置
    this.boardOffset = {offsetLeft: 0, offsetTop: 0};

    this.init = function () {
      this.board.innerHTML = '<img src="./images/chessboard.png" alt="">';
      if (!this.boardOffset.offsetLeft) this.boardOffset = utils.getOffset(this.board);

      for (var i = 0; i < 15; i++) {
        this.coordinates[i] = [];
        this.winWeights.black[i] = [];
        this.winWeights.white[i] = [];
        for (var j = 0; j < 15; j++) {
          // 0表示未被占位，1表示被黑子占位，2表示被白子占位
          this.coordinates[i][j] = 0;
          this.winWeights.black[i][j] = 0;
          this.winWeights.white[i][j] = 0;
        }
      }
    };
  }

  return new Chessboard($('#gobang')[0]);
});