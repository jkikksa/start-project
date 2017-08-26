const ESC_KEY_CODE = 27;

let isEscPressed = function (evt) {
  return evt.keyCode === ESC_KEY_CODE;
};

/**
 * @param {Object<Element, Element, Function, Function>} options openBtn, closeBtn, cb on popup opened, cb on popup closed
 * @constructor
 */
let Popup = function (options) {
  this.openBtn = options.openBtn;
  this.closeBtn = options.closeBtn;
  let onPopupOpen = options.onPopupOpen;
  let onPopupClose = options.onPopupClose;

  /**
   * Close popup if Esc key pressed
   * @param {KeyboardEvent} evt
   */
  let onEscPress = function (evt) {
    if (isEscPressed(evt)) {
      closePopup();
    }
  };

  let openPopup = function () {
    document.addEventListener('keydown', onEscPress);
    onPopupOpen();
  };

  let closePopup = function () {
    document.removeEventListener('keydown', onEscPress);
    onPopupClose();
  };

  this.openPopup = openPopup;
  this.closePopup = closePopup;

  this._onOpenBtnClick = function (evt) {
    evt.preventDefault();
    openPopup();
  };

  this._onCloseBtnClick = function (evt) {
    evt.preventDefault();
    closePopup();
  };
};

/**
 * popup initialization
 */
Popup.prototype.init = function () {
  this.closeBtn.addEventListener('click', this._onCloseBtnClick);
  this.openBtn.addEventListener('click', this._onOpenBtnClick);
};
/**
 * popup destruction
 */
Popup.prototype.destroy = function () {
  this.closeBtn.removeEventListener('click', this._onCloseBtnClick);
  this.openBtn.removeEventListener('click', this._onOpenBtnClick);
};
/**
 * method that opens the popup
 */
Popup.prototype.open = function () {
  this.openPopup();
};
/**
 * method that closes the popup
 */
Popup.prototype.close = function () {
  this.closePopup();
};

module.exports = Popup;
