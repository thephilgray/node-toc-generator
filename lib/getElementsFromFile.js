const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = async (htmlFile, tagnames = []) => {
  const dom = await JSDOM.fromFile(htmlFile);
  const { document } = dom.window;
  const isIDPrefix = selector =>
    selector.indexOf('#') === 0 &&
    selector.indexOf('-') === selector.length - 1;

  const selectorOrIDPrefix = selector =>
    isIDPrefix(selector) ? `[id^=${selector.slice(1)}]` : selector;

  return []
    .concat(tagnames) // ensures it's always an array even if the user passes a string value
    .reduce(
      (acc, curr) =>
        acc.concat(
          Array.from(document.querySelectorAll(selectorOrIDPrefix(curr)))
        ),
      []
    );
};
