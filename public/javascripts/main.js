var io = require('socket.io-client');
var CanvasMouse = require('./libs/CanvasMouseListener');

// Socket io
var hostPath = 'http://localhost:3000';
var socket = io(hostPath);

// Setting up canvas
var canvas = document.createElement('canvas');
canvas.id     = "canvas";
canvas.width  = 400;
canvas.height = 400;
canvas.style.zIndex   = 8;
canvas.style.position = "absolute";
canvas.style.border   = "1px solid";

document.body.appendChild(canvas);
CanvasMouse.init(canvas);
var ctx = canvas.getContext("2d");


// Box
let box = {
  color: 'green',
  width: 100,
  height: 100,
  pos: {
    x: 100,
    y: 100
  },
  render: function renderBox(canvas) {
    let ctx = canvas.getContext("2d");
    let halfLength = this.width/2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x - halfLength, this.pos.y - halfLength, this.width, box.height);
  }
}

function renderBox(box, canvas) {
  let ctx = canvas.getContext("2d");
  let halfLength = box.width/2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = box.color;
  ctx.fillRect(box.pos.x - halfLength, box.pos.y - halfLength, box.width, box.height);
}

box.render(canvas);
socket.emit('newbox', box);

CanvasMouse.onChange = function(mousePos) {
  box.pos = mousePos;
  socket.emit('newbox', box);
  box.render(canvas);
};

socket.on('newbox', function(newbox) {
  renderBox(newbox, canvas);
});
