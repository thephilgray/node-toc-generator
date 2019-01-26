const path = require('path');

const getFilePaths = require('../lib/getFilePaths.js');

const srcPath = path.join(__dirname, 'fixtures');

// 1.
// accepts a directory and an extension name and returns a list of file paths

describe('getFilePaths', () => {
  it('accepts a directory and an extension name and returns a list of file paths', async () => {
    const expected = ['page001.html', 'page002.html'];
    const actual = await getFilePaths(srcPath, '.html');
    expect(expected).toEqual(actual);
  });
});

// the directory name can be relative or absolute
// the extension name can contain a '.' or not
// can also accept an array of extension names
// opts: can return a list of relative file paths or absolute, or just the filenames

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
