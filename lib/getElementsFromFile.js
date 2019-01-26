const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = async (htmlFile, tagnames = []) => {
  const dom = await JSDOM.fromFile(htmlFile);
  const { document } = dom.window;
  return tagnames.reduce(
    (acc, curr) => acc.concat(Array.from(document.querySelectorAll(curr))),
    []
  );
};
