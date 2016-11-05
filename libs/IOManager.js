const app = require('../app');
const engine = require('socket.io');

const IOManager = function IOManager(server) {
  const io = engine(server);
  console.log('Socket.io is initialized');

  io.on('connection', function(socket) {
    console.log(`Connected: ${socket.client.conn.id}`);

    socket.on('newbox', function(box) {
      socket.broadcast.emit('newbox', box);
    })
  });

}

module.exports = IOManager;
