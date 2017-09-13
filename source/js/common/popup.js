const ESC_KEY_CODE = 27;
const isEscPressed = (evt) => {
  return evt.keyCode === ESC_KEY_CODE;
};

const Popup = function (element, options) {
  this.element = element;
  this.visibleClass = options.visibleClass;
  this.openButtons = options.openButtons;
  this.closeButtons = options.closeButtons;
  this.onOpen = options.onPopupOpen;
  this.onClose = options.onPopupClose;
  this.isOpened = false;

  this._onEscPress = (evt) => {
    if (isEscPressed(evt)) {
      this._closePopup();
    }
  };

  this._onFreaAreaClicked = (evt) => {
    Array.prototype.forEach.call(this.openButtons, (it) => {
      if (!it.contains(evt.target) && !this.element.contains(evt.target)) {
        evt.preventDefault();
        this._closePopup();
      }
    });
  };

  this._onOpenButtonClick = () => {
    if (!this.isOpened) {
      this._openPopup();
    }
  };

  this._onCloseButtonClick = () => {
    if (this.isOpened) {
      this._closePopup();
    }
  };

  this._openPopup = () => {
    this.element.classList.add(this.visibleClass);
    document.addEventListener('keydown', this._onEscPress);
    document.addEventListener('click', this._onFreaAreaClicked);
    this.isOpened = true;

    if (typeof this.onOpen === 'function') {
      this.onOpen();
    }
  };

  this._closePopup = () => {
    this.element.classList.remove(this.visibleClass);
    document.removeEventListener('keydown', this._onEscPress);
    document.removeEventListener('click', this._onFreaAreaClicked);
    this.isOpened = false;

    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  };
};

Popup.prototype.init = function () {
  if (typeof this.openButtons.length !== 'undefined') {
    Array.prototype.forEach.call(this.openButtons, (it) => {
      it.addEventListener('click', this._onOpenButtonClick);
    });
  } else {
    this.openButtons.addEventListener('click', this._onOpenButtonClick);
  }

  if (typeof this.closeButtons.length !== 'undefined') {
    Array.prototype.forEach.call(this.closeButtons, (it) => {
      it.addEventListener('click', this._onCloseButtonClick);
    });
  } else {
    this.closeButtons.addEventListener('click', this._onCloseButtonClick);
  }
};

Popup.prototype.destroy = function () {
  this._closePopup();

  if (typeof this.openButtons.length !== 'undefined') {
    Array.prototype.forEach.call(this.openButtons, (it) => {
      it.removeEventListener('click', this._onOpenButtonClick);
    });
  } else {
    this.openButtons.removeEventListener('click', this._onOpenButtonClick);
  }

  if (typeof this.closeButtons.length !== 'undefined') {
    Array.prototype.forEach.call(this.closeButtons, (it) => {
      it.removeEventListener('click', this._onCloseButtonClick);
    });
  } else {
    this.closeButtons.removeEventListener('click', this._onCloseButtonClick);
  }
};

Popup.prototype.open = function () {
  this._openPopup();
};

Popup.prototype.close = function () {
  this._closePopup();
};

module.exports = Popup;
