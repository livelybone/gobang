exports.initPlayer = function initPlayer(player) {
  "use strict";
  player.opponent = null;
  player.role = null;
  player.chessboard = null;

  if (player.chessHandler && player.chessHandler.res)
    player.chessHandler.res.end('end');
  player.chessHandler = null;

  if (player.listenGiveUpHandler && player.listenGiveUpHandler.res)
    player.listenGiveUpHandler.res.end('end');
  player.listenGiveUpHandler = null;

  if (player.listenWithdrawHandler && player.listenWithdrawHandler.res)
    player.listenWithdrawHandler.res.end('end');
  player.listenWithdrawHandler = null;
};

exports.initPlayerChess = function initPlayer(player) {
  "use strict";
  if (player.inviteHandlers) {
    player.inviteHandlers.map(function (handler) {
      // 结束handler
      if (handler.res) handler.res.end('chess')
    });
  }
  player.inviteHandlers = null;

  if (player.listenInvitedHandler && player.listenInvitedHandler.res)
    player.listenInvitedHandler.res.end('end');
  player.listenInvitedHandler = null;

  if (player.matchHandler && player.matchHandler.res)
    player.matchHandler.res.end('end');
  player.matchHandler = null;
};