#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const sass = require('node-sass');
const nunjucks = require('nunjucks');
const sprintf = require('sprintf-js');
const materialColors = require('material-colors');
const htmlMinifier = require('html-minifier');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STYLESHEETS_DIR = path.join(__dirname, 'styles');
const DATA_FILES_DIR = path.join(__dirname, 'data');
const STATIC_FILES_DIR = path.join(__dirname, 'static');
const RENDERED_FILES_DIR = path.join(__dirname, 'rendered');

function logSection(...args) {
  console.log(chalk.bold(chalk.green('==>'), ...args));
}

logSection('Preparing the directory for rendered files');
fs.ensureDirSync(RENDERED_FILES_DIR);
fs.emptyDirSync(RENDERED_FILES_DIR);

function copyStaticFilesDir(relativeDirPath) {
  let srcDirPath = path.join(STATIC_FILES_DIR, relativeDirPath);
  fs.readdirSync(srcDirPath).forEach(name => {
    let srcPath = path.join(srcDirPath, name);
    let relativePath = path.join(relativeDirPath, name);
    let destPath = path.join(RENDERED_FILES_DIR, relativePath);
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath);
      copyStaticFilesDir(relativePath);
    } else {
      console.log(`copying '${relativePath}'`);
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
logSection('Copying static files');
if (fs.existsSync(STATIC_FILES_DIR)) copyStaticFilesDir('.');

logSection('Loading global data files');

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
console.log('generating color palette');
let flattenedMaterialColors = flattenObj(materialColors);

console.log('loading lesson colors file');
let lessonColors = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-colors.json'),
);
Object.keys(lessonColors).forEach(lessonName => {
  let { back, fore } = lessonColors[lessonName];
  lessonColors[lessonName] = {
    back: flattenedMaterialColors[back],
    fore: flattenedMaterialColors[fore],
  };
});

console.log('loading lesson times file');
let lessonTimes = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-times', 'Basis.json'),
);

function compileStylesheetsDir(relativeDirPath) {
  let srcDirPath = path.join(STYLESHEETS_DIR, relativeDirPath);
  fs.readdirSync(srcDirPath).forEach(name => {
    let srcPath = path.join(srcDirPath, name);
    let relativePath = path.join(relativeDirPath, name);
    if (fs.lstatSync(srcPath).isDirectory()) {
      let destPath = path.join(RENDERED_FILES_DIR, relativePath);
      fs.mkdirSync(destPath);
      compileStylesheetsDir(relativePath);
    } else {
      let extName = path.extname(name);
      if (extName === '.scss') {
        let baseName = path.basename(name, extName);
        let compiledName = path.join(relativeDirPath, `${baseName}.css`);
        let destPath = path.join(RENDERED_FILES_DIR, compiledName);
        console.log(`compiling '${relativePath}' to '${compiledName}'`);
        let result = sass.renderSync({
          file: srcPath,
          outFile: destPath,
          sourceMap: true,
        });
        fs.writeFileSync(destPath, result.css);
        fs.writeFileSync(`${destPath}.map`, result.map);
      }
    }
  });
}
logSection('Compiling stylesheets');
if (fs.existsSync(STYLESHEETS_DIR)) compileStylesheetsDir('.');

logSection('Rendering lesson data files');

let env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(TEMPLATES_DIR),
);
env.addFilter('format', function format(formatStr, ...args) {
  return sprintf.vsprintf(formatStr, args);
});

const LESSON_DATA_FILES_DIR = path.join(DATA_FILES_DIR, 'lessons');

function renderTemplate({ name, renderedName, context }) {
  console.log(`rendering template '${name}' to '${renderedName}'`);

  let renderedText = env.render(name, {
    relativeRoot: path.relative(path.dirname(renderedName), '.') || '.',
    ...context,
  });

  renderedText = htmlMinifier.minify(renderedText, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  fs.writeFileSync(path.join(RENDERED_FILES_DIR, renderedName), renderedText);
}

function renderLessonFilesDir(relativeDirPath, dataDirNames) {
  let absoluteDirPath = path.join(LESSON_DATA_FILES_DIR, relativeDirPath);
  fs.ensureDirSync(path.join(RENDERED_FILES_DIR, relativeDirPath));

  let contents = [];
  fs.readdirSync(absoluteDirPath).forEach(name => {
    let absolutePath = path.join(absoluteDirPath, name);
    let relativePath = path.join(relativeDirPath, name);
    if (fs.lstatSync(absolutePath).isDirectory()) {
      renderLessonFilesDir(relativePath, [...dataDirNames, name]);
      contents.push({ name, isDir: true });
    } else {
      let extName = path.extname(name);
      if (extName === '.json') {
        let baseName = path.basename(name, extName);
        console.log(`generating timetable from '${relativePath}'`);
        let lessons = fs.readJsonSync(absolutePath);
        renderTemplate({
          name: 'timetable.njk',
          renderedName: path.join(relativeDirPath, `${baseName}.html`),
          context: {
            dirNames: dataDirNames,
            name: baseName,
            lessonColors,
            lessonTimes,
            lessons,
          },
        });
        contents.push({ name: baseName, isDir: false });
      }
    }
  });

  console.log(`generating index for directory '${relativeDirPath}'`);
  renderTemplate({
    name: 'directory-index.njk',
    renderedName: path.join(relativeDirPath, 'index.html'),
    context: {
      dirNames: dataDirNames,
      contents,
    },
  });
}

if (fs.existsSync(LESSON_DATA_FILES_DIR)) renderLessonFilesDir('.', []);
