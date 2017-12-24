var URL = require('url'), getData = require('./get-data');
module.exports = function getFinger(req, callback) {
  getData(req, function (data) {
    "use strict";
    console.log(data);
    var finger = data.data.finger || '';

    if (callback) callback(finger);
  });
};