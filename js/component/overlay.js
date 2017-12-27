/**
 * Created by Livelybone on 2017-12-17.
 */
define([
    'jquery',
    'action/action',
    'component/broadcast-animation',
    'utils/get-name',
    'component/overlay-tip'
  ],
  function (jquery, action, broadcast, getName, overlayTip) {
    function renderOverlay(player, type) {
      "use strict";
      var overlay = $(
        '<div id="overlay">\n' +
        '  <div class="float-win">\n' +
        '    <h1 class="float-title">' + getName(player) + (type === 'GIVEUP' ? '向您投降了' : '邀请您对弈') + '</h1>\n' +
        '    <div class="float-btn-group">\n' +
        '      <button class=\'float-btn\' id="refuse">拒绝</button>\n' +
        '      <button class=\'float-btn\' id="accept">接受</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      );
      overlay.find('#refuse').bind('click', function () {
        overlay.remove()
      });
      overlay.find('#accept').bind('click', function () {
        overlay.remove()
      });
      overlay.find('#refuse').bind('click', function () {
        if (type !== 'GIVEUP')
          action.refuse(player.finger);
        else
          action.giveUpAccept(false, function (data) {
            if (!data.gameOver) {
              overlayTip.refuseGiveUp(data.player);
            }
          });
      });
      overlay.find('#accept').bind('click', function () {
        if (type !== 'GIVEUP')
          action.accept(player.finger, function (data) {
            if (data.match === 'FAILED') overlayTip.matchFailed(data.opponent);
            else if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
          });
        else
          action.giveUpAccept(true, function (data) {
            if (data.gameOver) {
              overlayTip.giveUp(data.winner);
              window.chessboard.restart();

              action.listenInvite(function (data) {
                "use strict";
                if (data.type === 'invite') {
                  renderOverlay(data.player);
                }
              })
            }
          });
      });
      $(document.body).append(overlay);
    }

    function accepted(opponent, myRole) {
      window.chessboard.restart(myRole);
      begin(myRole, opponent);

      action.giveUpListen(function (data) {
        "use strict";
        if (data.gameOver === false) renderOverlay(data.player, 'GIVEUP');
      });
    }

    return {renderOverlay: renderOverlay, accepted: accepted};
  });