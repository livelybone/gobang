/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function withdraw(callback) {
    api.post('/withdraw', {}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function withdrawResponse(accept, callback) {
    "use strict";
    api.post('/withdraw/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return {withdraw: withdraw, withdrawResponse: withdrawResponse};
});