const h = require('../hyperscript');
const { TITLE } = require('../Layout');

const SOURCE_CODE_URL = 'https://github.com/dmitmel/school-timetable';
const LICENSE_URL = 'https://choosealicense.com/licenses/mit/';
const AUTHOR_WEBSITE_URL = 'https://github.com/dmitmel';
const AUTHOR_EMAIL = 'dmytro.meleshko@gmail.com';
const AUTHOR_EMAIL_URL = `mailto:${AUTHOR_EMAIL}?subject=${encodeURIComponent(
  TITLE,
)}`;

module.exports = function Footer() {
  return h(
    'footer',
    h(
      'p',
      h('a', { href: SOURCE_CODE_URL }, 'Сирцевий код'),
      ' на GitHub, ',
      h('a', { href: LICENSE_URL }, 'ліцензія MIT'),
      h('br'),
      '\u00A9 2019 ',
      h('a', { href: AUTHOR_WEBSITE_URL }, 'Дмитро Мелешко'),
      ' <',
      h('a', { href: AUTHOR_EMAIL_URL }, AUTHOR_EMAIL),
      '>',
    ),
  );
};
