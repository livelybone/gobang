/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var enter = require('./controller/player/enter-controller');
var leave = require('./controller/player/leave-controller');
var chess = require('./controller/chess/chess-controller');
var invite = require('./controller/chess/match/invite-controller');
var refuse = require('./controller/chess/match/refuse-controller');
var accept = require('./controller/chess/match/accept-controller');
var listenInvited = require('./controller/chess/match/listen-invited-controller');
var match = require('./controller/chess/match/match-controller');
var listenPlayer = require('./controller/player/listen-player-controller');

var listenGiveUp = require('./controller/chess/give-up/listen-give-up-controller');
var giveUp = require('./controller/chess/give-up/give-up-controller');
var giveUpResponse = require('./controller/chess/give-up/give-up-response-controller');

var listenWithdraw = require('./controller/chess/withdraw/listen-withdraw-controller');
var withdraw = require('./controller/chess/withdraw/withdraw-controller');
var withdrawResponse = require('./controller/chess/withdraw/withdraw-response-controller');

module.exports = [
  enter,
  leave,
  chess,
  invite,
  refuse,
  accept,
  listenInvited,
  match,
  listenPlayer,
  listenGiveUp,
  giveUp,
  giveUpResponse,
  listenWithdraw,
  withdraw,
  withdrawResponse,
];