const h = require('./hyperscript');
const Layout = require('./Layout');
const Header = require('./components/Header');
const Footer = require('./components/Footer');
const CurrentDirectory = require('./components/CurrentDirectory');

module.exports = function DirectoryIndex({ relativeRoot, dirNames, contents }) {
  let title = 'Індекс шкільних розкладів уроків';

  return Layout({
    relativeRoot,
    head: [
      h('link', {
        rel: 'stylesheet',
        href: `${relativeRoot}/DirectoryIndex.css`,
      }),
      h('title', title),
    ],
    body: [
      Header(),
      h(
        'main',
        CurrentDirectory({ dirs: dirNames, disableLast: true }),
        h(
          'ul',
          { class: 'DirectoryIndex' },
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
      Footer(),
    ],
  });
};
