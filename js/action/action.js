/**
 * Created by Livelybone on 2017-12-17.
 */

define(['action/get-players', 'action/invite', 'action/chess'], function (getPlayers, invite, chess) {
  return {
    getPlayers: getPlayers,
    invite: invite,
    chess: chess,
  }
});