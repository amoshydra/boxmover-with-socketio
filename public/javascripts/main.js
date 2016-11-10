let io = require('socket.io-client');
let CanvasMouse = require('./libs/CanvasMouseListener');
let Box = require('./libs/Box');

// Socket io
// let hostPath = 'http://localhost:3000';
let socket = io();

// Setting up canvas
let canvas = document.getElementById('canvas');
CanvasMouse.init(canvas);
let ctx = canvas.getContext("2d");

// -- Initialise boxes
let boxArray_GLOBAL = [];

// Setting up Control
let btnAdd = document.getElementById('add');
let btnDel = document.getElementById('del');
btnAdd.addEventListener("click", addBox);
btnDel.addEventListener("click", delBox);

function addBox() {
  let newBox = new Box.BoxEntity();
  boxArray_GLOBAL.push(newBox);
  socket.emit('add-box', newBox);
  renderBoxes(boxArray_GLOBAL, canvas);
}
function delBox() {
  boxArray_GLOBAL.pop();
  socket.emit('del-box');
  renderBoxes(boxArray_GLOBAL, canvas);
}

// Creating object in canvas
boxArray_GLOBAL.push(new Box.BoxEntity({
  color: 'orange',
  height: 100,
  width: 100,
  pos: {
    x: 100,
    y: 100
  }
}));

// -- Exit loading screen
let loadingModal = document.getElementById('loading-modal');
loadingModal.parentNode.removeChild(loadingModal);

// -- Render boxes
renderBoxes(boxArray_GLOBAL, canvas);

// -- Control boxes
let specialIndex = -1;

CanvasMouse.onDrag = function(mousePos) {
  if (specialIndex != -1) {
    boxArray_GLOBAL[specialIndex].pos.x = mousePos.x;
    boxArray_GLOBAL[specialIndex].pos.y = mousePos.y;
  }
  renderBoxes(boxArray_GLOBAL, canvas);
  socket.emit('modify-box', boxArray_GLOBAL[specialIndex], specialIndex);
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
  specialIndex = findBoxIndex(mousePos, boxArray_GLOBAL);
};
CanvasMouse.onUnclick = function() {
  specialIndex = -1;
}

socket.on('connect', function() {
  socket.emit('new-player', socket.id);

  socket.on('request-boxes', function(playerId) {
    if (socket.id !== playerId) {
      console.log('sending', boxArray_GLOBAL, 'to ' + playerId);
      socket.emit('send-boxes', boxArray_GLOBAL, playerId);
    }
  });

  socket.on('receive-boxes', function(boxes, playerId) {
    if (socket.id === playerId) {
      console.log('receiving', boxes, 'from ' + playerId);
      boxArray_GLOBAL = boxes;
      renderBoxes(boxArray_GLOBAL, canvas);
    }
  });

  socket.on('modify-box', function(newBox, boxIndex) {
    boxArray_GLOBAL[boxIndex] = newBox;
    renderBoxes(boxArray_GLOBAL, canvas);
  });

  socket.on('add-box', function(newBox) {
    boxArray_GLOBAL.push(newBox);
    renderBoxes(boxArray_GLOBAL, canvas);
  });
  socket.on('del-box', function() {
    boxArray_GLOBAL.pop();
    renderBoxes(boxArray_GLOBAL, canvas);
  });
});



function renderBoxes(boxes, canvas) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boxes.length; i++) {
    Box.render(boxes[i], canvas);
  }
}
