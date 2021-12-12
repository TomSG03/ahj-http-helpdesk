import Request from './request';
import Tasks from './task';
import GUI from './gui';

export default class HelpDesk {
  constructor(domElement, server) {
    this.domElement = domElement;
    this.request = new Request(server);
    this.gui = new GUI(domElement.querySelector('.body-desk'));
    this.task = [];
    this.works = this.workDesk.bind(this);
  }

  begin() {
    const rezult = this.request.allTickets();
    rezult.then((res) => {
      JSON.parse(res).forEach((e) => {
        const tsk = new Tasks(e.id, e.name, e.status, e.created);
        this.task.push(tsk);
      });
      this.gui.showDesk(this.task);
    });
    this.domElement.addEventListener('click', this.works);
  }

  workDesk(e) {
    const { id } = e.target.closest('.task').dataset;
    switch (e.target.className) {
      case 'status':
        this.changeStatus(e, id);
        break;
      case 'name':
        this.showFullTicket(e, id);
        break;
      case 'del':
        this.remove(e, id);
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

  remove(e, id) {
    this.gui.modalAsk('Удалить тикет', 'Вы уверены, что хотите удалить тикет? Это действие необратимо.', () => this.delTicket(e, id));
  }

  delTicket(e, id) {
    this.gui.closeModal();
    const x = this.request.removeById(id);
    x.then(() => {
      this.gui.removeTicket(e.target);
    });
  }
}
