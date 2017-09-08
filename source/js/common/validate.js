const typeToClassName = {
  'text': 'field-text',
  'tel': 'field-text',
  'email': 'field-text',
  'checkbox': 'field-checkbox'
};

const MESSAGE_CLASSNAME = '__error-message';
const INPUT_CLASSNAME = '__input';

const Modifier = {
  ERROR: '--error',
  FILLED: '--fill',
};

// если есть ошибка кастомной валидации, то браузерная считается true
const isValid = (field) => {
  return field.validity.customError === true ? true : field.validity.valid;
};

// кастомная валидация. устанавливает сообщение ошибки.
const isTextValid = function (field) {
  if (field.value.trim().split(' ').length !== 3) {
    field.setCustomValidity('Введите ровно 3 слова. Введено: ' + field.value.trim().split(' ').length);
    return false;
  }
  field.setCustomValidity('');
  return true;
};

// проверка поля на валидность. если есть кастомная функция валидации, то после вызывается она
const isFieldValid = (field) => {
  if (field.type === 'text') {
    return isValid(field) && isTextValid(field);
  }
  return isValid(field);
};

const getParent = (field) => {
  return field.closest('.' + typeToClassName[field.type]);
};

const showMessage = (field) => {
  const messageContainer = getParent(field).querySelector('.' + typeToClassName[field.type] + MESSAGE_CLASSNAME);
  messageContainer.innerHTML = getErrorMessage(field);
};

const removeMessage = (field) => {
  const messageContainer = getParent(field).querySelector('.' + typeToClassName[field.type] + MESSAGE_CLASSNAME);
  messageContainer.innerHTML = '';
};

const toggleClass = (element, classname, force) => {
  if (element !== null) {
    element.classList.toggle(classname, force);
  }
};

const showError = (field) => {
  toggleClass(getParent(field), typeToClassName[field.type] + Modifier.ERROR, true);
};

const removeError = (field) => {
  toggleClass(getParent(field), typeToClassName[field.type] + Modifier.ERROR, false);
};

const toggleFillClass = (field) => {
  toggleClass(getParent(field), typeToClassName[field.type] + Modifier.FILLED, field.value.length > 0);
};

const onFieldChange = (evt) => {
  if (!evt.target.classList.contains(typeToClassName[evt.target.type] + INPUT_CLASSNAME)) {
    return;
  }

  if (!isFieldValid(evt.target)) {
    showError(evt.target);
    showMessage(evt.target);
    toggleFillClass(evt.target);
  } else {
    removeError(evt.target);
    removeMessage(evt.target);
  }
};

const errorToMessages = {
  'valueMissing': {
    'text': 'Заполните текстовое поле',
    'email': 'Заполните поле email',
    'tel': 'Заполните поле для телефона',
    'checkbox': 'Готовым быть обязательно!'
  },
  'patternMismatch': 'Пример: +7(999)999-99-99',
  'typeMismatch': 'Пример: hello@gmail.com'
};

const getErrorMessage = (field) => {
  let message = '';

  const val = field.validity;
  // если есть кастомная ошибки, то в сообщении возвращается текст этой кастомной ошибки
  if (val.customError) {
    return field.validationMessage;
  }
  // по ключу ошибки сопоставляется текстовое сообщение этой ошибки в зависимости от типа поля.
  for (const key in val) {
    if (val[key]) {
      message = (errorToMessages[key][field.type]) || errorToMessages[key];
    }
  }

  return message;
};

const Validate = function (form) {
  this.form = form;
};

Validate.prototype.init = function () {
  this.form.setAttribute('novalidate', true);
  this.form.addEventListener('change', onFieldChange, true);
};

Validate.prototype.checkValidity = function () {
  const fields = this.form.querySelectorAll('input:not([type="submit"])');
  let valid = true;
  let errorFields = [];

  Array.prototype.forEach.call(fields, (it) => {
    if (!isFieldValid(it)) {
      valid = false;
      showError(it);
      showMessage(it);
      errorFields.push(it);
    } else {
      removeError(it);
      removeMessage(it);
    }
  });

  // ставит фокус в первое невалидное поле
  if (errorFields.length > 0) {
    errorFields[0].focus();
  }

  return {
    isValid: valid,
  };
};

module.exports = Validate;
