export default class GUI {
  constructor(host) {
    this.host = host;
    this.closeModal = this.closeModal.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  modalAsk(head = 'Заголовок', ask = 'Текст вопроса', callback) {
    this.modal = document.createElement('div');
    this.modal.className = 'windowAsk-wrapper';

    const divWindow = document.createElement('div');
    divWindow.className = 'window-ask';

    const divHead = document.createElement('div');
    divHead.className = 'head-ask';
    divHead.textContent = head;

    const divBody = document.createElement('div');
    divBody.style.textAlign = 'left';
    divBody.style.margin = '10px 20px';
    divBody.textContent = ask;

    const divBtn = document.createElement('div');
    divBtn.style.textAlign = 'right';
    divBtn.style.margin = '20px';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'btnCancel';
    btnCancel.style.padding = '10px 15px';
    btnCancel.style.marginRight = '20px';
    btnCancel.style.backgroundColor = '#fff';
    btnCancel.style.border = 'solid 1px gray';
    btnCancel.style.borderRadius = '10px';
    btnCancel.style.fontSize = '1.1rem';
    btnCancel.textContent = 'Отмена';

    const btnOk = document.createElement('button');
    btnOk.className = 'btnOk';
    btnOk.style.padding = '10px 20px';
    btnOk.style.backgroundColor = '#fff';
    btnOk.style.border = 'solid 1px gray';
    btnOk.style.borderRadius = '10px';
    btnOk.style.fontSize = '1.1rem';
    btnOk.textContent = 'Ok';

    divBtn.appendChild(btnCancel);
    divBtn.appendChild(btnOk);

    this.modal.appendChild(divWindow);
    divWindow.appendChild(divHead);
    divWindow.appendChild(divBody);
    divWindow.appendChild(divBtn);

    document.body.appendChild(this.modal);

    this.cancel = this.modal.querySelector('.btnCancel');
    this.cancel.addEventListener('click', this.closeModal);
    this.ok = this.modal.querySelector('.btnOk');
    this.ok.addEventListener('click', callback);
  }

  closeModal() {
    this.modal.remove();
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


}
