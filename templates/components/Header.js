const h = require('../hyperscript');
const CurrentDirectory = require('./CurrentDirectory');
const metadata = require('../metadata');

module.exports = function Header({ dirs, disableLast }) {
  return h(
    'header',
    h(
      'p',
      { id: 'title' },
      metadata.TITLE,
      ' ',
      h('span', { id: 'version' }, 'v', metadata.VERSION),
    ),
    CurrentDirectory({ dirs, disableLast }),
  );
};
