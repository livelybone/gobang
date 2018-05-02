/**
 * Created by Livelybone on 2017-12-17.
 * Node Server
 */

const io = require('socket.io')(8085);

io.on('connection', (socket) => {
  io.emit('this', {will: 'be received by everyone'});

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });

  socket.on('client-event', (...args) => {
    console.log(args[0]);
  })
});

