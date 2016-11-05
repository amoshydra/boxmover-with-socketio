const _ = require('lodash');

let CanvasMouseListener = {
  onChange: null,
  canvasPos: {
    left: 0,
    top: 0
  },
  mousePos: {
    x: 0,
    xPre: 0,
    y: 0,
    yPre: 0
  },
  mouseStatus: {
    clicked: false,
    inCanvas: false
  },
  set: function set(newX, newY) {
    this.mousePos.xPre = this.mousePos.x;
    this.mousePos.yPre = this.mousePos.y;
    this.mousePos.x = newX - this.canvasPos.left;
    this.mousePos.y = newY - this.canvasPos.top;
    if (this.onChange) {
      this.onChange(this.mousePos);
    }
  },
  init: function init(canvas) {
    this.canvasPos.left = canvas.offsetLeft;
    this.canvasPos.top = canvas.offsetTop;
    attachEventListener.bind(this, canvas)();
  }
}

const attachEventListener = function attachEventListener(canvas) {
  // Bind mouse events
  canvas.addEventListener('mouseenter', (event) => {
    this.mouseStatus.inCanvas = true;
    event.preventDefault();
  })

  canvas.addEventListener('mouseleave', (event) => {
    this.mouseStatus.inCanvas = false;
    this.mouseStatus.clicked = false;
    event.preventDefault();
  })

  canvas.addEventListener('mousedown', (event) => {
    this.set(event.clientX, event.clientY);
    this.mouseStatus.clicked = true;
    event.preventDefault();
  });

  canvas.addEventListener('mouseup', (event) => {
    this.mouseStatus.clicked = false;
    event.preventDefault();
  });

  canvas.addEventListener("touchmove", _.throttle(touchmove.bind(this), 10));
  canvas.addEventListener('mousemove', _.throttle(mousemove.bind(this), 10));
}

const mousemove = function mousemove(event) {
  if (this.mouseStatus.clicked) {
    this.set(event.clientX, event.clientY);
  }
}

const touchmove = function touchmove(event) {
  let newEvent = event.changedTouches[0];
  this.set(newEvent.clientX, newEvent.clientY);
}

module.exports = CanvasMouseListener;
