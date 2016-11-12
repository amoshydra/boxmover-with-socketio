const app = require('../app');
const engine = require('socket.io');

const IOManager = function IOManager(server) {
  const io = engine(server);
  io.engine.ws = new (require('uws').Server)({
    noServer: true,
    perMessageDeflate: false
  });

  console.log('Socket.io is initialized');
  let boxArrayServer = [];
  let config = {
    collision: true
  };

  io.on('connection', function(socket) {

    socket.on('new-player', function(newPlayerId) {
      console.log();
      console.log(`  > ${socket.client.conn.id} just joined the game. ${socket.handshake.address}`);
      socket.emit('receive-boxes', boxArrayServer, config, newPlayerId);
    });

    socket.on('modify-box', function(newBoxObj, newBoxIndex) {
      boxArrayServer[newBoxIndex] = newBoxObj;
      socket.broadcast.emit('modify-box', newBoxObj, newBoxIndex);
    });

    socket.on('add-box', function(newBoxObj) {
      boxArrayServer.push(newBoxObj);
      socket.broadcast.emit('add-box', newBoxObj);
    });

    socket.on('del-box', function() {
      boxArrayServer.pop();
      socket.broadcast.emit('del-box');
    });

    socket.on('occupy-box', function(index) {
      socket.broadcast.emit('occupy-box', index);
    });

    socket.on('free-box', function(index) {
      socket.broadcast.emit('free-box', index);
    });

    socket.on('toggle-collision', function() {
      config.collision = !config.collision;
      socket.broadcast.emit('set-config', config);
    })
  });

}

module.exports = IOManager;
