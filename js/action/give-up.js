/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function giveUp(callback) {
    api.post('/give-up', function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return giveUp;
});