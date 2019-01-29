const { src, dest } = require('gulp');
const path = require('path');
const pug = require('gulp-pug');
const { getTocDataFromArrayOfHtmlPathsOrStrings } = require('../../index.js');
const through = require('through2');

// the local data to pass into the pug compiler
const locals = {
  pages: [],
  headings: [],
  title: 'Gulp Example',
};

// stored as a named function for reuse; it will get called twice
const html = () =>
  src('src/*.pug').pipe(
    pug({
      locals,
    })
  );

const compileTemplatesWithDataFromHTML = strings =>
  getTocDataFromArrayOfHtmlPathsOrStrings(strings) // parse the html to get the data
    .then(data => {
      // store the returned data locally
      locals.headings = data;
      locals.title += ` with ${data.length} Headings!`;
      // compile the templates again with the updated data
      html().pipe(dest('out'));
    })
    .catch(e => console.error(e));

// the main function, receives all compiled pug in a stream and pushes the contents to `strings`
// once the stream has ended and all the files have been pushed through, calls `compileTemplatesWithDataFromHTML` with the array of html strings

const getHTMLFromTemplates = () => {
  // just a local array to store strings of html pushed from the through2 stream
  const strings = [];

  return (
    through
      .obj((file, enc, cb) => {
        // push the strings of html to an array
        strings.push(file.contents.toString());
        // push the filenames to another array; TODO: update the lib to handle buffers not strings and return the filenames from the api
        locals.pages.push(path.basename(file.path));
        // let through know that we're done with the current file
        cb(null);
      })
      // ensure it's finished and all files have been processed before attempting to get the data from the html and recompile the templates
      .on('end', () => compileTemplatesWithDataFromHTML(strings))
  );
};

const metaData = () => html().pipe(getHTMLFromTemplates());

exports.default = metaData;
