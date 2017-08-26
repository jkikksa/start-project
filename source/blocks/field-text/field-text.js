const Inputmask = require('inputmask');
const telFields = document.querySelectorAll('.field-text__input[type="tel"]');

if (telFields.length > 0) {
  const myInputMask = new Inputmask('+7 999 999 99 99', {showMaskOnHover: false});
  myInputMask.mask(telFields);
}
