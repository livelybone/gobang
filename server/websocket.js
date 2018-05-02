﻿/*****************************************
 WebSocket - NodeJS扩展     2013-08-23
 作者：次碳酸钴（admin@web-tinker.com）
 *****************************************/

var net = require('net');
var crypto = require('crypto');
var WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

//对外接口
exports.createServer = function (callback) {
  return new WebSocketServer(callback);
};

//WebSocket服务器对象
function WebSocketServer(callback) {
  var stream;
  this.server = net.createServer(function (e) {
    var ws = new WebSocketSession(e, this.port, this.domain);
    ws.on('open', callback.bind(this, ws));
  }.bind(this));
  this.listen = function (port, domain) {
    this.port = port, this.domain = domain || '*';
    this.server.listen(port);
  };
};

//WebSocket会话对象
function WebSocketSession(connection, port, domain) {
  var stream = new Buffer(0), state = 0, events;
  events = this.events = {message: [], close: [], pong: [], open: []};
  this.connection = connection;
  //接收数据
  connection.on('data', function (e) {
    stream = Buffer.concat([stream, e]);
    // console.log(stream);
    if (state === 0) { //握手
      var string = stream.toString();
      string.replace(/^<policy-file-request\/>\x00/, function (e) {
        stream = stream.slice(e.length);
        connection.write([
          '<?xml version="1.0"?>',
          '<cross-domain-policy>',
          '<allow-access-from domain="' + domain + '" to-ports="' + port + '" />',
          '</cross-domain-policy>'
        ].join('\r\n') + '\0');
        return '';
      }).replace(/^[\s\S]*?\r\n\r\n/, function (e) {
        stream = stream.slice(e.length);
        var key, origin;
        key = e.match(/Sec-WebSocket-Key: (.+)|$/)[1];
        key = crypto.createHash('sha1').update(key + WS).digest('base64');
        origin = e.match(/Origin: https?:\/\/(.+)|$/)[1];
        if (!origin || domain === '*' || origin === domain) {
          connection.write([
            'HTTP/1.1 101 Switching Protocols',
            'Upgrade: websocket',
            'Connection: Upgrade',
            'Sec-WebSocket-Accept: ' + key
          ].join('\r\n') + '\r\n\r\n');
          state = 1;
          for (var i = 0, s = events['open']; i < s.length; i++) {
            s[i]();
          }
        }
        return '';
      });
    } else if (state === 1) { //通信
      var frame, event, param;
      while (frame = readFrame()) {
        switch (frame.opcode) {
          case 1:
            event = 'message', param = frame.data + '';
            break;
          case 2:
            event = 'message', param = frame.data;
            break;
          case 8:
            event = 'close', param = frame.data, state = 2;
            break;
          case 10:
            event = 'pong', param = frame.data;
            break;
          default:
            event = 'error', param = {
              frame: frame, message: '未知操作码'
            };
            break;
        }
        for (var i = 0, s = events[event]; i < s.length; i++) s[i](param);
      }
    }
  });
  //断开
  connection.on('close', function (e) {
    if (state < 2) {
      for (var i = 0, s = events['close']; i < s.length; i++) s[i]();
      state = 2;
    }
  });
  //异常
  connection.on('error', function (e) {
    if (e.code === 'ECONNRESET') return;
    console.log(e);
  });
  //基本方法
  this.send = function (e) {
    if (state === 1) writeFrame(e instanceof Buffer ? 2 : 1, e);
  };
  this.close = function (code, reason) {
    var data = new Buffer('  ' + reason);
    data.writeUInt16BE(code, 0);
    writeFrame(8, data);
    state = 2;
    connection.end();
  };
  this.ping = function (data) {
    writeFrame(9, data || '');
  };

  //读取帧
  function readFrame() {
    var i, p = 0, first, second, fin, opcode, size, mask, data;
    if (stream.length < 2) return;
    first = stream[p++], second = stream[p++];
    fin = (first & 128) >> 7, opcode = first & 127, size = second & 127;
    if (size === 126) size = stream.readUInt16BE(p), p += 2;
    else if (size === 127) size = stream.readUInt32BE(p += 4), p += 4;
    mask = stream.slice(p, p += 4), data = new Buffer(size);
    if (stream.length < p + size) return;
    for (i = 0; i < size; i++) data[i] = stream[p + i] ^ mask[i % 4];
    stream = stream.slice(p + size);
    return {opcode: opcode, data: data};
  };

  //写入帧
  function writeFrame(opcode, data) {
    if (typeof opcode === 'object') data = opcode.data, opcode = opcode.opcode;
    var size, first, second, third;
    first = new Buffer([128 + opcode]);
    third = new Buffer(data), size = third.length;
    if (size > 0xFFFF)
      second = new Buffer([127, 0, 0, 0, 0, 0, 0, 0, 0]),
        second.writeUInt32BE(size, 5);
    else if (size > 125)
      second = new Buffer([126, 0, 0]),
        second.writeUInt16BE(size, 1);
    else second = new Buffer([size]);
    connection.write(Buffer.concat([first, second, third]));
  };
};
WebSocketSession.prototype = {
  //绑定和注销事件
  on: function (event, callback) {
    return this.events[event].push(callback), this;
  },
  off: function (event, callback) {
    for (var o = this.events[event], i = 0; i < o.length; i++)
      if (o[i] === callback) o.splice(i, 1), i = o.length;
    return this;
  }
};