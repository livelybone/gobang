/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function listenInvite(callback) {
    // 建立长轮询
    api.get('/get/invite', {}, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr);

        // 如果开始对弈，则停止长轮询，如果空闲，再次进入长轮询
        // 如果开始对弈，接口返回''
        if (data !== 'chess') listenInvite(callback);
      } catch (e) {
        console.error(e);
      }
    }, function (xhr, errorMsg, exception) {
      console.log(xhr, xhr.status, xhr.readyState, errorMsg, exception);
      // listenInvite(callback)
    })
  }

  return listenInvite;
});