const DEFAULT_TIMEOUT = 10000;
const DEFAULT_METHOD = `post`;
const DEFAULT_RESPONSE_TYPE = ``;

const HTTPCodeToError = {
  400: `Неверный запрос`,
  401: `Требуется аутентификация`,
  404: `Адрес не найден`,
  500: `Ошибка сервера`
};

export default (options) => {
  const url = options.url;
  const method = options.method || DEFAULT_METHOD;
  const responseType = options.responseType || DEFAULT_RESPONSE_TYPE;
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const data = options.data;
  const onSuccess = options.onSuccess;
  const onError = options.onError;
  const header = options.header;
  const headerValue = options.headerValue;

  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.open(method, url);

  if (typeof header !== `undefined` && typeof headerValue !== `undefined`) {
    xhr.setRequestHeader(header, headerValue);
  }

  xhr.timeout = timeout;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === 200) {
      onSuccess(xhr.response);
    } else {
      onError(HTTPCodeToError[xhr.status] || `Неизвестная ошибка`);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Превышено время ожидания`);
  });

  xhr.send(data);
};
