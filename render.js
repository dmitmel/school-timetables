#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');
const klawSync = require('klaw-sync');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
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

let env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(TEMPLATES_DIR),
);
let renderedHtml = env.render('timetable.njk');
fs.writeFileSync(path.join(RENDERED_FILES_DIR, 'index.html'), renderedHtml);
