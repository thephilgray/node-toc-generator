const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const jsdom = require('jsdom');
const getFilePaths = require('../lib/getFilePaths.js');
const getElementsFromFile = require('../lib/getElementsFromFile.js');
const getDocumentFromFilePathOrHtmlString = require('../lib/getDocumentFromFilePathOrHtmlString.js');
const getSelectedElementsFromSelectedFiles = require('../lib/getSelectedElementsFromSelectedFiles.js');
const {
  getTocDataFromDir,
  getTocDataFromArrayOfHtmlPathsOrStrings,
} = require('../index');

const testHTMLFilenames = [
  'page001.html',
  'page002.html',
  'page003.html',
  'page004.html',
];

const headingTagnames = ['h1', 'h2', 'h3', 'h4', 'h5'];

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
  const tagnames = headingTagnames;
  const getInstanceNames = HTMLElementsArray =>
    HTMLElementsArray.map(el => el.el.constructor.name);

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
    expect(actual[2].el.tagName).toEqual('H3');
    expect(actual[3].el.tagName).toEqual('H3');
  });

  it('accepts other types elements and returns them in order of tagnames array', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[2]);
    const actual = await getElementsFromFile(
      htmlFile,
      tagnames.concat(['main', 'article'])
    );

    // should be an array of html elements
    expect(actual[5].el.tagName).toEqual('ARTICLE');
  });

  it('accepts classnames in the selectors array', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[1]);
    const actual = await getElementsFromFile(htmlFile, ['.h1', '.h2', '.h3']);

    const expected = [
      'HTMLHeadingElement',
      'HTMLHeadingElement',
      'HTMLHeadingElement',
    ];

    // should be an array of html elements
    expect(getInstanceNames(actual)).toEqual(expected);
  });

  it('accepts an id prefix in the selectors array', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[3]);
    const actual = await getElementsFromFile(htmlFile, ['#toc-']);

    const expected = [
      'HTMLHeadingElement',
      'HTMLHeadingElement',
      'HTMLHeadingElement',
    ];

    // should be an array of html elements
    expect(getInstanceNames(actual)).toEqual(expected);
  });

  it('also accepts a string value in place of an array of selectors', async () => {
    const htmlFile = path.join(__dirname, 'fixtures', testHTMLFilenames[3]);
    const actual = await getElementsFromFile(htmlFile, '#toc-');

    const expected = [
      'HTMLHeadingElement',
      'HTMLHeadingElement',
      'HTMLHeadingElement',
    ];

    // should be an array of html elements
    expect(getInstanceNames(actual)).toEqual(expected);
  });
});

// ? not necessary or can be moved to helper
// returns a map of all the elements for each tagname
// should thow an error if any of the tagnames have the same id
// should return an array of objects for each of the elements

describe('getSelectedElementsFromSelectedFiles', () => {
  const { JSDOM } = jsdom;
  const filePaths = testHTMLFilenames.map(p =>
    path.join(__dirname, 'fixtures', p)
  );

  it('returns a flat array of all selected elements from all selected files', async () => {
    const dom1 = new JSDOM(`<h1 id="firstHeading">First Heading</h1>
      <h2 id="secondHeading">Second Heading</h2>
      <h2 id="thirdheading">Third Heading</h2>`);

    const dom2 = new JSDOM(`<h1 id="fourthHeading" class="h1">Fourth Heading</h1>
      <h2 id="fifthHeading" class="h2">Fifth Heading</h2>
      <h3 id="sixthHeading" class="h3">Sixth Heading</h3>`);

    const dom3 = new JSDOM(`<h1 id="fourthHeading">Fourth Heading</h1>
          <h2 id="fifthHeading">Fifth Heading</h2>
          <h3 id="sixthHeading">Sixth Heading</h3>
          <h3 id="seventhHeading">SeventhHeading</h3>`);
    const dom4 = new JSDOM(`<h1 id="toc-1">Heading 1</h1>
          <h2 id="toc-2">Heading 2</h2>
          <h2 id="toc-3">Heading 3</h2>`);

    const allFiles = [dom1, dom2, dom3, dom4];

    const expected = allFiles.reduce((acc, dom, i) => {
      const page = [...dom.window.document.body.children];
      const mapped = page.map(el => ({
        el,
        text: el.textContent,
        id: el.id,
        fileID: i,
        page: testHTMLFilenames[i].split('.')[0],
        level: headingTagnames.indexOf(el.tagName.toLowerCase()) + 1,
      }));
      return [...acc, ...mapped];
    }, []);

    const actual = await getSelectedElementsFromSelectedFiles(
      filePaths,
      headingTagnames
    );

    expect(actual).toContainEqual(...expected);
  });
  it('still works if the selectors array is a string', async () => {
    const dom1 = new JSDOM(`
      <h2 id="secondHeading">Second Heading</h2>
      <h2 id="thirdheading">Third Heading</h2>`);

    const dom2 = new JSDOM(`
      <h2 id="fifthHeading" class="h2">Fifth Heading</h2>
      `);

    const dom3 = new JSDOM(`
          <h2 id="fifthHeading">Fifth Heading</h2>`);
    const dom4 = new JSDOM(`<h2 id="toc-2">Heading 2</h2>
          <h2 id="toc-3">Heading 3</h2>`);

    const allFiles = [dom1, dom2, dom3, dom4];

    const expected = allFiles.reduce((acc, dom, i) => {
      const page = [...dom.window.document.body.children];
      const mapped = page.map(el => ({
        el,
        text: el.textContent,
        id: el.id,
        fileID: i,
        page: testHTMLFilenames[i].split('.')[0],
        level: 1,
      }));
      return [...acc, ...mapped];
    }, []);

    const actual = await getSelectedElementsFromSelectedFiles(filePaths, 'h2');

    expect(actual).toMatchObject(expected);
  });
});

// 3.

// accepts either a path to an html file or a string of html and returns a jsom document

describe('getDocumentFromFilePathOrHtmlString', () => {
  const { JSDOM } = jsdom;
  const filePath = path.join(__dirname, 'fixtures', testHTMLFilenames[0]);

  test('should accept a path to an html file and return a jsdom document', async () => {
    const dom = await JSDOM.fromFile(filePath);
    const expected = dom.window.document;
    const actual = await getDocumentFromFilePathOrHtmlString(filePath);
    expect(actual).toEqual(expected);
  });

  test('should accept a string of html and return a jsdom document', async () => {
    const dom = await JSDOM.fromFile(filePath);
    const expected = dom.window.document;
    const readFile = promisify(fs.readFile);
    const buffer = await readFile(filePath, 'UTF-8');
    const htmlString = buffer.toString();
    const actual = await getDocumentFromFilePathOrHtmlString(htmlString);
    expect(actual).toEqual(expected);
  });
});

// 4. test implementation

describe('getTocDataFromDir', () => {
  test('should return the flattened array with objects for each element', async () => {
    const actual = await getTocDataFromDir('__tests__/fixtures');
    expect(actual).toHaveLength(13);
  });
  test('should return the data sorted by fileID and then level', async () => {
    const data = await getTocDataFromDir('__tests__/fixtures');
    const mappedHeadingText = arr => arr.map(el => el.text);
    const actual = mappedHeadingText(data);
    const expected = [
      'First Heading',
      'Second Heading',
      'Third Heading',
      'Fourth Heading',
      'Fifth Heading',
      'Sixth Heading',
      'Fourth Heading',
      'Fifth Heading',
      'Sixth Heading',
      'SeventhHeading',
      'Heading 1',
      'Heading 2',
      'Heading 3',
    ];
    expect(actual).toMatchObject(expected);
  });
});

describe('getTocDataFromArrayOfHtmlPathsOrStrings', () => {
  const filePath = path.join(__dirname, 'fixtures', testHTMLFilenames[0]);
  test('should return data from an array of html strings', async () => {
    const readFile = promisify(fs.readFile);
    const buffer = await readFile(filePath, 'UTF-8');
    const htmlArray = [buffer.toString()];
    const mappedHeadingText = arr => arr.map(el => el.text);
    const expected = ['First Heading', 'Second Heading', 'Third Heading'];
    const actualData = await getTocDataFromArrayOfHtmlPathsOrStrings(htmlArray);
    const actual = mappedHeadingText(actualData);

    expect(actual).toEqual(expected);
  });
});

// TODO: include an actual template generator function for CLI usage, but export getTocDataFromDir and templateGen separately
