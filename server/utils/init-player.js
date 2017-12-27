module.exports = function initPlayer(player) {
  "use strict";
  player.opponent = null;
  player.role = null;
  player.chessHandle = null;
  player.chessboard = null;
  player.listenGiveUpHandler = null;
  player.listenWithdrawHandler = null;
};