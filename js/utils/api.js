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

    this.errorFn = function (xhr, errorMsg, exception) {
      console.error({xhr: xhr, errorMsg: errorMsg, exception: exception})
    };
    var that = this;

    this.get = function get (url, body, callback, errorFn, timeoutFn) {
      this.call('GET', url, body, callback, errorFn, timeoutFn);
    };

    this.post = function post (url, body, callback, errorFn, timeoutFn) {
      this.call('POST', url, body, callback, errorFn, timeoutFn);
    };

    this.call = function post (method, url, body, callback, errorFn, timeoutFn) {
      var data = $.extend(body, {finger: this.finger});
      $.ajax({
        type: method,
        url: config.backendUrl + url,
        data: data,
        timeout: config.requestTimeout,
        success: function (data, textStatus, jqXHR) {
          if (callback) callback(parse(data));
        },
        error: function (xhr, errorMsg, exception) {
          if (errorMsg !== 'timeout') {
            that.errorFn(xhr, errorMsg, exception);
            if (errorFn) errorFn(xhr, errorMsg, exception);
          } else {
            if (timeoutFn) timeoutFn();
          }
        }
      });
    };
  }

  function parse(data) {
    "use strict";
    var d;
    try {
      d = JSON.parse(data);
    } catch (e) {
      d = data;
    }
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