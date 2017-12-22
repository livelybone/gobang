/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

// 在服务器中的所有玩家，玩家属性：
// name, finger(id),opponent(对手信息，name,finger),
// listenHandle(用于监听其他玩家的进出),
// chessHandle(用于监听对手下棋),
// inviteHandle(用于监听我邀请的结果)
// matchHandle(用于监听我匹配的结果)
// listenInvitedHandle(用于监听其它玩家对我的邀请)
global['players'] = [];

// 路由控制
global['routes'] = require('./controllers');

var http = require('http'),
  URL = require('url');

http.createServer(function (req, res) {
  var url = URL.parse(req.url, true);
  res.writeHead(200, {
    'Content-Type': 'text/plain;charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });

  routes.find(function (route) {
    if (url.pathname === route.route && url.method === route.method) {
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