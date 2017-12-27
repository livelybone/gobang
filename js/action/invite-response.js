/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function accept(opponentFinger, callback) {
    api.post('/accept', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  function refuse(opponentFinger, callback) {
    api.post('/refuse', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return {accept: accept, refuse: refuse};
});