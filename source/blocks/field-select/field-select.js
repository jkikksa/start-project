let customSelect = require('custom-select').default;
let nativeSelects = document.querySelectorAll('.field-select');
const isMobile = require('ismobilejs');


if (nativeSelects.length !== 0) {

  Array.prototype.forEach.call(nativeSelects, function (it) {
    it.classList.remove('field-select--no-js');

    if (!isMobile.phone && !isMobile.tablet) {
      it.classList.add('field-select--no-touch');
    }
  });

  if (!isMobile.phone && !isMobile.tablet) {
    customSelect('.field-select__select', {
      containerClass: 'field-select__custom',
      openerClass: 'field-select__custom-select',
      panelClass: 'field-select__custom-list',
      optionClass: 'field-select__custom-option',
      optgroupClass: 'custom-select-optgroup',
      isSelectedClass: 'is-selected',
      hasFocusClass: 'has-focus',
      isDisabledClass: 'is-disabled',
      isOpenClass: 'field-select__custom--opened'
    });
  }
}
