/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function match(opponentFinger, callback) {
    api.post('/match', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return match;
});