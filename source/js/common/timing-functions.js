const makeEaseInOut = (timing) => {
  return function (timeFraction) {
    if (timeFraction < 0.5) {
      return timing(2 * timeFraction) / 2;
    } else {
      return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
  };
};

const quad = (progress) => Math.pow(progress, 2);

module.exports = {
  quad,
  quadEaseInOut: makeEaseInOut(quad)
};
