const isEscPressed = require('./common/is-esc-pressed');

document.addEventListener('keydown', (evt) => {
  if (isEscPressed(evt)) {
    console.log('Esc Pressed!');
  }
});
