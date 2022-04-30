export default class BaseComponent {
  constructor({ containerSelector }) {
    this.containerSelector = containerSelector;
  }

  addElement() {
    const element = this.createElement();
    this.container = document.querySelector(this.containerSelector);
    this.container.classList.add('container', 'd-flex', 'flex-column', 'py-5', 'align-items-center');
    this.container.append(element);
  }
}