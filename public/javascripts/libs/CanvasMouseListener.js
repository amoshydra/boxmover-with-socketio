

var CanvasMouseListener = {
  canvasPos: {
    left: 0,
    top: 0,
    x: 0,
    xPre: 0,
    y: 0,
    yPre: 0,
    mouse: 0,
    set: function(newX, newY) {
      this.xPre = this.x;
      this.yPre = this.y;
      this.x = newX - this.left;
      this.y = newY - this.top;
    }
  },
  init: function init(canvas) {
    var self = this;

    self.canvasPos.left = canvas.offsetLeft;
    self.canvasPos.top = canvas.offsetTop;

    // Bind mouse events
    canvas.addEventListener('mousedown', function(e) {
      self.canvasPos.set(e.clientX, e.clientY);
      self.canvasPos.mouse = 1;
      e.preventDefault();
    });

    canvas.addEventListener('mouseup', function(e) {
      self.canvasPos.set(e.clientX, e.clientY);
      self.canvasPos.mouse = 0;
      e.preventDefault();
    });

    canvas.addEventListener('mousemove', function(e) {
      if (self.canvasPos.mouse)
        console.log('Dragging', e.clientX - self.canvasPos.left, e.clientY - self.canvasPos.top);
    });
  }
}

module.exports = CanvasMouseListener;
