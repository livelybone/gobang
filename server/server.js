/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

global['players'] = [];
global['chessPlayers'] = [];
global['routes'] = require('./controller/controller');
global['queue'] = {};

var http = require('http'), URL = require('url'),
  server = http.createServer(function (req, res) {
    var url = URL.parse(req.url);
    var finger = getFinger(url);
    res.writeHead(200, {
      'Content-Type': 'text/plain;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });

    console.log(req.headers, req.headers.cookie);

    routes.find(function (route) {
      if (url.pathname === route.route) {
        if (route.pending) {
          queue[finger] = {
            type: route.type,
            res: res
          };
        } else {
          route.controller(finger, res);
          return true;
        }
      }
    });
  }).listen(8080, function () {
    console.info('--------------Listening on port 8080--------------');
  }).on('error', function (e) {
    console.error(e);
  });

function getFinger(url) {
  console.log(url);
  var finger = url.query['finger'];
  var player = players.find(function (player) {
    return player.finger === finger;
  });
  if (!player) players.push({finger: finger});

  return finger;
}

function Routes() {
  return [
    {route: '/enter', tip: '欢迎进入我的五子棋'},
    {route: '/listen/players', tip: '监听玩家进入退出', pending: true, type: 'player'},
    {route: '/invite', tip: '邀请游戏', pending: true, type: 'wait-for-accept'},
    {route: '/accept', tip: '接受邀请'},
    {route: '/chess', tip: '下棋', pending: true, type: 'chess'},
    {route: '/give-up', tip: '投降'},
    {route: '/leave', tip: '离开游戏'}
  ];
}