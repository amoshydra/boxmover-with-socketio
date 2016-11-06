let io = require('socket.io-client');
let CanvasMouse = require('./libs/CanvasMouseListener');
let Box = require('./libs/Box');

// Socket io
let hostPath = 'http://localhost:3000';
let socket = io(hostPath);

// Setting up canvas
let canvas = document.createElement('canvas');
canvas.id     = "canvas";
canvas.width  = 400;
canvas.height = 400;
canvas.style.zIndex   = 8;
canvas.style.position = "absolute";
canvas.style.border   = "1px solid";

document.body.appendChild(canvas);
CanvasMouse.init(canvas);
let ctx = canvas.getContext("2d");


// Creating object in canvas

// -- Initialise boxes
let boxArray = [];
boxArray.push(new Box.BoxEntity());
boxArray.push(new Box.BoxEntity({
  color: 'blue',
  height: 20,
  width: 20,
  pos: {
    x: 45,
    y: 45
  }
}));

// -- Render boxes
renderBoxes(boxArray, canvas);

// -- Control boxes
let specialIndex = -1;

CanvasMouse.onDrag = function(mousePos) {
  if (specialIndex != -1) {
    boxArray[specialIndex].pos.x = mousePos.x;
    boxArray[specialIndex].pos.y = mousePos.y;
  }
  renderBoxes(boxArray, canvas);
  socket.emit('newbox', boxArray);
};

function isWithinBox(mouseRaw, box) {
  let mouseX = mouseRaw.x + (box.width / 2);
  let mouseY = mouseRaw.y + (box.height/ 2);

  return (box.pos.x <= mouseX) &&
         (mouseX <= (box.width + box.pos.x)) &&
         (box.pos.y <= mouseY) &&
         (mouseY <= (box.height + box.pos.y));
}

function findBoxIndex(mouse, boxes) {
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (isWithinBox(mouse, boxes[i])) return i;
  }
  return -1;
}

CanvasMouse.onClick = function(mousePos) {
  specialIndex = findBoxIndex(mousePos, boxArray);
};
CanvasMouse.onUnclick = function() {
  specialIndex = -1;
}

socket.on('newbox', function(newBoxArray) {
  boxArray = newBoxArray;
  renderBoxes(boxArray, canvas);
});

function renderBoxes(boxes, canvas) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boxes.length; i++) {
    Box.render(boxes[i], canvas);
  }
}
