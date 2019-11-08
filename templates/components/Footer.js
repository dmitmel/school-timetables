const h = require('../hyperscript');

module.exports = function Footer() {
  return h(
    'footer',
    h(
      'p',
      h(
        'a',
        { href: 'https://github.com/dmitmel/school-timetable' },
        'Сирцевий код',
      ),
      ' на GitHub, ',
      h(
        'a',
        { href: 'https://choosealicense.com/licenses/mit/' },
        'ліцензія MIT',
      ),
      ', \u00A9 ',
      h('a', { href: 'https://github.com/dmitmel' }, 'Дмитро Мелешко'),
      ' 2019',
    ),
  );
};
