/* eslint-disable guard-for-in */
export default class GUI {
  constructor(host) {
    this.host = host;
    this.closeWinModal = this.closeWinModal.bind(this);
  }

  winModalDialog(obj = {}, callback) {
    this.winModal = document.createElement('div');
    this.winModal.className = 'windowAsk-wrapper';
    const divWindow = document.createElement('div');
    divWindow.className = 'window-ask';

    let winHTML = '';
    for (const key in obj) {
      switch (key) {
        case 'head':
          winHTML += `<div class="head-ask">${obj[key]}</div>`;
          break;
        case 'input':
          winHTML += `
            <div class="input-ask-block">
              <div class="head-input-ask">${obj[key].head}</div>
              <input class="input-ask" type="text" value="${obj[key].value}">
            </div>
          `;
          break;
        case 'textArea':
          winHTML += `
            <div class="input-ask-block">
              <div class="head-textarea-ask">${obj[key].head}</div>
              <textarea class="textarea-ask">${obj[key].value}</textarea>
            </div>
          `;
          break;
        case 'text':
          winHTML += `<div class="body-ask">${obj[key]}</div>`;
          break;

        default:
          break;
      }
    }

    divWindow.innerHTML = winHTML;

    const divBtn = document.createElement('div');
    divBtn.className = 'btn-ask';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'btnCancel';
    btnCancel.textContent = 'Отмена';

    const btnOk = document.createElement('button');
    btnOk.className = 'btnOk';
    btnOk.textContent = 'Ok';

    divBtn.appendChild(btnCancel);
    divBtn.appendChild(btnOk);

    this.winModal.appendChild(divWindow);
    divWindow.appendChild(divBtn);

    document.body.appendChild(this.winModal);

    this.cancel = this.winModal.querySelector('.btnCancel');
    this.cancel.addEventListener('click', this.closeWinModal);
    this.ok = this.winModal.querySelector('.btnOk');
    this.ok.addEventListener('click', callback);
  }

  closeWinModal() {
    this.winModal.remove();
  }

  // ---------------------------- add parts ---------------------------------

  showDesk(arr) {
    arr.forEach((e) => {
      const div = document.createElement('div');
      div.dataset.id = e.id;
      div.className = 'task';
      div.innerHTML = `
        <div class="task-name">       
          <div class="status">${e.status ? '✔' : ''}</div>
          <div class="name">${e.name}</div>
          <div class="date">${e.created}</div>
          <div class="edit">✎</div>
          <div class="del">✕</div>
        </div>
      `;
      this.host.appendChild(div);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  changeStatus(e) {
    if (e.textContent === '') {
      e.textContent = '✔';
    } else {
      e.textContent = '';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showDescription(e, description) {
    const div = document.createElement('div');
    div.className = 'task-description';
    div.style.width = `${e.offsetWidth}px`;
    div.textContent = description;
    e.closest('.task').append(div);
  }

  // eslint-disable-next-line class-methods-use-this
  removeTicket(e) {
    e.closest('.task').remove();
  }

  // eslint-disable-next-line class-methods-use-this
  editTicket(e, name) {
    e.closest('.task').querySelector('.name').textContent = name;
  }

  resetDesk() {
    const arr = this.host.querySelectorAll('.task');
    arr.forEach((e) => e.remove());
  }
}
