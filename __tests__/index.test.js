const path = require('path');
const getFilePaths = require('../lib/getFilePaths.js');

// 1.
describe('getFilePaths', () => {
  // accepts a directory and an extension name and returns a list of file paths
  it('accepts a directory and an extension name and returns a list of file paths', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const expected = ['page001.html', 'page002.html'];
    const actual = await getFilePaths(srcPath, '.html');
    expect(expected).toEqual(actual);
  });
  // the directory name can be relative or absolute
  it('accepts a relative or absolute path to the directory', async () => {
    const srcPath = '__tests__/fixtures';
    const expected = ['page001.html', 'page002.html'];
    const actual = await getFilePaths(srcPath, '.html');
    expect(expected).toEqual(actual);
  });
  // the extension name can contain a '.' or not
  it('accepts the extension name argument with or without "."', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const extensionName = 'html';
    const expected = ['page001.html', 'page002.html'];
    const actual = await getFilePaths(srcPath, extensionName);
    expect(expected).toEqual(actual);
  });
  // can also accept an array of extension names
  it('accepts the extension name argument as an array of extension names', async () => {
    const srcPath = path.join(__dirname, 'fixtures');
    const extensionName = ['html', '.css'];
    const expected = ['page001.html', 'page002.html', 'style.css'];
    const actual = await getFilePaths(srcPath, extensionName);
    expect(expected).toEqual(actual);
  });

  // opts: can return a list of relative file paths or absolute, or just the filenames
  // ? is this necessary? the user already supplied a directory and can derrive the absolute paths, or paths relative to cwd from that, or we can make a helper function for that
});

// 2.
// accepts a filename/filepath and an array of element tagnames
// returns a map of all the elements for each tagname
// should thow an error if any of the tagnames have the same id
// should return an array of objects for each of the elements

// 3.
// accepts an array of dom (?) elements and returns a map
// the id of each element should be the key
// should throw an error if it encounters duplicate IDs

// 4.
// accepts multiple arrays
