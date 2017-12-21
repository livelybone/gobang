/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

// 在服务器中的所有玩家
global['players'] = [];

// 在服务器中对弈的玩家组合
global['chessPlayers'] = [];

// 在服务器中的消息队列，包括玩家进出，玩家邀请等待，玩家对弈
global['queue'] = [];

// 路由控制
global['routes'] = require('./controller/controller');

var http = require('http'),
  URL = require('url');

http.createServer(function (req, res) {
  var url = URL.parse(req.url, true);
  res.writeHead(200, {
    'Content-Type': 'text/plain;charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });

  routes.find(function (route) {
    if (url.pathname === route.route) {
      route.controller(req, res);
      return true;
    }
  });
}).listen(8080, function () {
  console.info('--------------Listening on port 8080--------------');
}).on('error', function (e) {
  console.error(e);
});

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