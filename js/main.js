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

require(['jquery', 'play', 'action/action', 'utils/api', 'event-handler', 'component/playerList', 'component/broadcast-animation'],
  function (jQuery, Play, action, api, handler, playerList, broadcast) {
    console.log('jQuery version: ' + jQuery().jquery);
    window['finger'] = api.finger;
    window['chessboard'] = new Play();
    chessboard.init();
    playerList.init('#players');

    // action.getPlayers(handler.getPlayersHandler);

    action.getPlayers(function (data) {
      playerList.renderPlayerList('#players', data.players);

      // 建立玩家变动的长轮询
      action.listenPlayer(function listenPlayerHandler(data) {
        if (data) {
          broadcast.playerInOut(data.player, data.enterOrLeave);
          if (data.refresh) playerList.renderPlayer('#players', data.player);
        }
      });

      // 建立被邀请的长轮询
      action.listenInvite(handler.listenInviteHandler)
    })
  });

