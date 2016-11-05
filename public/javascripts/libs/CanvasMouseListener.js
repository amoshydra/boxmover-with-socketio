const _ = require('lodash');

let CanvasMouseListener = {
  onChange: null,
  canvasPos: {
    left: 0,
    top: 0,
    x: 0,
    xPre: 0,
    y: 0,
    yPre: 0,
    mouse: 0,
    enter: 0,
  },
  set: function set(newX, newY) {
    this.canvasPos.xPre = this.canvasPos.x;
    this.canvasPos.yPre = this.canvasPos.y;
    this.canvasPos.x = newX - this.canvasPos.left;
    this.canvasPos.y = newY - this.canvasPos.top;
    if (this.onChange) {
      this.onChange(this.canvasPos);
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
    this.canvasPos.enter = 1;
    event.preventDefault();
  })

  canvas.addEventListener('mouseleave', (event) => {
    this.canvasPos.enter = 0;
    this.canvasPos.mouse = 0;
    event.preventDefault();
  })

  canvas.addEventListener('mousedown', (event) => {
    this.set(event.clientX, event.clientY);
    this.canvasPos.mouse = 1;
    event.preventDefault();
  });

  canvas.addEventListener('mouseup', (event) => {
    this.canvasPos.mouse = 0;
    event.preventDefault();
  });

  canvas.addEventListener('mousemove', _.throttle(mousemove.bind(this), 10));
}

const mousemove = function mousemove(event) {
  if (this.canvasPos.mouse) {
    this.set(event.clientX, event.clientY);
  }
}

module.exports = CanvasMouseListener;
