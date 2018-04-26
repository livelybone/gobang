/**
 * Created by Livelybone on 2017-12-17.
 */
define([], function () {

  function removeAllOverlay() {
    $("#overlay-tip").remove();
    $("#overlay-tip-holder").remove();
    $("#overlay").remove();
  }

  function renderOverlay(tip, cancelText, confirmText, cancelFn, confirmFn) {
    removeAllOverlay();
    var overlay = $(
      '<div id="overlay">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title">' + tip + '</h1>\n' +
      '    <div class="float-btn-group">\n' +
      '      <button class="float-btn" id="confirm">' + (confirmText || '接受') + '</button>\n' +
      '      <button class="float-btn" id="cancel">' + (cancelText || '拒绝') + '</button>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    overlay.find('#cancel').bind('click', function () {
      if (cancelFn) cancelFn();
      overlay.remove();
      overlay = null;
    });
    overlay.find('#confirm').bind('click', function () {
      if (confirmFn) confirmFn();
      overlay.remove();
      overlay = null;
    });
    $(document.body).append(overlay);
    return overlay;
  }

  function overlayTip(tip, btnText, confirmFn, otherBtn) {
    removeAllOverlay();
    var overlayTip = $(
      '<div id="overlay-tip">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
      '    <div class="float-btn-group">\n' +
      '      <button class=\'float-btn\' id="confirm">' + (btnText || '确定') + '</button>\n' +
      (otherBtn ? '      <button class=\'float-btn\' id="other-btn">' + (otherBtn.text || '不服，再战！') + '</button>\n' : '') +
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    overlayTip.find('button#confirm').bind('click', function () {
      if (confirmFn) confirmFn();
      overlayTip.remove();
      overlayTip = null;
    });
    if (overlayTip.find('button#other-btn')) {
      overlayTip.find('button#other-btn').bind('click', function () {
        if (otherBtn.clickFn instanceof Function) otherBtn.clickFn();
        overlayTip.remove();
        overlayTip = null;
      });
    }
    $(document.body).append(overlayTip);
    return overlayTip;
  }

  function overlayTipHolder(tip, clickFn, timeFn) {
    removeAllOverlay();
    var overlayTip = $(
      '<div id="overlay-tip-holder">\n' +
      '  <div class="float-win">\n' +
      '    <h1 class="float-title" id="result">' + tip + '</h1>\n' +
      '  </div>\n' +
      '</div>'
    );
    $(document.body).append(overlayTip);
    overlayTip.bind('click', function () {
      if (clickFn) clickFn();
    });
    if (timeFn) timeFn();
    return overlayTip;
  }


  return {
    renderOverlay: renderOverlay,
    overlayTipHolder: overlayTipHolder,
    overlayTip: overlayTip,
  };
});