const app = require('../app');
const engine = require('socket.io');

const IOManager = function IOManager(server) {
  const io = engine(server);
  io.engine.ws = new (require('uws').Server)({
    noServer: true,
    perMessageDeflate: false
  });

  console.log('Socket.io is initialized');

  io.on('connection', function(socket) {
    console.log(`Connected: ${socket.client.conn.id}`);

    socket.on('modify-box', function(newBoxObj, newBoxIndex) {
      socket.broadcast.emit('modify-box', newBoxObj, newBoxIndex);
    })

    socket.on('add-box', function(newBoxObj) {
      socket.broadcast.emit('add-box', newBoxObj);
    })

    socket.on('del-box', function() {
      socket.broadcast.emit('del-box');
    })
  });

}

module.exports = IOManager;
