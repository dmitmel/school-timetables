const h = require('../hyperscript');
const CurrentDirectory = require('./CurrentDirectory');

module.exports = function Header({ dirs, disableLast }) {
  return h('header', CurrentDirectory({ dirs, disableLast }));
};
