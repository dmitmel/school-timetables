#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');
const klawSync = require('klaw-sync');
const sprintf = require('sprintf-js');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DATA_FILES_DIR = path.join(__dirname, 'data');
const STATIC_FILES_DIR = path.join(__dirname, 'static');
const RENDERED_FILES_DIR = path.join(__dirname, 'rendered');

fs.ensureDirSync(RENDERED_FILES_DIR);
fs.emptyDirSync(RENDERED_FILES_DIR);

let staticFiles = klawSync(STATIC_FILES_DIR);
staticFiles.forEach(({ path: filePath, stats }) => {
  let relativePath = path.relative(STATIC_FILES_DIR, filePath);
  let pathInRendered = path.join(RENDERED_FILES_DIR, relativePath);
  if (stats.isDirectory()) {
    fs.ensureDirSync(pathInRendered);
  } else {
    fs.copyFileSync(filePath, pathInRendered);
  }
});

let lessonTimes = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-times', 'Basis.json'),
);
let lessons = fs.readJsonSync(
  path.join(
    DATA_FILES_DIR,
    'lessons',
    'Basis',
    '2019-2020',
    'I семестр',
    '9-A.json',
  ),
);

let env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(TEMPLATES_DIR),
);
env.addFilter('format', function format(formatStr, ...args) {
  return sprintf.vsprintf(formatStr, args);
});

let renderedHtml = env.render('timetable.njk', {
  lessonTimes,
  lessons,
});
fs.writeFileSync(path.join(RENDERED_FILES_DIR, 'index.html'), renderedHtml);
