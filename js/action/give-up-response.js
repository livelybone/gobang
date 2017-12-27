/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function giveUpResponse(accept, callback) {
    api.post('/give-up/response', {accept: accept}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return giveUpResponse;
});