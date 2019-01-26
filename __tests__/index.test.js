const path = require('path');
const getFilePaths = require('../lib/getFilePaths.js');
const getElementsFromFile = require('../lib/getElementsFromFile.js');

const testHTMLFilenames = ['page001.html', 'page002.html', 'page003.html'];

// 1.
describe('getFilePaths', () => {
  // accepts a directory and an extension name and returns a list of file paths
  it('accepts a directory and an extension name and returns a list of file paths', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const expected = testHTMLFilenames;
    const actual = await getFilePaths(srcPath, '.html');
    expect(expected).toEqual(actual);
  });
  // the directory name can be relative or absolute
  it('accepts a relative or absolute path to the directory', async () => {
    const srcPath = '__tests__/fixtures';
    const expected = testHTMLFilenames;
    const actual = await getFilePaths(srcPath, '.html');
    expect(expected).toEqual(actual);
  });
  // the extension name can contain a '.' or not
  it('accepts the extension name argument with or without "."', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const extensionName = 'html';
    const expected = testHTMLFilenames;
    const actual = await getFilePaths(srcPath, extensionName);
    expect(expected).toEqual(actual);
  });
  // can also accept an array of extension names
  it('accepts the extension name argument as an array of extension names', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const extensionName = ['html', '.css'];
    const expected = testHTMLFilenames.concat('style.css');
    const actual = await getFilePaths(srcPath, extensionName);
    expect(expected).toEqual(actual);
  });

  // opts: can return a list of relative file paths or absolute, or just the filenames
  // ? is this necessary? the user already supplied a directory and can derrive the absolute paths, or paths relative to cwd from that, or we can make a helper function for that
});

// 2.
describe('getElementsFromFile', () => {
  const tagnames = ['h1', 'h2', 'h3', 'h4', 'h5'];
  const getInstanceNames = HTMLElementsArray =>
    HTMLElementsArray.map(el => el.constructor.name);

  // accepts a filename/filepath to an html file and an array of element tagnames
  it('accepts a filename/filepath to an html file and an array of element tagnames and returns an array of elements', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[1]);
    const actual = await getElementsFromFile(htmlFile, tagnames);

    const expected = ['HTMLHeadingElement'];
    // should be an array of html elements
    expect(getInstanceNames(actual)).toEqual(expect.arrayContaining(expected));
  });

  it('returns array of elements for all the targeted tags in the document', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[1]);
    const actual = await getElementsFromFile(htmlFile, tagnames);

    const expected = [
      'HTMLHeadingElement',
      'HTMLHeadingElement',
      'HTMLHeadingElement',
    ];
    // should be an array of html elements
    expect(getInstanceNames(actual)).toEqual(expected);
  });

  it('returns mutliple elements from the same selector', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[2]);
    const actual = await getElementsFromFile(htmlFile, tagnames);

    // should be an array of html elements
    expect(actual[2].tagName).toEqual('H3');
    expect(actual[3].tagName).toEqual('H3');
  });
});

// ? not necessary or can be moved to helper
// returns a map of all the elements for each tagname
// should thow an error if any of the tagnames have the same id
// should return an array of objects for each of the elements
// 3.
// accepts an array of dom (?) elements and returns a map
// the id of each element should be the key
// should throw an error if it encounters duplicate IDs

// 4.
// accepts multiple arrays
