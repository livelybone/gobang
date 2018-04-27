/**
 * Created by Livelybone on 2017-12-17.
 */
define(['jquery', 'utils/api', 'utils/get-name'], function (jquery, api, getName) {
  function begin(role, opponent, isReplay) {
    var roles = {
      me: {name: 'You', isComputer: false, role: role, finger: api.finger},
      opponent: {name: 'Computer', isComputer: true, role: role === 'black' ? 'white' : 'black'}
    };
    if (opponent) {
      roles.opponent.name = getName(opponent);
      roles.opponent.isComputer = false;
      roles.opponent.finger = opponent.finger;
    }
    if (!isReplay) window.chessboard.gameStart(roles.me, roles.opponent);
    return roles;
  }

  function replay(role, opponent, chessboard, nextRole) {
    var roles = this.begin(role, opponent, true);
    window.chessboard.gameReplay(roles.me, roles.opponent, chessboard, nextRole);
  }

  return {begin: begin, replay: replay};
});