/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'utils/api', 'utils/get-name'], function (jquery, api, getName) {
  function begin(role, opponent) {
    "use strict";
    var roles = {
      me: {name: 'You', isComputer: false, role: role},
      opponent: {name: 'Computer', isComputer: true, role: role === 'black' ? 'white' : 'black'}
    };
    roles.me.finger = api.finger;
    if (opponent) {
      roles.opponent.name = getName(opponent);
      roles.opponent.isComputer = false;
      roles.opponent.finger = opponent.finger;
    }
    window.chessboard.gameStart(roles.me, roles.opponent);
  }

  return begin;
});