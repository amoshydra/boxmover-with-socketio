

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
      this.color = getRandomColor();
      this.width = Math.floor((Math.random() * 60) + 40);
      this.height = Math.floor((Math.random() * 60) + 40);
      this.pos = {
        x: Math.floor((Math.random() * 120) + 40),
        y: Math.floor((Math.random() * 120) + 40)
      };
    }
  },
  render: function render(box, canvas) {
    let ctx = canvas.getContext("2d");

    let posX = box.pos.x - box.width/2;
    let poxY = box.pos.y - box.height/2

    ctx.fillStyle = box.color;
    ctx.fillRect(posX, poxY, box.width, box.height);
  }
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = Box;
