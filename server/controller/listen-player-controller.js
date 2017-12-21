/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var getFinger = require('../utils/get-finger');

exports.route = '/listen/players';
exports.controller = function (req, res) {
  var finger = getFinger(req.url);
  queue.push({
    finger: finger,
    type: 'player',
    res: res
  });
};