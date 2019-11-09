#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const sass = require('node-sass');
const materialColors = require('material-colors');
const htmlMinifier = require('html-minifier');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STYLESHEETS_DIR = path.join(__dirname, 'styles');
const DATA_FILES_DIR = path.join(__dirname, 'data');
const LESSON_DATA_FILES_DIR = path.join(DATA_FILES_DIR, 'lessons');
const STATIC_FILES_DIR = path.join(__dirname, 'static');
const RENDERED_FILES_DIR = path.join(__dirname, 'rendered');

function logSection(...args) {
  console.log(chalk.bold(chalk.green('==>'), ...args));
}

function walkSync(dir, callback, parentDirNames = []) {
  let dirs = [];
  let notDirs = [];
  fs.readdirSync(dir).forEach(name => {
    let stats = fs.lstatSync(path.join(dir, name));
    (stats.isDirectory() ? dirs : notDirs).push(name);
  });
  callback(parentDirNames, dirs, notDirs);
  dirs.forEach(subdir =>
    walkSync(path.join(dir, subdir), callback, [...parentDirNames, subdir]),
  );
}

logSection('Preparing the directory for rendered files');
fs.ensureDirSync(RENDERED_FILES_DIR);
fs.emptyDirSync(RENDERED_FILES_DIR);

logSection('Copying static files');
if (fs.existsSync(STATIC_FILES_DIR)) {
  walkSync(STATIC_FILES_DIR, (parentDirNames, dirNames, fileNames) => {
    let relativeDirPath = path.join(...parentDirNames);

    dirNames.forEach(name => {
      fs.mkdirSync(path.join(RENDERED_FILES_DIR, relativeDirPath, name));
    });

    fileNames.forEach(name => {
      let relativePath = path.join(relativeDirPath, name);
      console.log(`copying '${relativePath}'`);
      fs.copyFileSync(
        path.join(STATIC_FILES_DIR, relativePath),
        path.join(RENDERED_FILES_DIR, relativePath),
      );
    });
  });
}

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
let palette = flattenObj(materialColors);

console.log('loading lesson colors file');
let lessonColors = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-colors.json'),
);
Object.keys(lessonColors).forEach(lessonName => {
  let [back, fore] = lessonColors[lessonName];
  lessonColors[lessonName] = [palette[back], palette[fore]];
});

console.log('loading lesson times file');
let lessonTimes = fs.readJsonSync(
  path.join(DATA_FILES_DIR, 'lesson-times', 'Basis.json'),
);

function compileScss({ name, compiledName }) {
  console.log(`compiling stylesheet '${name}' to '${compiledName}'`);
  let destPath = path.join(RENDERED_FILES_DIR, compiledName);

  let result = sass.renderSync({
    file: path.join(STYLESHEETS_DIR, name),
    outFile: destPath,
    sourceMap: true,
    outputStyle: 'compressed',
  });

  fs.writeFileSync(destPath, result.css);
  fs.writeFileSync(`${destPath}.map`, result.map);
}

logSection('Compiling stylesheets');
if (fs.existsSync(STYLESHEETS_DIR)) {
  walkSync(STYLESHEETS_DIR, (parentDirNames, dirNames, fileNames) => {
    let relativeDirPath = path.join(...parentDirNames);

    dirNames.forEach(name => {
      fs.mkdirSync(path.join(RENDERED_FILES_DIR, relativeDirPath, name));
    });

    fileNames.forEach(name => {
      let extName = path.extname(name);
      if (extName === '.scss') {
        let baseName = path.basename(name, extName);
        let relativePath = path.join(relativeDirPath, name);
        compileScss({
          name: relativePath,
          compiledName: path.join(relativeDirPath, `${baseName}.css`),
        });
      }
    });
  });
}

logSection('Rendering lesson data files');

function renderTemplate({ name, renderedName, context }) {
  console.log(`rendering template '${name}' to '${renderedName}'`);

  // eslint-disable-next-line global-require
  let templateFunction = require(path.join(TEMPLATES_DIR, name));
  let renderedDom = templateFunction({
    relativeRoot: path.relative(path.dirname(renderedName), '.') || '.',
    ...context,
  });

  let text = `<!DOCTYPE html>${renderedDom.outerHTML}`;

  text = htmlMinifier.minify(text, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  fs.writeFileSync(path.join(RENDERED_FILES_DIR, renderedName), text);
}

if (fs.existsSync(LESSON_DATA_FILES_DIR)) {
  walkSync(LESSON_DATA_FILES_DIR, (parentDirNames, dirNames, fileNames) => {
    let relativeDirPath = path.join(...parentDirNames);
    let contents = [];

    dirNames.forEach(name => {
      fs.mkdirSync(path.join(RENDERED_FILES_DIR, relativeDirPath, name));
      contents.push({ isDir: true, name });
    });

    fileNames.forEach(name => {
      let extName = path.extname(name);
      if (extName === '.json') {
        let baseName = path.basename(name, extName);
        let relativePath = path.join(relativeDirPath, name);
        console.log(`generating timetable from '${relativePath}'`);
        let lessons = fs.readJsonSync(
          path.join(LESSON_DATA_FILES_DIR, relativePath),
        );
        renderTemplate({
          name: 'Timetable',
          renderedName: path.join(relativeDirPath, `${baseName}.html`),
          context: {
            dirNames: parentDirNames,
            name: baseName,
            lessonColors,
            lessonTimes,
            lessons,
          },
        });
        contents.push({ name: baseName, isDir: false });
      }
    });

    console.log(`generating index for directory '${relativeDirPath}'`);
    renderTemplate({
      name: 'DirectoryIndex',
      renderedName: path.join(relativeDirPath, 'index.html'),
      context: {
        dirNames: parentDirNames,
        contents,
      },
    });
  });
}
