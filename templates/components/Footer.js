const h = require('../hyperscript');

module.exports = function Footer() {
  return h(
    'footer',
    h(
      'p',
      h(
        'a',
        { href: 'https://choosealicense.com/licenses/mit/' },
        'Ліцензія MIT',
      ),
      ' \u00A9 Дмитро Мелешко 2019',
    ),
  );
};
