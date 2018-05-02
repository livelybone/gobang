/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const http = require('http'),
  URL = require('url'),
  resFormat = require('./utils/ResponseFormat').resFormat,
  Controllers = require('./Controllers'),// 路由控制
  port = process.env.PORT || 8085,
  Players = require("./Players"),
  errorFn = require("./utils/Utils").errorFn;

const server = http.createServer(function (req, res) {
  try {
    const url = URL.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    req.on('close', function () {
      console.log('close');
      Players.del(url.query.finger);
      req.destroy();
      res.destroy();
    });

    res.on('timeout', function (socket) {
      res.end(resFormat('', 'TIMEOUT', '超时了！'));
      socket.destroy();
      res.destroy();
      req.destroy();
      console.log(`request: ${url.pathname}(${req.method}) timeout`);
    });

    console.log(req.method, url.pathname, new Date());
    const route = Controllers.routes.find(route => url.pathname === route.route && req.method === route.method);
    if (!route) {
      res.writeHead(404);
      res.end(resFormat('', 'ERROR: 404', '路径错误！'));
    } else {
      route.controller(req, res);
    }
  } catch (e) {
    errorFn(res, e);
  }
}).listen(port, function () {
  console.info('--------------Listening on port %d--------------', this.address().port);
}).on('error', function (e) {
  console.error(e);
});

server.timeout = 1000 * 60 * 2; // 设置超时时间