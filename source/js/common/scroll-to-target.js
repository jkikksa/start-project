const animate = require('./animate');
const timingFunctions = require('./timing-functions');
const TECHNICAL_OFFSET = 2;

module.exports = function (target, offset) {
  const offsetY = offset || 0;
  const startCoords = window.pageYOffset;
  const targetCoords = target.getBoundingClientRect().top - offsetY + TECHNICAL_OFFSET;

  const animateOptions = {
    duration: 500,
    timing: timingFunctions.quadEaseInOut,
    draw(progress) {
      window.scrollTo(0, startCoords + progress * targetCoords);
    }
  };
  animate(animateOptions);
};
