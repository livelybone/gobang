/**
 * Created by Livelybone on 2017-12-17.
 */

define(['config/config', 'utils/api'], function (config, api) {
  function invite(opponentFinger, callback) {
    api.post(config.backendUrl + '/invite', {opponentFinger: opponentFinger}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    })
  }

  return invite;
});