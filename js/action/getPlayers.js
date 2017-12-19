/**
 * Created by Livelybone on 2017-12-17.
 */

define(['config/config'], function (config) {
  function getPlayers(callback) {
    $.get(config.backendUrl + '/enter', function (data) {
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