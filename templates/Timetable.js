const h = require('./hyperscript');
const Layout = require('./Layout');
const Header = require('./components/Header');
const Footer = require('./components/Footer');
const CurrentDirectory = require('./components/CurrentDirectory');
const { sprintf } = require('sprintf-js');

const WEEKDAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];

module.exports = function Timetable({
  relativeRoot,
  name,
  dirNames,
  lessonTimes,
  lessons,
  lessonColors,
}) {
  return Layout({
    relativeRoot,
    head: [
      h('title', 'school-timetable'),
      h('link', { rel: 'stylesheet', href: `${relativeRoot}/Timetable.css` }),
    ],
    body: [
      Header(),
      h(
        'main',
        h(
          'table',
          { class: 'Timetable' },
          CurrentDirectory({ dirs: dirNames }),
          h(
            'thead',
            h('tr', h('th', { colspan: 7, class: 'title' }, name)),
            h(
              'tr',
              h('th', 'Дзвінки'),
              h('th', 'Урок'),
              WEEKDAYS.map(weekday => h('th', weekday)),
            ),
          ),
          h(
            'tbody',
            lessonTimes.map(({ start, end }, lessonIndex) =>
              h(
                'tr',
                h('td', sprintf('%02d:%02d\u2013%02d:%02d', ...start, ...end)),
                h('td', lessonIndex + 1),
                WEEKDAYS.map((_weekday, weekdayIndex) => {
                  let lesson = lessons[weekdayIndex][lessonIndex];
                  if (lesson == null) return h('td');
                  let color = lessonColors[lesson];
                  return h(
                    'td',
                    {
                      style: `background-color: ${color.back}; color: ${color.fore}`,
                    },
                    lesson,
                  );
                }),
              ),
            ),
          ),
        ),
      ),
      Footer(),
    ],
  });
};
