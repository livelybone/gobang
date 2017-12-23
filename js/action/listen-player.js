/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function listenPlayer(callback) {
    // 建立长轮询
    api.get('/listen/players', {}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr);

        //再次建立长轮询
        listenPlayer(callback);
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      console.log(xhr, errorMsg, exception);
      listenPlayer(callback)
    })
  }

  return listenPlayer;
});