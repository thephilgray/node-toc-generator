const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = async (htmlFile, tagnames = []) => {
  const dom = await JSDOM.fromFile(htmlFile);
  const { document } = dom.window;
  const selectors = [].concat(tagnames); // ensures it's always an array even if the user passes a string value

  const isIDPrefix = selector =>
    selector.indexOf('#') === 0 &&
    selector.indexOf('-') === selector.length - 1;

  const selectorOrIDPrefix = selector =>
    isIDPrefix(selector) ? `[id^=${selector.slice(1)}]` : selector;

  const getLevel = selector =>
    isIDPrefix(selector)
      ? selector.split('-').pop() // to use this feature, the selector id must be in the format of /#+[\w]+\-[\d]/
      : selectors.indexOf(selector) + 1;

  return selectors.reduce(
    (acc, curr) => [
      ...acc,
      ...Array.from(document.querySelectorAll(selectorOrIDPrefix(curr))).map(
        el => ({ el, level: getLevel(curr) })
      ),
    ],
    []
  );
};
