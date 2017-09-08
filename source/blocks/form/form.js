const Validate = require('../../js/common/validate');
const send = require('../../js/common/send');
const form = document.querySelector('.form__form');
const formThanks = document.querySelector('.form__thanks');
const thanksButton = formThanks.querySelector('.form__button');
const myValidate = new Validate(form);

myValidate.init();

thanksButton.addEventListener('click', () => {
  formThanks.classList.remove('form__thanks--visible');
});

const onSuccess = () => {
  formThanks.classList.add('form__thanks--visible');
};

const onError = (msg) => {
  formThanks.classList.add('form__thanks--visible');
  const message = document.querySelector('.form__thanks-message');
  message.textContent = 'Произошла ошибка: ' + msg;
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (myValidate.checkValidity().isValid) {
    send({
      url: form.action,
      method: form.method,
      data: new FormData(form),
      onSuccess,
      onError
    });
  }
});
