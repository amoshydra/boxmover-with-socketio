let _ = require('lodash');

let CanvasMouseListener = {
  onUnclick: null,
  onDrag: null,
  onClick: null,
  canvasPos: {
    left: 0,
    top: 0
  },
  mousePos: {
    x: 0,
    y: 0,
  },
  mouseStatus: {
    clicked: false,
    inCanvas: false
  },
  unclick: function unclick() {
    if (this.onUnclick) {
      this.onUnclick();
    }
  },
  click: function click(newX, newY) {
    this.mousePos.x = newX - this.canvasPos.left;
    this.mousePos.y = newY - this.canvasPos.top;
    if (this.onClick) {
      this.onClick(this.mousePos);
    }
  },
  drag: function drag(newX, newY) {
    this.mousePos.x = newX - this.canvasPos.left;
    this.mousePos.y = newY - this.canvasPos.top;
    if (this.onDrag) {
      this.onDrag(this.mousePos);
    }
  },
  init: function init(canvas) {
    this.canvasPos.left = canvas.offsetLeft;
    this.canvasPos.top = canvas.offsetTop;
    attachEventListener.bind(this, canvas)();
  }
}

const attachEventListener = function attachEventListener(canvas) {
  // Bind pointer events
  canvas.addEventListener('pointerenter', (event) => {
    this.mouseStatus.inCanvas = true;
    event.preventDefault();
  })

  canvas.addEventListener('pointerleave', (event) => {
    this.mouseStatus.inCanvas = false;
    this.mouseStatus.clicked = false;
    event.preventDefault();
  })

  canvas.addEventListener('pointerdown', (event) => {
    this.click(event.clientX, event.clientY);
    this.mouseStatus.clicked = true;
    event.preventDefault();
  });

  canvas.addEventListener('pointerup', (event) => {
    this.mouseStatus.clicked = false;
    this.unclick();
    event.preventDefault();
  });

  canvas.addEventListener('pointermove', _.throttle(mousemove.bind(this), 10));
}

const mousemove = function mousemove(event) {
  if (this.mouseStatus.clicked) {
    this.drag(event.clientX, event.clientY);
  }
}

module.exports = CanvasMouseListener;
