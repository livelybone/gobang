/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

var players = [];
var chessPlayers = [];
var routes = Routes();

var http = require('http'), URL = require('url'),
  server = http.createServer(function (req, res) {
    var finger = getFinger(req);
    res.writeHead(200, {
      'Content-Type': 'text/plain;charset=utf-8',
      'Set-Cookie': 'finger=' + finger,
      'Access-Control-Allow-Origin': '*'
    });

    var url = URL.parse(req.url);
    routes.find(function (route) {
      if (url.pathname === route.route) {
        res.end(route.tip);
        return true;
      }
    });
    res.end('Hello world!');
  }).listen(8080, function () {
    console.info('--------------Listening on port 8080--------------');
  }).on('error', function (e) {
    console.error(e);
  });

function getFinger(req) {
  var cookie = {}, finger;
  if (!req.headers.cookie) finger = null;
  else {
    req.headers.cookie.split(';').map(function (kv) {
      var arr = kv.trim().split('=');
      if (arr[0] && arr[1]) cookie[arr[0]] = arr[1];
      return kv;
    });
    finger = cookie['finger'];
  }
  finger = finger || (new Date().getTime() + '' + Math.random().toFixed(5));
  var player = players.find(function (player) {
    return player.finger === finger;
  });
  if (!player) players.push({finger: finger});

  return finger;
}

function Routes() {
  return [
    {route: '/enter', tip: '欢迎进入我的五子棋'},
    {route: '/start', tip: '游戏开始'},
    {route: '/chess', tip: '下棋'},
    {route: '/give-up', tip: '投降'},
    {route: '/leave', tip: '离开游戏'}
  ];
}