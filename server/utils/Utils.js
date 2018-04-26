/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const URL = require('url'), querystring = require('querystring');
const resFormat = require("./ResponseFormat").resFormat;

function dataDeal(data) {

  const reg = /(^{.*}$)|(^\[.*]$)|(^true$)|(^false$)/;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      try {
        if (reg.test(data[key]))
          data[key] = JSON.parse(data[key]);
      } catch (e) {
        data[key] = data[key];
      }
    }
  }

  return data;
}

function getData(req, callback, errorFn) {
  let urlData = Object.assign({}, URL.parse(req.url, true).query);
  let postData = {}, data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    try {
      postData = Object.assign({}, querystring.parse(data));

      urlData = dataDeal(urlData);
      postData = dataDeal(postData);

      if (callback) callback({
        data: Object.assign({}, urlData, postData),
        getData: urlData,
        postData: postData
      });
    } catch (e) {
      errorFn(e);
    }
  });
}

function getFinger(req, callback, errorFn) {
  getData(req, function (data) {
    const finger = data.data.finger || '';

    if (callback) callback(finger);
  }, errorFn);
}

function defaultName(finger) {
  return '玩家' + finger.slice(-5)
}

function getPos(req, callback, errorFn) {
  getData(req, function (data) {
    const pos = data.data.pos;
    pos.x = pos.x || 0;
    pos.y = pos.y || 0;
    if (callback) callback(pos);
  }, errorFn)
}

function errorFn(res, e) {
  res.writeHead(500);
  res.end(resFormat('', 'ERROR: 500', e.message));
}

exports.getData = getData;
exports.getFinger = getFinger;
exports.defaultName = defaultName;
exports.getPos = getPos;
exports.errorFn = errorFn;