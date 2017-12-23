/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

// 在服务器中的所有玩家，玩家属性：
// name, finger(id), role(阵营), opponent(对手信息：name、finger、role), chessboard(棋盘，落子信息),
// listenHandler(用于监听其他玩家的进出),
// chessHandler(用于监听对手下棋),
// inviteHandlers(用于监听我邀请的结果，可能有多个handler)
// matchHandler(用于监听我匹配的结果)
// listenInvitedHandler(用于监听其它玩家对我的邀请)
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

  console.log(url.pathname, req.method);
  routes.find(function (route) {
    if (url.pathname === route.route && req.method === route.method) {
      route.controller(req, res);
      return true;
    }
  });
}).listen(8080, function () {
  console.info('--------------Listening on port 8080--------------');
}).on('error', function (e) {
  console.error(e);
});
