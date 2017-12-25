/**
 * Created by Livelybone on 2017-12-17.
 */

define(['action/get-players', 'action/invite', 'action/chess', 'action/listen-player', 'action/listen-invite', 'action/refuse', 'action/accept', 'action/match', 'action/give-up'],
  function (getPlayers, invite, chess, listenPlayer, listenInvite, refuse, accept, match, giveUp) {
    return {
      getPlayers: getPlayers,
      invite: invite,
      chess: chess,
      listenPlayer: listenPlayer,
      listenInvite: listenInvite,
      refuse: refuse,
      accept: accept,
      match: match,
      giveUp: giveUp,
    }
  });