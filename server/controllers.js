/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var enter = require('./controller/enter-controller');
var leave = require('./controller/leave-controller');
var chess = require('./controller/chess-controller');
var invite = require('./controller/invite-controller');
var listenInvited = require('./controller/listen-invited-controller');
var match = require('./controller/match-controller');
var listenPlayer = require('./controller/listen-player-controller');

module.exports = [
  enter,
  leave,
  chess,
  invite,
  listenInvited,
  match,
  listenPlayer
];