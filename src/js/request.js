export default class Request {
  constructor(serverURL) {
    this.server = `${serverURL}/tickets`;
  }

  get(params) {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.open('GET', `${this.server}${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(xhr.response);
          } catch (e) {
            reject(e);
          }
        }
      });
      xhr.send();
    });
  }

  post(method, params, fields) {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve) => {
      xhr.open(method, `${this.server}${params}`);
      xhr.addEventListener('load', () => {
        if (xhr.status === 204) {
          resolve(xhr.response);
        }
      });
      xhr.send(fields);
    });
  }

  allTickets() {
    const result = this.get('?method=allTickets');
    return result;
  }

  ticketById(id) {
    const result = this.get(`?method=ticketById&id=${id}`);
    return result;
  }

  createTicket(name, description, status) {
    const fields = new URLSearchParams();
    fields.append('name', name);
    fields.append('description', description);
    fields.append('status', status);
    const result = this.post('POST', '?method=createTicket', fields);
    return result;
  }

  removeById(id) {
    const fields = new URLSearchParams();
    fields.append('curid', id);
    const result = this.post('DELETE', `/${id}`, fields);
    return result;
  }

  changeStatus(id) {
    const fields = new URLSearchParams();
    fields.append('curid', id);
    const result = this.post('PUT', `/${id}`, fields);
    return result;
  }

  editTicket(id, name, description) {
    const fields = new URLSearchParams();
    fields.append('curid', id);
    fields.append('name', name);
    fields.append('description', description);
    const result = this.post('PUT', `/${id}`, fields);
    return result;
  }
}
