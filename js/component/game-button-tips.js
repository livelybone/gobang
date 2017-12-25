/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'start-game', 'action/action'], function (jquery, begin, action) {
  var btnGroup = $('#btn-group');

  function init() {
    "use strict";
    btnGroup.empty();
    var btn = $('<button class="green">撩撩电脑</button>');
    btn.on('click', function () {
      chooseRole();
    });
    btnGroup.append(btn);
  }

  function chooseRole() {
    "use strict";
    btnGroup.empty();
    var black = $('<button class="black">我执黑子</button>'), white = $('<button class="white">我执白子</button>');
    black.on('click', function () {
      begin('black');
      restartBtn();
    });
    white.on('click', function () {
      begin('white');
      restartBtn();
    });
    btnGroup.append(black);
    btnGroup.append(white);
  }

  function restartBtn() {
    "use strict";
    btnGroup.empty();
    var refresh = $('<button class="green">重新开始</button>');
    refresh.on('click', function () {
      window.chessboard.restart();
    });
    btnGroup.append(refresh);
  }

  function giveUpBtn() {
    "use strict";
    btnGroup.empty();
    var giveUp = $('<button class="black">投降认输</button>');
    giveUp.on('click', function () {
      action.giveUp(function(data){

      })
    });
    btnGroup.append(giveUp);
  }

  return {init: init, chooseRole: chooseRole, restartBtn: restartBtn};
});