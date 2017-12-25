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

require(['jquery', 'play', 'action/action', 'utils/api', 'component/overlay', 'component/broadcast-animation', 'component/playerList'],
  function (jQuery, Play, action, api, overlay, broadcast, playerList) {
    console.log('jQuery version: ' + jQuery().jquery);
    window['finger'] = api.finger;
    window['chessboard'] = new Play();
    chessboard.init();

    action.getPlayers(function (data, status, xhr) {
      playerList.renderPlayerList(data.players);

      action.listenPlayer(function (data) {
        "use strict";
        if (data) {
          broadcast.playerInOut(data.player, data.enterOrLeave);
          if (data.refresh) playerList.renderPlayer(data.player);
        }
      });

      action.listenInvite(function (data) {
        "use strict";
        if (data.type === 'invite') {
          overlay.renderOverlay(data.player);
        }
      })
    });

    function accepted(opponent, myRole) {
      chessboard.restart(myRole);
      begin(myRole, opponent);
    }
  });

