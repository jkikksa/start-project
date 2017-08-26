const animate = require('./animate');
const timingFunctions = require('./timing-functions');

module.exports = function () {
  let distance = window.pageYOffset;
  let animateOptions = {
    duration: 500,
    timing: timingFunctions.quadEaseInOut,
    draw: (progress) => window.scrollTo(0, distance - progress * distance)
  };
  animate(animateOptions);
};
