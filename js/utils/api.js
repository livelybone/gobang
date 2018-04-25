/**
 * Created by Livelybone on 2017-12-17.
 */

define(['config/config', 'jquery'], function (config, $) {
  function Api() {
    this.finger = getCookie('finger');

    var that = this;

    if (!this.finger) {
      this.finger = new Date().getTime() + '' + Math.random().toFixed(5);
      setCookie('finger', this.finger);
    }

    this.errorFn = function (xhr, errorMsg, exception) {
      console.error({xhr: xhr, errorMsg: errorMsg, exception: exception}, arguments)
    };

    this.get = function get(url, body, callback, errorFn) {
      this.call('GET', url, body, callback, errorFn);
    };

    this.post = function post(url, body, callback, errorFn) {
      this.call('POST', url, body, callback, errorFn);
    };

    this.getLongPolling = function get(url, body, callback, errorFn) {
      this.call('GET', url, body,
        function (data, textStatus, jqXHR) {
          if (data.type !== 'TIMEOUT' && callback) {
            callback(data, textStatus, jqXHR);
          }
          that.getLongPolling(url, body, callback, errorFn);
        },
        errorFn
      );
    };

    this.postLongPolling = function post(url, body, callback, errorFn) {
      this.call('POST', url, body, function (data, textStatus, jqXHR) {
          if (data.type !== 'TIMEOUT' && callback) {
            callback(data, textStatus, jqXHR);
          }
          that.postLongPolling(url, body, callback, errorFn);
        }, errorFn
      );
    };

    this.call = function post(method, url, body, callback, errorFn) {
      var data = $.extend(body, {finger: this.finger});
      $.ajax({
        type: method,
        url: config.backendUrl + url,
        data: data,
        success: function (data, textStatus, jqXHR) {
          if (callback) callback(parse(data), textStatus, jqXHR);
        },
        error: function (xhr, errorMsg, exception) {
          that.errorFn(xhr, errorMsg, exception);
          if (errorFn) errorFn(xhr, errorMsg, exception);
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