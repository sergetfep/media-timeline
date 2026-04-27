import { parseCoordinates } from './coords';

export default class Timeline {
  constructor(container) {
    this.container = container;
    this.posts = [];
    this.pendingText = '';
  }

  init() {
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.className = 'timeline-page';

    const shell = document.createElement('main');
    shell.className = 'timeline';

    const title = document.createElement('h1');
    title.className = 'timeline__title';
    title.textContent = 'Timeline';

    const hint = document.createElement('p');
    hint.className = 'timeline__hint';
    hint.textContent = 'Введите текст записи и нажмите Enter. Для переноса строки используйте Shift + Enter.';

    this.list = document.createElement('div');
    this.list.className = 'timeline__list';

    this.empty = document.createElement('div');
    this.empty.className = 'timeline__empty';
    this.empty.textContent = 'Пока нет записей';
    this.list.append(this.empty);

    const composer = document.createElement('div');
    composer.className = 'composer';

    this.input = document.createElement('textarea');
    this.input.className = 'composer__input';
    this.input.rows = 2;
    this.input.placeholder = 'Напишите что-нибудь';

    composer.append(this.input);
    shell.append(title, hint, this.list, composer);
    this.container.append(shell, this.createModal());
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal';

    const dialog = document.createElement('div');
    dialog.className = 'modal__dialog';

    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = 'Что-то пошло не так';

    const text = document.createElement('p');
    text.className = 'modal__text';
    text.textContent = 'Не удалось определить ваше местоположение. Укажите координаты вручную.';

    this.modalForm = document.createElement('form');
    this.modalForm.className = 'modal__form';
    this.modalForm.noValidate = true;

    this.modalInput = document.createElement('input');
    this.modalInput.className = 'modal__input';
    this.modalInput.type = 'text';
    this.modalInput.placeholder = '51.50851, -0.12572';
    this.modalInput.required = true;

    this.modalError = document.createElement('div');
    this.modalError.className = 'modal__error';

    const actions = document.createElement('div');
    actions.className = 'modal__actions';

    const okButton = document.createElement('button');
    okButton.className = 'modal__button modal__button_primary';
    okButton.type = 'submit';
    okButton.textContent = 'OK';

    this.cancelButton = document.createElement('button');
    this.cancelButton.className = 'modal__button';
    this.cancelButton.type = 'button';
    this.cancelButton.textContent = 'Отмена';

    actions.append(okButton, this.cancelButton);
    this.modalForm.append(this.modalInput, this.modalError, actions);
    dialog.append(title, text, this.modalForm);
    this.overlay.append(dialog);

    return this.overlay;
  }

  bindEvents() {
    this.input.addEventListener('keydown', (event) => this.handleInputKeydown(event));
    this.modalForm.addEventListener('submit', (event) => this.handleManualSubmit(event));
    this.cancelButton.addEventListener('click', () => this.closeModal());

    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.overlay.classList.contains('modal_open')) {
        this.closeModal();
      }
    });
  }

  async handleInputKeydown(event) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    const text = this.input.value.trim();

    if (!text) {
      return;
    }

    try {
      const coords = await this.getPosition();
      this.addPost(text, coords);
      this.input.value = '';
    } catch {
      this.pendingText = text;
      this.openModal();
    }
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation API is unavailable'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject(new Error('Could not get current position')),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });
  }

  handleManualSubmit(event) {
    event.preventDefault();

    try {
      const coords = parseCoordinates(this.modalInput.value);
      this.addPost(this.pendingText, coords);
      this.input.value = '';
      this.closeModal();
    } catch (error) {
      this.showModalError(error.message);
    }
  }

  openModal() {
    this.modalInput.value = '';
    this.clearModalError();
    this.overlay.classList.add('modal_open');
    this.modalInput.focus();
  }

  closeModal() {
    this.pendingText = '';
    this.overlay.classList.remove('modal_open');
    this.clearModalError();
    this.input.focus();
  }

  showModalError(message) {
    this.modalInput.classList.add('modal__input_invalid');
    this.modalInput.setAttribute('aria-invalid', 'true');
    this.modalError.textContent = message;
  }

  clearModalError() {
    this.modalInput.classList.remove('modal__input_invalid');
    this.modalInput.removeAttribute('aria-invalid');
    this.modalError.textContent = '';
  }

  addPost(text, coords) {
    const post = {
      id: Date.now(),
      text,
      coords,
      createdAt: new Date(),
    };

    this.posts.unshift(post);
    this.renderPost(post);
  }

  renderPost(post) {
    if (this.empty.isConnected) {
      this.empty.remove();
    }

    const item = document.createElement('article');
    item.className = 'post';

    const content = document.createElement('p');
    content.className = 'post__text';
    content.textContent = post.text;

    const footer = document.createElement('div');
    footer.className = 'post__footer';

    const coords = document.createElement('span');
    coords.className = 'post__coords';
    coords.textContent = `[${post.coords.latitude.toFixed(5)}, ${post.coords.longitude.toFixed(5)}]`;

    const time = document.createElement('time');
    time.className = 'post__time';
    time.dateTime = post.createdAt.toISOString();
    time.textContent = post.createdAt.toLocaleString('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    footer.append(coords, time);
    item.append(content, footer);
    this.list.prepend(item);
  }
}
