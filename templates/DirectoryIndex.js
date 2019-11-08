const h = require('./hyperscript');
const Layout = require('./Layout');

module.exports = function DirectoryIndex({ relativeRoot, dirNames, contents }) {
  let title = 'Індекс шкільних розкладів уроків';

  function LinkIf(condition, hrefCallback, children) {
    return condition
      ? h('a', { href: hrefCallback() }, children)
      : h('span', children);
  }

  return Layout({
    relativeRoot,
    head: [
      h('link', {
        rel: 'stylesheet',
        href:
          'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        integrity:
          'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
        crossorigin: 'anonymous',
      }),
      h('link', {
        rel: 'stylesheet',
        href: `${relativeRoot}/DirectoryIndex.css`,
      }),
      h('title', title),
    ],
    body: [
      h('header', h('h1', { id: 'title' }, title)),
      h(
        'main',
        h(
          'h2',
          h(
            'ol',
            { id: 'current-dir' },
            h(
              'div',
              LinkIf(
                dirNames.length > 0,
                () => relativeRoot,
                h('i', {
                  class: 'fa fa-home',
                  'aria-hidden': true,
                  title: 'додому',
                }),
              ),
            ),
            dirNames.map((dirName, index) =>
              h(
                'div',
                LinkIf(
                  index + 1 < dirNames.length,
                  () => `..${'/..'.repeat(dirNames.length - index - 2)}`,
                  dirName,
                ),
              ),
            ),
          ),
        ),
        h(
          'ul',
          { id: 'contents' },
          dirNames.length > 0
            ? h(
                'li',
                h(
                  'a',
                  { href: '../' },
                  h('i', {
                    class: 'fa fa-level-up',
                    'aria-hidden': true,
                    title: 'у папку вище',
                  }),
                  ' <папка вище>',
                ),
              )
            : null,
          contents.map(item =>
            h(
              'li',
              h(
                'a',
                { href: `./${item.name}` },
                h('i', {
                  class: `fa fa-${item.isDir ? 'folder' : 'file-text'}-o`,
                  'aria-hidden': true,
                  title: item.isDir ? 'папка' : 'файл',
                }),
                ` ${item.name}`,
              ),
            ),
          ),
        ),
      ),
      h(
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
      ),
    ],
  });
};
