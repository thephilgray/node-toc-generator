const getDocumentFromFilePathOrHtmlString = require('./getDocumentFromFilePathOrHtmlString.js');
const getElementsFromDocument = require('./getElementsFromDocument.js');

module.exports = async (htmlFile, tagnames = []) => {
  try {
    const document = await getDocumentFromFilePathOrHtmlString(htmlFile);
    const elements = await getElementsFromDocument(document, tagnames);
    return elements;
  } catch (e) {
    throw new Error(e);
  }
};
