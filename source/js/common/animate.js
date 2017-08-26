module.exports = function (options) {

  let start = performance.now();

  requestAnimationFrame(function animateIt(time) {
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) {
      timeFraction = 1;
    }

    let progress = options.timing(timeFraction);

    options.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animateIt);
    }

  });
};
