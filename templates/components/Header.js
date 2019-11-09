const h = require('../hyperscript');
const CurrentDirectory = require('./CurrentDirectory');

module.exports = function Header({ dirs, disableLast }) {
  return h(
    'header',
    h('p', { id: 'title' }, 'Індекс шкільних розкладів уроків'),
    CurrentDirectory({ dirs, disableLast }),
  );
};
