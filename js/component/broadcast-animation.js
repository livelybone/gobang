/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'utils/get-name', 'utils/promise'], function (jquery, getName, promise) {
  var msgPromise = null;

  function animate(html, callback) {
    var broadcast = $('#broadcast');
    broadcast.css({position: 'relative', top: '10px', opacity: 0});
    broadcast.html(html);
    broadcast.animate({top: 0, opacity: 1}, 'slow', function () {
      setTimeout(function () {
        broadcast.animate({top: '-10px', opacity: 0}, function () {
          if (callback) callback();
        })
      }, 1000);
    });
  }

  function broadcastAnimation(html) {
    var fn = function () {
      return new promise.MyPromise(function (res, rej) {
        animate(html, res)
      })
    };
    if (!msgPromise) {
      msgPromise = fn();
    } else {
      msgPromise = msgPromise.then(fn);
    }
  }

  function playerInOut(player, enterOrLeave) {
    var html;
    if (enterOrLeave === 'enter')
      html = $(
        '<span class="blue">' + getName(player) + '</span><span>进入了我们的五子棋世界</span>'
      );
    else
      html = $(
        '<span class="red">' + getName(player) + '</span><span>离开了</span>'
      );
    broadcastAnimation(html)
  }

  function refused(opponent) {
    broadcastAnimation($(
      '<span class="red">' + getName(opponent) + '</span><span>残忍的拒绝了你的邀请</span>'
    ))
  }

  function inviteTimeout(opponent) {
    broadcastAnimation($(
      '<span>您的请求没有得到</span><span class="red">' + (getName(opponent) || '对方') + '</span><span>的回应！</span>'
    ))
  }

  return {
    broadcastAnimation: broadcastAnimation,
    playerInOut: playerInOut,
    refused: refused,
    inviteTimeout: inviteTimeout
  };
});