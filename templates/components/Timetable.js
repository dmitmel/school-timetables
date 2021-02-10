const h = require('../hyperscript');
const { sprintf } = require('sprintf-js');

const WEEKDAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];
const TOTAL_COLUMNS = WEEKDAYS.length + 2;

module.exports = function Timetable({ title, lessonTimes, lessons, lessonColors, footer = null }) {
  return h(
    'table',
    { class: 'Timetable' },
    h(
      'thead',
      h('tr', h('th', { colspan: TOTAL_COLUMNS, class: 'title' }, title)),
      h(
        'tr',
        h('th', 'Дзвінки'),
        h('th', 'Урок'),
        WEEKDAYS.map((weekday) => h('th', weekday)),
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
              color != null ? { style: `background-color: ${color[0]}; color: ${color[1]}` } : null,
              lesson,
            );
          }),
        ),
      ),
    ),
    footer != null ? h('tfoot', h('tr', h('td', { colspan: TOTAL_COLUMNS }, footer))) : null,
  );
};
