import HelpDesk from './helpdesk';

const domElmt = document.querySelector('.help-desk');

const servetPath = 'http://localhost:7070';
const taskName = '/ahj-hdesk';

const hDesk = new HelpDesk(domElmt, `${servetPath}${taskName}`);
hDesk.begin();
