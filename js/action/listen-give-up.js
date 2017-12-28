/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function giveUpListen(callback) {
    api.get('/give-up/listen', {}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      giveUpListen(callback)
    })
  }

  return giveUpListen;
});