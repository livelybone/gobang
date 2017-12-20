/**
 * Created by Livelybone on 2017-12-17.
 */

define(['jquery'], function () {
  function Api() {
    this.finger = getCookie('finger');
    if (!this.finger) {
      this.finger = new Date().getTime() + '' + Math.random().toFixed(5)
      setCookie('finger', this.finger);
    }

    this.get = function get() {
      console.log(arguments);
      var url = arguments[0], body = {}, callback;
      if (arguments.length === 2) {
        callback = arguments[1];
      } else if (arguments.length >= 3) {
        body = arguments[1];
        callback = arguments[2];
      }
      $.get(url, $.extend(body, {finger: this.finger}), callback);
    }
  }

  function getCookie(key) {
    var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
    var arr = document.cookie.match(reg);
    return arr ? arr[2] : '';
  }

  function setCookie(key, value) {
    document.cookie = key + '=' + value;
  }

  function delCookie(key) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = key + '=;expires=' + exp.toGMTString();
  }

  return new Api();
});