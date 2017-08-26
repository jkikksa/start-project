'use strict';

module.exports = {
  parser: require('postcss-scss'),
  plugins: [
    require('postcss-sorting')(require('./.postcss-sorting.json'))
  ]
};
