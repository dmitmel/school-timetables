const h = require('../hyperscript');
const CurrentDirectory = require('./CurrentDirectory');
const { TITLE } = require('../Layout');

module.exports = function Header({ dirs, disableLast }) {
  return h(
    'header',
    h('p', { id: 'title' }, TITLE),
    CurrentDirectory({ dirs, disableLast }),
  );
};
