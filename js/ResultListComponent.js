import BaseComponent from "./BaseComponent.js";

export default class ResultListComponent extends BaseComponent {
  constructor({ containerSelector }) {
    super({ containerSelector });
  }

  createElement() {
    this.list = document.createElement('ol');
    this.list.classList.add('list-group', 'list-group-numbered');

    return this.list;
  }

  addItemsToList(data, classTitle) {
    this.list.innerHTML = '';

    const listTitle = document.createElement('h2');
    listTitle.classList.add('text-primary', 'mb-3');
    listTitle.innerHTML = `Прототипами класса <span class="text-success">${classTitle}</span> являются:`;

    this.list.append(listTitle);

    data.forEach(item => {
      const listItemElement = this.createItemElement(item, true);

      if (item.properties.length > 0) {
        const childList = document.createElement('ol');
        const childListTitle = document.createElement('h4');

        childList.classList.add('hide', 'list-group', 'list-group-numbered');
        childListTitle.classList.add('my-3');
        
        childListTitle.textContent = 'Перечисляемые свойства прототипа:';
        
        item.properties.forEach(item => {
          const childListItemElement = this.createItemElement(item);
          childList.append(childListItemElement);
        })
        
        childList.prepend(childListTitle);
        listItemElement.append(childList);
      } else {
        const message = document.createElement('p');
        message.classList.add('hide');
        message.textContent = 'У данного прототипа отсутвуют перечисляемые свойства';

        listItemElement.append(message);
      }

      this.list.append(listItemElement );
    })
  }

  createItemElement(data, parentElement = false) {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    let title;
    
    if (parentElement) {
      title = document.createElement('h3');
      title.classList.add('text-success');
    
      title.addEventListener('click', e => {
        if (e.target.nextElementSibling) {
          e.target.nextElementSibling.classList.toggle('hide');
        }
      })
    } else {
      title = document.createElement('h4');
      title.classList.add('text-info');

      const description = document.createElement('p');
      description.innerHTML = `
        <span>Тип свойства: <span class="text-warning">${data.propertyType}</span></span>
        <br>
        <span>Тип данных свойства: <span class="text-warning">${data.type}</span></span>
      `;

      item.append(description);
    }

    title.textContent = data.name;
    item.prepend(title);

    return item;
  }
}