const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = async (htmlFile, tagnames = []) => {
  const dom = await JSDOM.fromFile(htmlFile);
  const { document } = dom.window;
  //   return Array.from(document.querySelectorAll(tagnames[0])).concat(
  //     Array.from(document.querySelectorAll(tagnames[1]))
  //   );
  return tagnames.reduce(
    (acc, curr) => acc.concat(Array.from(document.querySelectorAll(curr))),
    []
  );
  //   const el = dom.window.document.createElement('h1');
  //   return [el];
};
