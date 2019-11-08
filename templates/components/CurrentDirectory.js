const h = require('../hyperscript');

module.exports = function CurrentDirectory({ dirs, disableLast = false }) {
  return h(
    'h2',
    h(
      'ol',
      { class: 'CurrentDirectory' },
      [
        h('i', {
          class: 'fa fa-home',
          'aria-hidden': true,
          title: 'додому',
        }),
        ...dirs,
      ].map((element, index, elements) =>
        h(
          'li',
          !disableLast || index + 1 < elements.length
            ? h(
                'a',
                { href: `.${'/..'.repeat(elements.length - index - 1)}` },
                element,
              )
            : h('span', element),
        ),
      ),
    ),
  );
};
