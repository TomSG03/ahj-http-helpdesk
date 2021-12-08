import Trello from './trello';

const topic = ['Нужно сделать', 'Делаю', 'Результат'];

const example = [
  ['Встать пораньше', 'Забить пару гвоздей', 'Забить на все', 'Не опоздать на работу', 'Делать как надо'],
  ['Бегу', 'Пью кофе', 'Еду', 'Делаю что могу'],
  ['Опять опоздал', 'Забил'],
];

const divTrello = document.querySelector('.trello');

const jsTrello = new Trello(divTrello, topic);

jsTrello.init(example);

jsTrello.display();
