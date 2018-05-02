/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const net = require('net'), WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', crypto = require('crypto'),
  port = process.env.PORT || 8085;
let state = 0, stream = new Buffer(0);

const server = net.createServer(function (socket) {
  let isClosed = false;
  socket
    .on('open', () => {
      console.log('open');
    })
    .on('data', data => {
      // console.log('body: ' + data.toString() + '\r\n');
      if (state === 0) {
        const header = parseHead(data.toString());
        const key = header.headers['sec-websocket-key'];
        const acceptKey = crypto.createHash('sha1').update(key + WS).digest('base64');
        socket.write([
          'HTTP/1.1 101 SWitching Protocols',
          'Upgrade: websocket',
          'Connection: Upgrade',
          'Sec-WebSocket-Accept: ' + acceptKey
        ].join('\r\n') + '\r\n\r\n');
        state = 1;
      } else {
        stream = Buffer.concat([stream, data]);
        const body = readF(stream);
        console.log('body: ' + JSON.stringify(body));
        console.log('data: ' + body.data.toString());
        console.log('\r\n\r\n\r\n');
        stream = stream.slice(stream.length);
        if (body.opcode === 8) {
          state = 0;
          isClosed = true;
        }
      }
    })
    .on('error', e => console.log(e))
    .on('close', () => {
      console.log('close');
      state = 0;
      isClosed = true;
    });
  setInterval(() => {
    if (!isClosed) writeF(socket, 1, new Date().getTime().toString());
  }, 2000)
}).listen(port, function () {
  console.info('--------------Listening on port %d--------------', this.address().port);
}).on('error', function (e) {
  console.error(e);
});

function readF(stream) {
  let fin, opcode, size, mask, data;
  fin = stream[0] >> 7;
  opcode = stream[0] & 127;
  size = stream[1] & 127;
  let index = 2;
  if (size === 126) {
    size = stream.readUInt16BE(index);
    index += 2;
  } else if (size === 127) {
    size = stream.readDoubleBE(index);
    index += 8;
  }
  mask = stream.slice(index, index + 4);
  index += 4;
  data = new Buffer(size);
  if (stream.length < index + size) throw {name: 'ClientDataError', msg: 'Client data error!'};
  for (let i = 0; i < size; i++) {
    data[i] = stream[index + i] ^ mask[i % 4];
  }
  return {opcode, data, size, fin, mask}
}

function writeF(socket, opcode, data) {
  const payloadData = new Buffer(data), size = payloadData.length;
  const fin = 1;
  const mask = 0; // 发送信息不使用掩码
  let payloadLen = null, payloadLength = null;
  if (size > 0xFFFF) {
    payloadLen = new Buffer([(mask << 7) + 127]);
    payloadLength = Buffer.alloc(8);
    payloadLength.writeDoubleBE(size, 0);
  } else if (size > 125) {
    payloadLen = new Buffer([(mask << 7) + 126]);
    payloadLength = Buffer.alloc(2);
    payloadLength.writeDoubleBE(size, 0);
  } else {
    payloadLen = new Buffer([(mask << 7) + size]);
  }
  socket.write(Buffer.concat([new Buffer([(fin << 7) + (+opcode)]), payloadLen, payloadLength || Buffer.from([]), payloadData]))
}

function parseHead(raw_head) {
  const raw = raw_head.split('\r\n');
  const headers = {};
  const err = function () {
    throw {name: 'WrongRequestError', message: 'Invalid request headers!'};
  };

  // 请求首行
  const request_line = raw.shift().split(' '),
    method = request_line[0], path = request_line[1];
  if (request_line.length !== 3 && method !== 'GET') {
    err();
  }

  raw.pop();
  if (raw.pop() !== '' || !raw.length) {
    err();
  }

  const re = /(^[^:]+)(:\s)(.*)$/;
  raw.forEach(function (line, i) {
    const m = line.match(re);
    if (m.length !== 4 || !m[1]) err();
    headers[m[1].toLowerCase()] = m[3];
  });

  const is_nil = function (s) {
    return !s;
  };

  if ([headers.host, headers.origin].some(is_nil)) {
    err();
  }

  return {
    headers: headers,
    url: path
  }
}
