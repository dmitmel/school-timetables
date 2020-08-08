const h = require('./hyperscript');
const Layout = require('./Layout');
const Header = require('./components/Header');
const Footer = require('./components/Footer');

module.exports = function DirectoryIndex({ relativeRoot, dirNames, contents }) {
  return Layout({
    relativeRoot,
    titleSuffix: dirNames.map((s) => `/${s}`).join(''),
    head: [
      h('link', {
        rel: 'stylesheet',
        href: `${relativeRoot}/DirectoryIndex.css`,
      }),
    ],
    body: [
      Header({ dirs: dirNames, disableLast: true }),
      h(
        'main',
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
          contents
            .sort(
              (a, b) =>
                Number(b.isDir) - Number(a.isDir) ||
                a.name.localeCompare(b.name, 'uk-UA', { numeric: true }),
            )
            .map(({ isDir, name }) =>
              h(
                'li',
                h(
                  'a',
                  { href: `./${name}${isDir ? '/' : '.html'}` },
                  h('i', {
                    class: `fa fa-${isDir ? 'folder' : 'file-text'}-o`,
                    'aria-hidden': true,
                    title: isDir ? 'папка' : 'файл',
                  }),
                  ` ${name}`,
                ),
              ),
            ),
        ),
      ),
      Footer(),
    ],
  });
};
