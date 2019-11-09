const h = require('../hyperscript');
const metadata = require('../metadata');

module.exports = function Footer() {
  return h(
    'footer',
    h(
      'p',
      h('a', { href: metadata.SOURCE_CODE_URL }, 'Сирцевий код'),
      ' на GitHub, ',
      h('a', { href: metadata.LICENSE_URL }, 'ліцензія MIT'),
      h('br'),
      '\u00A9 2019 ',
      h('a', { href: metadata.AUTHOR_WEBSITE_URL }, 'Дмитро Мелешко'),
      ' <',
      h(
        'a',
        {
          href: `mailto:${metadata.AUTHOR_EMAIL}?subject=${encodeURIComponent(
            metadata.TITLE,
          )}`,
        },
        metadata.AUTHOR_EMAIL,
      ),
      '>',
    ),
  );
};
