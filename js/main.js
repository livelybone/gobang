// 项目也没有特别复杂，就没有使用jQuery,react,angular2,vue框架了，使用了requireJS将js模块化

require.config({
  baseUrl: './js',
  paths: {
    jquery: 'jquery.min'
  }
});

requirejs.onError = err;

require(['jquery', 'action/chess', 'action/action', 'utils/api'], function (jQuery, Chess, action, api) {
  console.log('jQuery version: ' + jQuery().jquery);
  window['finger'] = api.finger;
  window['chessboard'] = new Chess();
  chessboard.init();
  $('#black').bind('click', begin.bind(null, 'black'));
  $('#white').bind('click', begin.bind(null, 'white'));
  $('#restart').bind('click', restart.bind(null));

  action.getPlayers(function (data, status, xhr) {
    renderPlayerList(data.players);
    action.listenPlayer(function(data){

    })
  });


  function renderPlayerList(players) {
    $('#players').children('div.player').map(function (index, child) {
      $(child).remove();
    });
    players
      .filter(function (player) {
        if (player.finger === finger) {
          renderPlayer(player, true);
          return false;
        }
        return true;
      })
      .map(function (player) {
        renderPlayer(player);
      })
  }

  function renderPlayer(player, isMe) {
    console.log(player.finger);
    var div = $(
      '<div class="player">' +
      '<h2 class="name">' +
      (isMe ? '我' : player.name || ('玩家' + (player.finger.slice(-9, -1) * 10000))) +
      '</h2>' +
      '<button class="chess-btn">' +
      (isMe ? '匹配' : '对弈') +
      '</button>' +
      '</div>'
    );
    $(div.children('button.chess-btn')[0]).bind('click', function () {
      action.invite(player.finger);
    });
    $('#players').append(div);
  }
});

function begin(role) {
  var roles = [
    {name: 'You', isComputer: false},
    {name: 'Computer', isComputer: true}
  ];
  var roleBlack = role === 'black' ? roles[0] : roles[1], roleWhite = role === 'white' ? roles[0] : roles[1];
  chessboard.gameStart(roleBlack, roleWhite);
  $('#black').hide();
  $('#white').hide();
  $('#tip').hide();
  $('#restart').show();
}

function restart() {
  chessboard.restart();
  $('#black').show();
  $('#white').show();
  $('#tip').show();
  $('#restart').hide();
}

function err(error) {
  console.error(error);
}