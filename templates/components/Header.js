const h = require('../hyperscript');

module.exports = function Header() {
  return h(
    'header',
    h('h1', { id: 'title' }, 'Індекс шкільних розкладів уроків'),
  );
};
