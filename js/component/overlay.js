/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'action/action', 'component/broadcast-animation', 'utils/get-name', 'component/overlay-tip'], function (jquery, action, broadcast, getName, overlayTip) {
  function overlay(player) {
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
    overlay.find('#refuse').bind('click', function () {
      overlay.remove()
    });
    overlay.find('#accept').bind('click', function () {
      overlay.remove()
    });
    overlay.find('#refuse').bind('click', function () {
      action.refuse(player.finger);
    });
    overlay.find('#accept').bind('click', function () {
      action.accept(player.finger, function (data) {
        if (data.match === 'FAILED') overlayTip.matchFailed(data.opponent);
        else if (data.match === 'SUCCESS') accepted(data.opponent, data.role);
      })
    });
    $(document.body).append(overlay);
  }

  return {renderOverlay: overlay};
});