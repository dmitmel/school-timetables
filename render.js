#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');
const klawSync = require('klaw-sync');
const sprintf = require('sprintf-js');
const materialColors = require('material-colors');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DATA_FILES_DIR = path.join(__dirname, 'data');
const STATIC_FILES_DIR = path.join(__dirname, 'static');
const RENDERED_FILES_DIR = path.join(__dirname, 'rendered');

fs.ensureDirSync(RENDERED_FILES_DIR);
fs.emptyDirSync(RENDERED_FILES_DIR);

klawSync(STATIC_FILES_DIR).forEach(({path: filePath, stats}) => {
  let relativePath = path.relative(STATIC_FILES_DIR, filePath);
  let pathInRendered = path.join(RENDERED_FILES_DIR, relativePath);
  if (stats.isDirectory()) {
    fs.ensureDirSync(pathInRendered);
  } else {
    fs.copyFileSync(filePath, pathInRendered);
  }
});

function flattenObj(obj, keySeparator = '/', keyPath = [], result = {}) {
  for (let key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    let value = obj[key];
    let newKeyPath = keyPath.concat([key]);
    /* eslint-disable-next-line eqeqeq */
    if (typeof value === 'object' && value !== null) {
      flattenObj(value, keySeparator, newKeyPath, result);
    } else {
      result[newKeyPath.join(keySeparator)] = obj[key];
    }
  }
  return result;
}
let flattenedMaterialColors = flattenObj(materialColors);

let lessonColors = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-colors.json'),
);
Object.keys(lessonColors).forEach(lessonName => {
  let {back, fore} = lessonColors[lessonName];
  lessonColors[lessonName] = {
    back: flattenedMaterialColors[back],
    fore: flattenedMaterialColors[fore],
  };
});

let lessonTimes = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-times', 'Basis.json'),
);

let env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(TEMPLATES_DIR),
);
env.addFilter('format', function format(formatStr, ...args) {
  return sprintf.vsprintf(formatStr, args);
});

const LESSON_DATA_FILES_DIR = path.join(DATA_FILES_DIR, 'lessons');

function renderLessonFilesDir(dirPath, dataDirNames) {
  let relativeDirPath = path.relative(LESSON_DATA_FILES_DIR, dirPath);
  let templateRelativeRoot = path.relative(relativeDirPath, '.') || '.';
  fs.ensureDirSync(path.join(RENDERED_FILES_DIR, relativeDirPath));

  let contents = [];
  fs.readdirSync(dirPath).forEach(name => {
    let fullPath = path.join(dirPath, name);
    if (fs.lstatSync(fullPath).isDirectory()) {
      renderLessonFilesDir(fullPath, [...dataDirNames, name]);
      contents.push({name, isDir: true});
    } else {
      let extName = path.extname(name);
      if (extName === '.json') {
        let baseName = path.basename(name, extName);
        let lessons = fs.readJsonSync(fullPath);
        let timetableHtml = env.render('timetable.njk', {
          relativeRoot: templateRelativeRoot,
          dirNames: dataDirNames,
          name: baseName,
          lessonColors,
          lessonTimes,
          lessons,
        });
        fs.writeFileSync(
          path.join(RENDERED_FILES_DIR, relativeDirPath, `${baseName}.html`),
          timetableHtml,
        );
        contents.push({name: baseName, isDir: false});
      }
    }
  });

  let indexHtml = env.render('directory-index.njk', {
    relativeRoot: templateRelativeRoot,
    dirNames: dataDirNames,
    contents,
  });
  fs.writeFileSync(
    path.join(RENDERED_FILES_DIR, relativeDirPath, 'index.html'),
    indexHtml,
  );
}

renderLessonFilesDir(LESSON_DATA_FILES_DIR, []);
