/**
 * Created by Livelybone on 2017-12-17.
 */

define(['config/config', 'utils/api'], function (config, api) {
  function getPlayers(finger, callback) {
    api.get(config.backendUrl + '/enter', {finger: finger}, function (data) {
      console.log(data);
      try {
        if (callback) callback(data)
      } catch (e) {
        console.error();
      }
    })
  }

  return getPlayers;
});