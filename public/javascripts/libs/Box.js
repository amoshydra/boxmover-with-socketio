

let Box = {
  BoxEntity: function BoxEntity(props) {
    if (props) {
      this.color = props.color;
      this.width = props.width;
      this.height = props.height;
      this.pos = {
        x: props.pos.x,
        y: props.pos.y
      };
    } else {
      this.color = 'red';
      this.width = 100;
      this.height = 100;
      this.pos = {
        x: 100,
        y: 100
      };
    }
  },
  render: function render(box, canvas) {
    let ctx = canvas.getContext("2d");
    let halfLength = box.width/2;

    ctx.fillStyle = box.color;
    ctx.fillRect(box.pos.x - halfLength, box.pos.y - halfLength, box.width, box.height);
  }
};

module.exports = Box;
