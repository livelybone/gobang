/**
 * Created by Livelybone on 2017-12-17.
 */

define(['config/config', 'jquery'], function (config, $) {
  function Api() {
    this.finger = getCookie('finger');
    if (!this.finger) {
      this.finger = new Date().getTime() + '' + Math.random().toFixed(5);
      setCookie('finger', this.finger);
    }

    $.ajaxSetup({
      error: function (xhr, errorMsg, exception) {
        console.error({xhr: xhr, errorMsg: errorMsg, exception: exception});
      }
    });

    this.get = function get() {
      var url = arguments[0], body = {}, callback;
      if (arguments.length === 2) {
        callback = arguments[1];
      } else if (arguments.length >= 3) {
        body = arguments[1];
        callback = arguments[2];
      }
      $.get(config.backendUrl + url, $.extend(body, {finger: this.finger}), function (data, textStatus, jqXHR) {
        if (callback) callback(parse(data));
      });
    };

    this.post = function post() {
      var url = arguments[0], body = {}, callback;
      if (arguments.length === 2) {
        callback = arguments[1];
      } else if (arguments.length >= 3) {
        body = arguments[1];
        callback = arguments[2];
      }
      $.post(config.backendUrl + url, $.extend(body, {finger: this.finger}), function (data, textStatus, jqXHR) {
        if (callback) callback(parse(data));
      });
    }
  }

  function parse(data) {
    "use strict";
    var d;
    try {
      d = JSON.parse(data);
    } catch (e) {
      console.log(e);
      d = data;
    }
    console.log(d);
    return d;
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