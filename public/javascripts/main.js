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
  socket.emit('modify-box', boxArray_GLOBAL[specialIndex], specialIndex);
  renderBoxes(boxArray_GLOBAL, canvas);
};
CanvasMouse.onClick = function(mousePos) {
  specialIndex = findBoxIndex(mousePos, boxArray_GLOBAL);
  if (specialIndex >= 0) pickUpBox();
};
CanvasMouse.onUnclick = function() {
  giveUpBox();
}

function pickUpBox() {
  socket.emit('occupy-box', specialIndex);
  boxArray_GLOBAL[specialIndex].isOccupied = true;
}

function giveUpBox() {
  if (boxArray_GLOBAL[specialIndex]) {
    socket.emit('free-box', specialIndex);
    boxArray_GLOBAL[specialIndex].isOccupied = false;
  }
  specialIndex = -1;
}

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


socket.on('connect', function() {
  socket.emit('new-player', socket.id);

  socket.on('receive-boxes', function(boxes, playerId) {
    if (socket.id === playerId) {
      boxArray_GLOBAL = boxes;
      renderBoxes(boxArray_GLOBAL, canvas);
    }
  });

  socket.on('modify-box', function(newBox, boxIndex) {
    boxArray_GLOBAL[boxIndex] = newBox;
    renderBoxes(boxArray_GLOBAL, canvas);
    if (boxIndex == specialIndex) specialIndex = -1;
  });
  socket.on('add-box', function(newBox) {
    boxArray_GLOBAL.push(newBox);
    renderBoxes(boxArray_GLOBAL, canvas);
  });
  socket.on('del-box', function() {
    boxArray_GLOBAL.pop();
    renderBoxes(boxArray_GLOBAL, canvas);
  });

  socket.on('occupy-box', function(boxIndex) {
    boxArray_GLOBAL[boxIndex].isOccupied = true;
  });
  socket.on('free-box', function(boxIndex) {
    boxArray_GLOBAL[boxIndex].isOccupied = false;
  });
});

function renderBoxes(boxes, canvas) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i])
      Box.render(boxes[i], canvas);
  }
}
