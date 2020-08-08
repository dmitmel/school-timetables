const h = require('./hyperscript');
const Layout = require('./Layout');
const Header = require('./components/Header');
const Footer = require('./components/Footer');
const Timetable = require('./components/Timetable');

module.exports = function TimetablePage({
  relativeRoot,
  name,
  dirNames,
  lessonTimes,
  lessons,
  lessonColors,
}) {
  return Layout({
    relativeRoot,
    titleSuffix: [...dirNames, name].map((s) => `/${s}`).join(''),
    head: [
      h('link', {
        rel: 'stylesheet',
        href: `${relativeRoot}/TimetablePage.css`,
      }),
    ],
    body: [
      Header({ dirs: dirNames }),
      h(
        'main',
        h(
          'div',
          { id: 'TimetableWrapper' },
          Timetable({
            title: name,
            lessonTimes,
            lessons,
            lessonColors,
          }),
        ),
        h(
          'p',
          h(
            'a',
            { href: `./${name}.print.html` },
            'Версія цієї таблиці для друку',
          ),
        ),
      ),
      Footer(),
    ],
  });
};
