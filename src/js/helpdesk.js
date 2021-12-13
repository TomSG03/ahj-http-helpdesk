import Request from './request';
import Tasks from './task';
import GUI from './gui';

export default class HelpDesk {
  constructor(domElement, server) {
    this.domElement = domElement;
    this.request = new Request(server);
    this.gui = new GUI(domElement.querySelector('.body-desk'));
    this.works = this.workDesk.bind(this);
  }

  begin() {
    this.showAllTicket();
    this.domElement.addEventListener('click', this.works);
  }

  showAllTicket() {
    this.task = [];
    const rezult = this.request.allTickets();
    rezult.then((res) => {
      JSON.parse(res).forEach((e) => {
        const tsk = new Tasks(e.id, e.name, e.status, e.created);
        this.task.push(tsk);
      });
      this.gui.showDesk(this.task);
    });
  }

  workDesk(e) {
    let id;
    if (e.target.closest('.task')) {
      id = e.target.closest('.task').dataset.id;
    }
    switch (e.target.className) {
      case 'status':
        this.changeStatus(e, id);
        break;
      case 'name':
        this.showFullTicket(e, id);
        break;
      case 'del':
        this.removeTicket(e, id);
        break;
      case 'edit':
        this.editTicket(e, id);
        break;
      case 'add-task':
        this.createTicket(e);
        break;
      default:
        break;
    }
  }

  changeStatus(e, id) {
    const x = this.request.changeStatus(id);
    x.then(() => {
      this.gui.changeStatus(e.target);
    });
  }

  showFullTicket(e, id) {
    if (e.target.closest('.task').querySelector('.task-description') !== null) {
      e.target.closest('.task').querySelector('.task-description').remove();
    } else {
      const x = this.request.ticketById(id);
      x.then((res) => {
        this.gui.showDescription(e.target, JSON.parse(res).description);
      });
    }
  }

  removeTicket(e, id) {
    const win = {
      head: 'Удалить тикет',
      text: 'Вы уверены, что хотите удалить тикет? Это действие необратимо.',
    };
    this.gui.winModalDialog(win, () => this.delete(e, id));
  }

  delete(e, id) {
    this.gui.closeWinModal();
    const x = this.request.removeById(id);
    x.then(() => {
      this.gui.removeTicket(e.target);
    });
  }

  editTicket(e, id) {
    const x = this.request.ticketById(id);
    x.then((res) => {
      const { description } = JSON.parse(res);
      const win = {
        head: 'Изменить тикет',
        input: {
          head: 'Краткое описание',
          value: e.target.closest('.task').querySelector('.name').textContent,
        },
        textArea: {
          head: 'Подробное описание',
          value: description,
        },
      };
      this.gui.winModalDialog(win, () => this.edit(e, id));
    });
  }

  edit(e, id) {
    if (e.target.closest('.task').querySelector('.task-description') !== null) {
      e.target.closest('.task').querySelector('.task-description').remove();
    }
    const name = this.gui.winModal.querySelector('.input-ask').value;
    const description = this.gui.winModal.querySelector('.textarea-ask').value;
    this.gui.closeWinModal();
    const x = this.request.editTicket(id, name, description);
    x.then(() => {
      this.gui.editTicket(e.target, name);
    });
  }

  createTicket(e) {
    const win = {
      head: 'Добавить тикет',
      input: {
        head: 'Краткое описание',
        value: '',
      },
      textArea: {
        head: 'Подробное описание',
        value: '',
      },
    };
    this.gui.winModalDialog(win, () => this.create(e));
  }

  create() {
    const name = this.gui.winModal.querySelector('.input-ask').value;
    const description = this.gui.winModal.querySelector('.textarea-ask').value;
    this.gui.closeWinModal();
    const x = this.request.createTicket(name, description, false);
    x.then(() => {
      this.gui.resetDesk();
      this.showAllTicket();
    });
  }
}
