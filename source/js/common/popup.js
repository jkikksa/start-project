const ESC_KEY_CODE = 27;
const isEscPressed = (evt) => {
  return evt.keyCode === ESC_KEY_CODE;
};

const Popup = function (element, options) {
  this.element = element;
  this.visibleClass = options.visibleClass;
  this.openButtons = options.openButtons;
  this.closeButtons = options.closeButtons;
  this.noCloseButtons = typeof options.closeButtons === 'undefined' ? true : false;
  this.beforeClass = options.beforeClass || 'before';
  this.afterClass = options.afterClass || 'after';
  this.transitionTime = options.transitionTime || 200;
  this.isOpened = false;
  this.onOpen = options.onPopupOpen;
  this.onClose = options.onPopupClose;

  this._onEscPress = (evt) => {
    if (isEscPressed(evt)) {
      this._closePopup();
    }
  };

  this._onOpenButtonClick = (evt) => {
    evt.preventDefault();
    const clickedButton = evt.currentTarget;

    if (!this.isOpened) {
      this._openPopup(clickedButton);
    } else if (this.noCloseButtons) {
      this._closePopup();
    }
  };

  this._onCloseButtonClick = (evt) => {
    evt.preventDefault();

    if (this.isOpened) {
      this._closePopup();
    }
  };

  this._openPopup = (clickedButton) => {
    this.element.classList.add(this.beforeClass);

    setTimeout(() => {
      this.element.classList.remove(this.beforeClass);
    }, this.transitionTime);

    this.element.classList.add(this.visibleClass);
    document.addEventListener('keydown', this._onEscPress);
    this.isOpened = true;

    if (typeof this.onOpen === 'function') {
      this.onOpen(clickedButton);
    }
  };

  this._closePopup = () => {
    this.element.classList.add(this.afterClass);

    setTimeout(() => {
      this.element.classList.remove(this.visibleClass);
      this.element.classList.remove(this.afterClass);
    }, this.transitionTime);

    document.removeEventListener('keydown', this._onEscPress);
    this.isOpened = false;

    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  };
};

Popup.prototype.init = function () {
  Array.prototype.forEach.call(this.openButtons, (it) => {
    it.addEventListener('click', this._onOpenButtonClick);
  });

  if (!this.noCloseButtons) {
    Array.prototype.forEach.call(this.closeButtons, (it) => {
      it.addEventListener('click', this._onCloseButtonClick);
    });
  }
};

Popup.prototype.destroy = function () {
  this._closePopup();

  Array.prototype.forEach.call(this.openButtons, (it) => {
    it.removeEventListener('click', this._onOpenButtonClick);
  });

  if (!this.noCloseButtons) {
    Array.prototype.forEach.call(this.closeButtons, (it) => {
      it.removeEventListener('click', this._onCloseButtonClick);
    });
  }
};

Popup.prototype.open = function () {
  this._openPopup();
};

Popup.prototype.close = function () {
  this._closePopup();
};

module.exports = Popup;
