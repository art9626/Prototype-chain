import BaseComponent from "./BaseComponent.js";

export default class FormComponent extends BaseComponent {
  constructor({ containerSelector, resultList }) {
    super({ containerSelector });
    this.resultList = resultList;
  }

  async getConstructorName() {
    if (this.input.value.endsWith('.js')) {
      const module = await import(`./${this.input.value}`);

      return module.default;
    } else {
      return this.input.value;
    }
  }

  createElement() {
    const form = document.createElement('form');
    this.input = document.createElement('input');
    const btn = document.createElement('button');

    form.classList.add('mb-5');
    this.input.classList.add('form-control', 'mb-3');
    btn.classList.add('btn', 'btn-primary');
  
    btn.textContent = 'Показать цепочку прототипов';
    this.input.type = 'text';
  
    form.append(this.input);
    form.append(btn);

    this.input.addEventListener('input', e => {
      e.target.classList.remove('is-invalid');
    })
  
    form.addEventListener('submit', async  e => {
      e.preventDefault();

      try {
        if (this.input.value.endsWith('.js')) {
          const constructorFunc = await this.getConstructorName();

          this.validateForm(constructorFunc);

          const arrayOfPrototypes = this.getPrototypeChain(constructorFunc);

          this.resultList.addItemsToList(arrayOfPrototypes, constructorFunc.name);
        } else {
          const constructorName = await this.getConstructorName();

          this.validateForm(window[constructorName]);

          const arrayOfPrototypes = this.getPrototypeChain(window[constructorName]);
          this.resultList.addItemsToList(arrayOfPrototypes, constructorName);
        }
      } catch (err) {
        if (err.name === 'Error') {
          this.input.classList.add('is-invalid');
        } else {
          throw err;
        }
      } finally {
        this.input.value = '';
      }
    });

    return form;
  }

  getPrototypeChain(func) {
    const arrayOfPrototypes = [];

    do {
      let constructorName;

      if (Object.getOwnPropertyDescriptor(func.prototype, 'constructor')) {
        constructorName = func.prototype.constructor.name;
      } else {
        constructorName = 'Без названия';
      }

      arrayOfPrototypes.push({ 
        name: constructorName, 
        properties: this.getArrayOfProperties(func.prototype)
      });

      const nextPrototype = Object.getPrototypeOf(func.prototype);

      if (!nextPrototype) {
        func = null;
      } else {
        func = nextPrototype.constructor;
      }

    } while (func)

    return arrayOfPrototypes;
  }

  validateForm(func) {
    if (typeof func === 'function') return;

    throw new Error('Неверное название класса или путь к модулю')
  }

  getArrayOfProperties(constructorPrototype) {
    return Object.keys(constructorPrototype)
      .map(item => {
        const descriptor = Object.getOwnPropertyDescriptor(constructorPrototype, `${item}`);
        if ('set' in descriptor || 'get' in descriptor) {
          return { name: item, propertyType: 'accessor properties', type: 'function' };
        } else if ('value' in descriptor) {
          return { name: item, propertyType: 'data properties', type: typeof descriptor.value };
        }
      })
      .sort((a, b) => {
        if (a.propertyType > b.propertyType) return 1;
        if (a.propertyType == b.propertyType) return 0;
        if (a.propertyType < b.propertyType) return -1;
      });
  }
}