/**
 * Created by Livelybone on 2017-12-17.
 */

define([
    'action/get-players',
    'action/invite',
    'action/chess',
    'action/listen-player',
    'action/listen-invite',
    'action/invite-response',
    'action/match',
    'action/give-up',
    'action/listen-give-up',
    'action/give-up-response',
    'action/listen-withdraw',
    'action/withdraw',
  ],
  function (getPlayers, invite, chess, listenPlayer, listenInvite, inviteResponse, match, giveUp, giveUpListen, giveUpResponse, listenWithdraw, withdraw) {
    return {
      getPlayers: getPlayers,
      invite: invite,
      chess: chess,
      listenPlayer: listenPlayer,
      listenInvite: listenInvite,
      inviteRefuse: inviteResponse.refuse,
      inviteAccept: inviteResponse.accept,
      match: match,
      giveUp: giveUp,
      giveUpListen: giveUpListen,
      giveUpResponse: giveUpResponse,
      listenWithdraw: listenWithdraw,
      withdraw: withdraw.withdraw,
      withdrawAccept: withdraw.withdrawResponse,
    }
  });