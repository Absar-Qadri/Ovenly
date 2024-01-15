import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _message = `Recipe was successfully uploaded 😊`;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
    this._addHandlerEscapeKey();
  }
  _hideWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _showWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._showWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._hideWindow.bind(this));
    this._overlay.addEventListener('click', this._hideWindow.bind(this));
  }
  _addHandlerEscapeKey() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this._hideWindow();
      }
    });
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
