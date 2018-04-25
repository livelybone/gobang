/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

// 在服务器中的所有玩家，玩家属性：
// name, finger(id), role(阵营), opponent(对手信息：name、finger、role), chessboard(棋盘，落子信息),
// listenHandler(用于监听其他玩家的进出，或者匹配),
// chessHandler(用于监听对手下棋),
// inviteHandlers(用于监听我邀请的结果，可能有多个handler)
// matchHandler(用于监听我匹配的结果)
// listenInvitedHandler(用于监听其它玩家对我的邀请)
// listenGiveUpHandler(用于监听对手的投降请求)
// listenGiveUpResponseHandler(用于监听我的投降请求的结果)
// listenWithdrawHandler(用于监听对手的悔棋请求)
// listenWithdrawResponseHandler(用于监听我的悔棋请求的结果)
global['players'] = [];

const http = require('http'),
  URL = require('url'),
  routes = require('./controllers'),// 路由控制
  port = process.env.PORT || 8085;

const server = http.createServer(function (req, res) {
  try {
    const url = URL.parse(req.url, true);
    res.writeHead(200, {
      'Content-Type': 'text/plain;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });

    res.on('timeout', function (socket) {
      res.end(JSON.stringify({type: 'TIMEOUT', errorMsg: '超时了！'}));
      socket.destroy();
      res.destroy();
      req.destroy();
      console.log(`request: ${url.pathname}(${req.method}) timeout`);
    });

    console.log(req.method, url.pathname, new Date());
    const route = routes.find(function (route) {
      if (url.pathname === route.route && req.method === route.method) {
        route.controller(req, res);
        return true;
      }
    });
    if (!route) {
      res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8', 'Access-Control-Allow-Origin': '*'});
      res.end(JSON.stringify({errMsg: '路径错误！'}));
    }
  } catch (e) {
    res.writeHead(500, {
      'Access-Control-Allow-Origin': '*'
    });
    res.end(e.message);
  }
}).listen(port, function () {
  console.info('--------------Listening on port %d--------------', this.address().port);
}).on('error', function (e) {
  console.error(e);
});

server.timeout = 1000 * 60 * 2; // 设置超时时间