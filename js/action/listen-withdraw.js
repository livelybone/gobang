/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function listenWithdraw(callback) {
    // 建立长轮询
    api.get('/listen/withdraw', {}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr);

        //再次建立长轮询
        listenWithdraw(callback);
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      console.log(xhr, xhr.status, xhr.readyState, errorMsg, exception);
      // listenWithdraw(callback)
    })
  }

  return listenWithdraw;
});