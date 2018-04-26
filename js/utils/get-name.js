/**
 * Created by Livelybone on 2017-12-17.
 */

define(function () {
  function getName(player) {
    "use strict";
    return player && (player.name || ('玩家' + player.finger.slice(-6, 0)))
  }

  return getName;
});