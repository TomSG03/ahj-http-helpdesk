export default class Trello {
  constructor(dom, topic) {
    this.dom = dom;
    this.topic = topic;
    this.dragItem = null;
    this.source = null;
  }

  init(arrExample) {
    if (localStorage.getItem('trello') === null) {
      this.storage = arrExample;
    } else {
      this.storage = JSON.parse(localStorage.getItem('trello'));
    }
  }

  colsFill() {
    for (let i = 0; i < this.topic.length; i += 1) {
      const list = document.createElement('div');
      list.className = 'list-block';
      list.innerHTML = `<h4 class='topic'>${this.topic[i]}</h3>`;
      list.append(this.colFill(this.topic[i], i));
      list.append(this.addRec());
      this.dom.append(list);
    }
  }

  colFill(arrBlock, col) {
    const ul = document.createElement('ul');
    for (let i = 0; i < this.storage[col].length; i += 1) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.textContent = this.storage[col][i];
      const del = document.createElement('div');
      del.className = 'btn-del';
      del.textContent = '✖';
      li.append(del);
      ul.append(li);
    }
    return ul;
  }

  // eslint-disable-next-line class-methods-use-this
  addRec() {
    const ftr = document.createElement('div');
    ftr.textContent = '+ Новая запись';
    ftr.className = 'addRec';
    return ftr;
  }

  display() {
    this.colsFill();
    this.createCap();

    // ----------------------- click -----------------------------
    this.dom.addEventListener('click', (e) => {
      e.target.style.cursor = 'default';
      if (e.target.classList.contains('addRec')) {
        e.target.closest('.list-block').append(this.formAddRec());
        e.target.remove();
      }
      if (e.target.classList.contains('form-btn-cancel')) {
        e.target.closest('.list-block').append(this.addRec());
        e.target.closest('.formAddRec').remove();
      }
      if (e.target.classList.contains('form-btn-submit')) {
        e.preventDefault();
        const text = e.target.form.querySelector('textarea').value;
        if (text !== '') {
          const li = document.createElement('li');
          li.className = 'list-item';
          const del = document.createElement('div');
          del.className = 'btn-del';
          del.textContent = '✖';
          li.textContent = text;
          li.append(del);
          e.target.closest('.list-block').querySelector('ul').append(li);
          e.target.closest('.list-block').append(this.addRec());
          e.target.closest('.formAddRec').remove();
          this.saveState();
        } else {
          const err = e.target.form.querySelector('textarea');
          err.setAttribute('placeholder', 'Нужно заполнить это поле');
          setTimeout(() => {
            err.setAttribute('placeholder', 'Новая запись...');
          }, 1000, err);
        }
      }
      if (e.target.classList.contains('btn-del')) {
        e.target.closest('.list-item').remove();
        this.saveState();
      }
    });

    // ------------------------ down ---------------------------
    this.dom.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('btn-del')) { return; }
      const target = e.target.closest('.list-item');
      if (!target) {
        return;
      }
      e.preventDefault();
      if (e.target.classList.contains('list-item')) {
        e.target.style.cursor = 'grabbing';
        this.source = target;
        this.dragItem = this.source.cloneNode(true);
        this.dragdX = e.pageX - e.target.offsetLeft;
        this.dragY = e.pageY - e.target.offsetTop;
        this.dragItem.style.top = `${e.target.offsetTop - 5}px`;
        this.dragItem.style.left = `${e.target.offsetLeft + 5}px`;
        this.dragItem.style.width = `${this.source.offsetWidth}px`;
        this.dragItem.style.height = `${this.source.offsetHeight}px`;
        this.dragItem.style.zIndex = '5000';
        this.dragItem.style.position = 'absolute';
        this.dragItem.style.opacity = '0.8';
        this.dragItem.style.pointerEvents = 'none';
        this.dom.append(this.dragItem);
        this.source.classList.add('selected');
      }
    });

    // ------------------------ up -----------------------------
    this.dom.addEventListener('mouseup', (e) => {
      if (!this.source) {
        return;
      }
      e.preventDefault();
      const insertItem = document.elementFromPoint(e.clientX, e.clientY);
      if (insertItem.classList.contains('list-item-cap')) {
        this.cap.replaceWith(this.source);
        this.saveState();
      }
      if (this.cap) {
        this.cap.remove();
      }
      this.dragItem.remove();
      this.source.classList.remove('selected');
      this.dragItem = null;
      this.source = null;
    });

    // ------------------------ out -----------------------------
    this.dom.addEventListener('mouseout', (e) => {
      e.target.style.cursor = '';
    });

    // ----------------------- move ------------------------------
    this.dom.addEventListener('mousemove', (e) => {
      if (!this.source) {
        return;
      }
      e.target.style.cursor = 'grabbing';
      this.dragItem.style.top = `${e.pageY - this.dragY}px`;
      this.dragItem.style.left = `${e.pageX - this.dragdX}px`;
      const insertItem = document.elementFromPoint(e.clientX, e.clientY);
      if (insertItem.classList.contains('list-item') && insertItem !== this.source) {
        const midlle = insertItem.offsetHeight / 2;
        const currentPos = e.pageY - insertItem.offsetTop;
        this.cap.style.height = `${this.dragItem.offsetHeight}px`;
        if (currentPos > midlle && insertItem.nextSibling !== this.source) {
          insertItem.insertAdjacentElement('afterEnd', this.cap);
        }
        if (currentPos < midlle && insertItem.previousSibling !== this.source) {
          insertItem.insertAdjacentElement('beforeBegin', this.cap);
        }
      }
      if (insertItem.classList.contains('topic') && insertItem.closest('.list-block').querySelector('ul').childNodes.length === 0) {
        insertItem.closest('.list-block').querySelector('ul').append(this.cap);
      }
    });
  }

  createCap() {
    this.cap = document.createElement('li');
    this.cap.className = 'list-item-cap';
  }

  // eslint-disable-next-line class-methods-use-this
  formAddRec() {
    const form = document.createElement('form');
    form.className = 'formAddRec';
    form.innerHTML = `
      <textarea placeholder="Новая запись..."></textarea>
      <input class="form-btn-submit" type="submit" value="Добавить"/>
      <div class="form-btn-cancel">✖</div>`;
    return form;
  }

  saveState() {
    const arrSave = [];
    const arrUl = [...this.dom.querySelectorAll('.list-block')];
    for (let i = 0; i < arrUl.length; i += 1) {
      const arrLi = [...arrUl[i].querySelectorAll('.list-item')];
      const arrtext = arrLi.map((e) => e.innerText);
      arrSave.push(arrtext);
    }
    localStorage.setItem('trello', JSON.stringify(arrSave));
  }
}
