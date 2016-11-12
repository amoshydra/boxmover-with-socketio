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
let cursor = {
  index: -1,
  offset: {
    x: 0,
    y: 0
  }
}

CanvasMouse.onDrag = function(mousePos) {
  if (cursor.index != -1) {
    boxArray_GLOBAL[cursor.index].pos.x = mousePos.x + cursor.offset.x;
    boxArray_GLOBAL[cursor.index].pos.y = mousePos.y + cursor.offset.y;
    socket.emit('modify-box', boxArray_GLOBAL[cursor.index], cursor.index);
    renderBoxes(boxArray_GLOBAL, canvas);
  }
};

CanvasMouse.onClick = function pickUpBox(mousePos) {
  cursor.index = findBoxIndex(mousePos, boxArray_GLOBAL);

  if (cursor.index >= 0) {
    //find offset from center
    cursor.offset.x = boxArray_GLOBAL[cursor.index].pos.x - mousePos.x;
    cursor.offset.y = boxArray_GLOBAL[cursor.index].pos.y - mousePos.y;

    socket.emit('occupy-box', cursor.index);
    boxArray_GLOBAL[cursor.index].isOccupied = true;
  }
};

CanvasMouse.onUnclick = function giveUpBox() {
  if (boxArray_GLOBAL[cursor.index]) {
    socket.emit('free-box', cursor.index);
    boxArray_GLOBAL[cursor.index].isOccupied = false;
  }
  cursor.index = -1;
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
    if (boxIndex == cursor.index) cursor.index = -1;
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
