# school-timetables

[![Build Status](https://travis-ci.com/dmitmel/school-timetables.svg?branch=master)](https://travis-ci.com/dmitmel/school-timetables)

## Idea

Every school has a timetable which they often print (or make available in other way) so that students and teachers can quickly see what lessons they have today. Some schools even make their timetables available in a digital format, in particular the school I go to (as of writing). Our school's management share timetables as five different PDF documents with tables, one for each weekday, where every column corresponds to a lesson number and every row corresponds to a class. These tables are very handy because they are available right on your phone and almost everyone nowadays has a smartphone (at least in my country). However, _the format of these tables is inconvenient for students_ because as a student you likely don't care about other classes (especially if you don't have siblings who go to the same school as you do) and their lessons for today, _instead you want to see a timetable only for your class, preferably in a single document_.

I developed this project as a solution for this problem. **The idea is that I write simple data files with timetables for each class, then run a script that compiles them into simple HTML pages with tables.** I chose to use HTML because everyone has a web browser.

## Features

- The build script generates a fully static website
- HTML and CSS files are minified and are a few kilobytes at average (so it loads just fine on crappy mobile networks in Ukraine)
- Data files (school definitions, timetables etc) are written in [JSON5](https://json5.org/) (basically [JSON](http://json.org/) with some nice extensions)
- HTML pages don't make any assumptions about the directory structure or locations of served files on the server (I use relative URLs), so you can literally put them on any web server.
- Website works on both mobile and desktop
- Website uses no JavaScript at all (and can work with "NoJS" browser plugins)
- File manager-like navigation (timetables are organized in folders)
- Every timetable page has a link to a page with a version of this timetable suitable for printing

## Planned features

- Localization (right now the entire website is in Ukrainian)
- Rewrite templating engine (more on that later)
- Test the build script on MS Windows

## Architecture overview

The build script is written in JavaScript and runs on [Node.js](https://nodejs.org/), I chose this language because of the existing ecosystem of needed libraries. This script renders data files into static HTML pages in the `rendered/` directory and performs the following tasks:

1. Loads global data files from the `data/` directory. These are independent of different schools, data in them is applied to the whole website.
2. Loads school data files from the `data/schools/` directory. They describe specific schools, data in them is applied to timetables of their schools.
3. Copies asset files from the `assets/` directory. Assets are copied as-is and are not modified in any way.
4. Compiles [SCSS](https://sass-lang.com/) stylesheets in the `styles/` directory.
5. Renders lesson data files from the `data/lessons/` directory using templates from the `templates/` directory.

The last step is the most interesting one.

First of all, I not only render timetable pages, but also index files for each directory. The build script replicates the directory structure of files in the `data/lessons/` directory and generates an `index.html` for each one with a list of files in this. These index files contain a list of subdirectories and files in each directory, and also a breadcrumbs-style navigation bar for jumping to parent directories.

I chose to use templates because of the simplicity and tiny file size of a static frontend built with templates. I wanted to write templates with logic embedded in them, so the closest existing library to my requirements was [Nunjucks](https://mozilla.github.io/nunjucks/). I used it at first, but wasn't satisfied with its templating language. I wanted to use something like what the [React](https://reactjs.org/) web framework had done with [JSX](https://reactjs.org/docs/introducing-jsx.html) - I wanted to embed HTML markup in JS files. I then tried to use a library called [HyperScript](https://github.com/hyperhype/hyperscript) which basically provides a simple function which can generate HTML markup, just look at the examples in its README and you'll understand. However, I wasn't satisfied with using a library for such a simple task, so I reverse-engineered HyperScript and its dependencies and came up with my own template rendering library.

I ended up with the following: templates are simply JavaScript files that export a single function which takes an object with parameters and returns an object similar to [`Node`](https://developer.mozilla.org/en-US/docs/Web/API/Node) in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) of browser JavaScript. This `Node` instance is constructed using the `h` function which is defined in the file `templates/hyperscript.js` and uses a small polyfill for `Node` and some related classes. In my templating engine components are also just functions - no need for fancy syntactic sugar. The build script receives a hierarchy of `Node` objects and constructs HTML markup from them. Quite simple and versatile approach indeed.

In the end I'm happy with what I created - my templating library is pretty usable. A possible improvement might be to use the JSX syntax extensions, however that would require setting up the [Babel](https://babeljs.io/) JavaScript compiler.

## Private use at your school or other educational institution

**NOTE:** This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) (see the [`LICENSE`](https://github.com/dmitmel/school-timetables/blob/master/LICENSE) file) which allows private use. Just keep in mind that it will be nice if you help me and [contribute to this project](https://github.com/dmitmel/school-timetables/pull/new).

1. Grab a copy of source files either by cloning this repository or downloading an archive.
2. Install dependencies by executing `yarn install` (or `npm install`) in the project directory.
3. Compile the project by executing `yarn build` (or `npm run build` or `node build.js`) in the project directory. Website files are going to be in the `rendered/` directory.
4. Somehow make HTML pages available for school staff and students, for example by running an HTTP server. I'd recommend using some production-grade solutions like [Apache HTTP server](https://httpd.apache.org/) or [Nginx](https://www.nginx.com/).
5. An alternative approach would be to use a development HTTP server, for example the [`http-server`](https://github.com/http-party/http-server) for Node.js which I use personally, then serve the `rendered/` directory locally and print all timetables to PDFs, and then distribute those.

**NOTE:** Remember that you'd have to keep up with updates to my version of this project.

## Contributing

First of all fork this repository and clone it.

Here are some useful commands:

```shell
yarn install  # install dependencies
yarn build    # build website files
yarn start    # serve contents of the rendered/ directory with a development HTTP server
yarn dev      # start a development server which will rebuild website files on any source file change
```

Make sure to follow my coding style (checked with [ESLint](https://eslint.org/)) and use my formatting (checked with [Prettier](https://prettier.io/)).

### Quick guide on adding timetables for your school

Remember to format created data files with Prettier.

1. Create a data file for your school in `data/schools/`
2. Create directory structure for your timetables in `data/lessons/`. Create it so that when you later have to add new timetables you won't break existing links. I use the following path for example: `data/lessons/<school>/<year>/<semester>`
3. Write JSON5 lesson data files for your timetables in the created directory structure.
4. If you add new lessons - define colors for them `data/lessonColors.json5`. This file maps lesson names to a pair of colors (background and foreground) from the [Material Palette](https://material.io/resources/color/). Keep in mind that not every lesson needs a color.

## License

see the [`LICENSE`](https://github.com/dmitmel/school-timetables/blob/master/LICENSE) file.
