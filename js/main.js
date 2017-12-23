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

require(['jquery', 'play', 'action/action', 'utils/api'], function (jQuery, Play, action, api) {
  console.log('jQuery version: ' + jQuery().jquery);
  window['finger'] = api.finger;
  window['chessboard'] = new Play();
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
        inOut(data.player, data.enterOrLeave);
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

  function refused(opponent) {
    broadcastAnimation($(
      '<span class=\'red\'>' + getName(opponent) + '</span><span>残忍的拒绝了你的邀请</span>'
    ))
  }

  function accepted(opponent, myRole) {
    chessboard.restart();
    begin(myRole, opponent);
  }

  function inOut(player, enterOrLeave) {
    var html;
    if (enterOrLeave === 'enter')
      html = $(
        '<span class=\'blue\'>' + getName(player) + '</span><span>进入了我们的五子棋世界</span>'
      );
    else
      html = $(
        '<span class=\'red\'>' + getName(player) + '</span><span>离开了</span>'
      );
    broadcastAnimation(html)
  }

  function broadcastAnimation(html) {
    "use strict";
    var broadcast = $('#broadcast');
    broadcast.css({position: 'relative', top: '25px', opacity: 0});
    broadcast.html(html);
    broadcast.animate({top: 0, opacity: 1}, 'slow', function () {
      setTimeout(function () {
        broadcast.animate({top: '-25px', opacity: 0})
      }, 1000);
    });
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
      action.accept(player.finger, function (data) {
        if (data.match === 'FAILED') matchFailed(data.opponent);
        else if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
      })
    });
    $(document.body).append(overlay);
  }

  function renderOverlayTip(tip, btnText, win, finger) {
    "use strict";
    var overlayTip = $(
      '<div id="overlay-tip">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
      '    <div class="float-btn-group">\n' +
      '      <button class=\'float-btn\' id="ok">' + btnText + '</button>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    overlayTip.find('button#ok').bind('click', removeOverlay.bind(null, '#overlay-tip'));
    if (win === false && finger) {
      overlayTip.find('div.float-btn-group').append($('<button class=\'float-btn\' id="again">不服，再战！</button>\n'));
      overlayTip.find('#again').bind('click', removeOverlay.bind(null, '#overlay-tip'));
      overlayTip.find('#again').bind('click', function () {
        action.invite(finger, function (data) {
          if (data.match === 'REFUSE') refused(data.opponent);
          if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
        });
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
      action.invite(player.finger, function (data) {
        if (data.match === 'REFUSE') refused(data.opponent);
        if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
      });
    });
    $('#players').append(div);
  }

  function getName(player) {
    "use strict";
    return player.name || ('玩家' + (player.finger.slice(-6, -1) + player.finger.slice(0).split('').pop()).split('.').join(''))
  }

  function removeOverlay(selector) {
    "use strict";
    console.log(selector, 'remove');
    $(selector).remove();
  }

  function begin(role, opponent) {
    var roles = [
      {name: 'You', isComputer: false},
      {name: 'Computer', isComputer: true}
    ];
    roles[0].finger = api.finger;
    if (opponent) {
      roles[1].name = getName(opponent);
      roles[1].isComputer = false;
      roles[1].finger = opponent.finger;
    }
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
});

