
let Physics = {
  pushForce: 0.2,
  onCollisde: null,
  resolveCollision: function resolveCollision(affectorIndex, boxesArray) {
    for (let victimIndex = 0; victimIndex < boxesArray.length; victimIndex++) {
      if (victimIndex == affectorIndex || !boxesArray[victimIndex]) continue;

      let checkBox = boxesArray[victimIndex];
      let dragBox = boxesArray[affectorIndex];

      if (checkBox.pos.x < dragBox.pos.x + dragBox.width &&
          checkBox.pos.x + checkBox.width > dragBox.pos.x &&
          checkBox.pos.y < dragBox.pos.y + dragBox.height &&
          checkBox.pos.y + checkBox.height > dragBox.pos.y) {

          // Emit collide callback
          if (this.onCollide) {
            this.onCollide(victimIndex)
          }

          let dragCenX = dragBox.pos.x + dragBox.width/2;
          let dragCenY = dragBox.pos.y + dragBox.height/2;
          let checkCenX = checkBox.pos.x + checkBox.width/2;
          let checkCenY = checkBox.pos.y + checkBox.height/2;

          let radian = Math.atan2(dragCenY - checkCenY, dragCenX - checkCenX);
          let directionDeg = radian * 180 / Math.PI;
          let boxDeg = Math.atan2(checkBox.height + dragBox.height, checkBox.width + dragBox.width) * 180 / Math.PI;

          if ((-180 < directionDeg && directionDeg <= (-(180 - boxDeg))) ||
             ((180 - boxDeg) < directionDeg && (directionDeg <= 180)))
            boxesArray[victimIndex].pos.x = dragBox.pos.x + (dragBox.width + this.pushForce);
          else if (-boxDeg < directionDeg && directionDeg <= boxDeg)
            boxesArray[victimIndex].pos.x = dragBox.pos.x - (checkBox.width + this.pushForce);
          else if (boxDeg < directionDeg && directionDeg <= 180 - boxDeg)
            boxesArray[victimIndex].pos.y = dragBox.pos.y - (checkBox.height + this.pushForce);
          else
            boxesArray[victimIndex].pos.y = dragBox.pos.y + (dragBox.height + this.pushForce);

          this.resolveCollision(victimIndex, boxesArray);
      }
    }
  }
}

module.exports = Physics;
