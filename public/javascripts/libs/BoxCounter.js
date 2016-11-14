
function manipulateDom(ele, currentCount) {
  if (currentCount == 0) {
    ele.innerText = 'Let\'s add a box';
  } else if (currentCount == 1) {
    ele.innerText = 'Let\'s move the box';
  } else {
    ele.innerText = `We have ${currentCount} boxes`;
  }
}

let BoxCounter = {
  counter: 0,
  headerDom: null,
  init: function init(initialLength, domId) {
    this.counter = initialLength;
    this.headerDom = document.getElementById(domId);
    manipulateDom(this.headerDom, this.counter);
  },
  cng: function cng(currentLength) {
    this.counter = currentLength;
    manipulateDom(this.headerDom, this.counter);
  }
}

module.exports = BoxCounter;
