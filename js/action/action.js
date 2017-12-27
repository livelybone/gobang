/**
 * Created by Livelybone on 2017-12-17.
 */

define([
    'action/get-players',
    'action/invite',
    'action/chess',
    'action/listen-player',
    'action/listen-invite',
    'action/refuse',
    'action/accept',
    'action/match',
    'action/give-up',
    'action/listen-give-up',
    'action/give-up-accept'
  ],
  function (getPlayers, invite, chess, listenPlayer, listenInvite, refuse, accept, match, giveUp, giveUpListen, giveUpAccept) {
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
      giveUpListen: giveUpListen,
      giveUpAccept: giveUpAccept,
    }
  });