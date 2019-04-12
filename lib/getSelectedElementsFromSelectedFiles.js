const path = require('path');

const getElementsFromFile = require('./getElementsFromFile.js');

module.exports = async (htmlFiles, selectors) => {
  function getIdOrParentId(node) {
    if (node.id || node.tagName === 'body') {
      return node.id;
    }
    return getIdOrParentId(node.parentElement);
  }

  try {
    const allPromises = htmlFiles.map(async (file, i) => {
      const fileElements = await getElementsFromFile(file, selectors);
      return fileElements.map(({ el, level }) => ({
        el,
        text: el.textContent,
        id: getIdOrParentId(el),
        fileID: i,
        page: path.basename(htmlFiles[i].split('.')[0]),
        level,
      }));
    });
    const data = await Promise.all(allPromises);
    return data.reduce((acc, curr) => [...acc, ...curr], []);
  } catch (e) {
    throw new Error(e);
  }
};
