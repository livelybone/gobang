/**
 * Created by Livelybone on 2017-12-17.
 */

define(['utils/api'], function (api) {
  function chess(chessboard, pos, role, callback) {
    api.post('/chess', {
      chessboard: chessboard ? JSON.stringify(chessboard) : chessboard,
      pos: pos ? JSON.stringify(pos) : pos,
      role: role
    }, function (data, status, xhr) {
      try {
        if (callback) callback(data, status, xhr)
      } catch (e) {
        console.error(e);
      }
    }, function () {
      chess(chessboard, pos, callback);
    })
  }

  return chess;
});