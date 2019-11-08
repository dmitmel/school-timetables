const h = require('./hyperscript');
const Layout = require('./Layout');
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
    body: h(
      'table',
      h(
        'thead',
        h(
          'tr',
          h('th', { colspan: 7, id: 'title' }, [...dirNames, name].join('/')),
        ),
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
            h('td', sprintf('%02d:%02d - %02d:%02d', ...start, ...end)),
            h('td', lessonIndex + 1),
            WEEKDAYS.map((_weekday, weekdayIndex) => {
              let lesson = lessons[weekdayIndex][lessonIndex];
              if (lesson == null) return h('td');
              let color = lessonColors[lesson];
              return h(
                'td',
                {
                  style: { 'background-color': color.back, color: color.fore },
                },
                lesson,
              );
            }),
          ),
        ),
      ),
      h(
        'tfoot',
        h(
          'tr',
          h(
            'td',
            { colspan: 7, id: 'copyright' },
            h(
              'a',
              { href: 'https://choosealicense.com/licenses/mit/' },
              'Ліцензія MIT',
            ),
            ' \u00A9 Дмитро Мелешко 2019',
          ),
        ),
      ),
    ),
  });
};
