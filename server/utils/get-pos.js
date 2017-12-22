var URL = require('url'), getData = require('./get-data');
module.exports = function getPos(req, callback) {
  getData(req, function (data) {
    "use strict";
    // console.log(data);
    var pos = data.data.pos;
    pos.x = pos.x || 0;
    pos.y = pos.y || 0;
    if (callback) callback(pos);
  })
};