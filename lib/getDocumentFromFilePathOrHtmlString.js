const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = async filePathOrHtmlString => {
  const isHtmlString = /<("[^"]*"|'[^']*'|[^'">])*>/.test(filePathOrHtmlString);
  try {
    const dom = isHtmlString
      ? await new JSDOM(filePathOrHtmlString)
      : await JSDOM.fromFile(filePathOrHtmlString);
    const { document } = dom.window;
    return document;
  } catch (e) {
    throw new Error(e);
  }
};
