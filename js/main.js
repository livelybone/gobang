// 项目也没有特别复杂，就没有使用jQuery,react,angular2,vue框架了，使用了requireJS将js模块化

require.config({
  baseUrl: './js',
  paths: {
    jquery: 'jquery.min'
  }
});

requirejs.onError = function err(error) {
  console.error(error);
};

require(['jquery', 'play', 'action/action', 'utils/api', 'event-handler', 'component/playerList', 'component/broadcast-animation', 'utils/compare-players', 'component/game-button-tips'],
  function (jQuery, Play, action, api, handler, playerList, broadcast, comparePlayers, btnTip) {
    console.log('jQuery version: ' + jQuery().jquery);
    window['finger'] = api.finger;
    window['chessboard'] = new Play();
    window['btnTip'] = btnTip;
    chessboard.init();
    playerList.init('#players');

    // action.getPlayers(handler.getPlayersHandler);

    action.getPlayers(function (data) {
      playerList.Players = data.data.players;
      playerList.renderPlayerList('#players', data.data.players);

      // 建立玩家变动的长轮询
      action.listenPlayer(function listenPlayerHandler(data) {
        if (data.type !== 'CLOSE') {
          const players = comparePlayers(playerList.Players, data.data.players);
          console.log(players);
          players.forEach(function (player) {
            if (player.enterOrLeave !== 'enter') {
              $('#' + player.finger.replace('.', '')).remove();
            } else {
              playerList.renderPlayer('#players', player, player.finger === api.finger)
            }
            broadcast.playerInOut(player, player.enterOrLeave);
          });
          playerList.Players = data.data.players;
        }
      });

      // 建立被邀请的长轮询
      action.listenInvite(handler.listenInviteHandler)
    })
  });

