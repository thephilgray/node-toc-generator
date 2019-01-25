const fs = require('fs');
const { promisify } = require('util');
const jsdom = require('jsdom');
const pug = require('pug');

const { JSDOM } = jsdom;
const asyncReaddir = promisify(fs.readdir);

// const filename = 'src/page001.html';
const levels = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5 };
//   get a list of tag names to iterate over
const tags = Object.keys(levels);

async function getAllTagsFromFile(filename, pageNumber) {
  const dom = await JSDOM.fromFile(filename, { includeNodeLocations: true });
  const { document } = dom.window;
  return tags.reduce(async (prevPromise, tag) => {
    const acc = await prevPromise;
    const currentTags = Array.from(document.querySelectorAll(tag));
    currentTags.forEach(heading => {
      if (acc[heading.id]) {
        throw new Error(`Duplicate IDs for ${heading.id}`);
      }
      acc[heading.id] = {
        text: heading.textContent,
        id: heading.id,
        link: `${filename}#${heading.id}`,
        level: levels[tag],
        pageNumber,
      };
    });
    return acc;
  }, Promise.resolve({}));
}

/* TODO: Do not hardcode `src` */
/* TODO: only get HTML files */

async function buildMap() {
  const files = await asyncReaddir('src');
  const allPromises = files.map(async (file, i) => {
    const pageNumber = i + 1;
    return getAllTagsFromFile(`src/${file}`, pageNumber);
  });
  const data = await Promise.all(allPromises);
  return data.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

buildMap().then(data => {
  const options = {};
  const fn = pug.compileFile('./templates/toc.pug', options);
  const html = fn({ headings: Object.values(data) });
  fs.writeFile('toc.html', html, err => {
    if (err) throw new Error(err);
    console.log(`Written to toc.html`);
  });
});
