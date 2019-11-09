const h = require('./hyperscript');
const Layout = require('./Layout');
const Timetable = require('./components/Timetable');
const metadata = require('./metadata');

module.exports = function PrintableTimetablePage({
  relativeRoot,
  name,
  dirNames,
  lessonTimes,
  lessons,
  lessonColors,
}) {
  let pathOnWebsite = [...dirNames, name].map(s => `/${s}`).join('');
  let footerUrl = `${metadata.WEBSITE_URL}${pathOnWebsite}.html`;
  return Layout({
    relativeRoot,
    titleSuffix: pathOnWebsite,
    head: [
      h('link', {
        rel: 'stylesheet',
        href: `${relativeRoot}/PrintableTimetablePage.css`,
      }),
    ],
    body: [
      h(
        'main',
        Timetable({
          title: name,
          lessonTimes,
          lessons,
          lessonColors,
          footer: h('a', { href: encodeURI(footerUrl) }, footerUrl),
        }),
      ),
    ],
  });
};
