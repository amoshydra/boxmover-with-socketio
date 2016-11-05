var hostPath = 'http://localhost:3000';
var io = require('socket.io-client');
var CanvasMouse = require('./libs/CanvasMouseListener');
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

ctx.fillStyle = "green";
ctx.fillRect(CanvasMouse.canvasPos.x, CanvasMouse.canvasPos.y, 100, 100);

CanvasMouse.onChange = function(canvasPos) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(canvasPos.x - 50, canvasPos.y - 50, 100, 100);
};
