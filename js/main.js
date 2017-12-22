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

    action.listenPlayer(function (data) {
      "use strict";
      if (data) {
        console.log('new player', data);
        animation(data.player, data.enterOrLeave);
        if (data.refresh) renderPlayer(data.player);
      }
    });

    action.listenInvite(function (data) {
      "use strict";
      if (data) {
        console.log('be invited', data);

        renderOverlay(data.player);
      }
    })
  });

  function animation(player, enterOrLeave) {
    "use strict";
    var broadcast = $('#broadcast');
    if (enterOrLeave === 'enter')
      broadcast.html($(
        '<span class=\'blue\'>' + getName(player) + '</span>进入了我们的五子棋世界'
      ));
    else
      broadcast.html($(
        '<span class=\'red\'>' + getName(player) + '</span>离开了'
      ))
  }

  function renderOverlay(player) {
    "use strict";
    var overlay = $(
      '<div id="overlay">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title">' + getName(player) + '邀请您对弈</h1>\n' +
      '    <div class="float-btn-group">\n' +
      '      <button class=\'float-btn\' id="refuse">拒绝</button>\n' +
      '      <button class=\'float-btn\' id="accept">接受</button>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    overlay.find('#refuse').bind('click', removeOverlay.bind(null, '#overlay'));
    overlay.find('#accept').bind('click', removeOverlay.bind(null, '#overlay'));
    overlay.find('#refuse').bind('click', function () {
      action.refuse(player.finger);
    });
    overlay.find('#accept').bind('click', function () {
      action.accept(player.finger)
    });
    $(document.body).append(overlay);
  }

  function renderOverlayTip(player, win) {
    "use strict";
    var overlayTip = $(
      '<div id="overlay-tip">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title" id="result">' + (win ? 'Wao! 你赢啦' : 'Opps! ' + getName(player) + '把虐你成XX啦') + '</h1>\n' +
      '    <div class="float-btn-group">\n' +
      '      <button class=\'float-btn\' id="ok">' + (win ? '朕知道了' : 'WoW! 逃') + '</button>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    overlayTip.find('button#ok').bind('click', removeOverlay.bind(null, '#overlay-tip'));
    if (!win) {
      overlayTip.find('div.float-btn-group').append($('<button class=\'float-btn\' id="again">不服，再战！</button>\n'));
      overlayTip.find('#again').bind('click', removeOverlay.bind(null, '#overlay-tip'));
      overlayTip.find('#again').bind('click', function () {
        action.invite(player.finger);
      });
    }
    $(document.body).append(overlayTip);
  }

  function renderPlayerList(players) {
    $('#players').find('div.player').map(function (index, child) {
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
      (isMe ? '我' : getName(player)) +
      '</h2>' +
      '<button class="chess-btn' + (player.isChess ? ' disable' : '') + '">' +
      (isMe ? '匹配' : player.isChess ? '正在游戏' : '对弈') +
      '</button>' +
      '</div>'
    );
    div.find('button.chess-btn').bind('click', function () {
      action.invite(player.finger);
    });
    $('#players').append(div);
  }

  function getName(player) {
    "use strict";
    return player.name || ('玩家' + (player.finger.slice(-9, -1) * 10000))
  }
});

function removeOverlay(selector) {
  "use strict";
  console.log(selector, 'remove')
  $(selector).remove();
}

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