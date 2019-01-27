const path = require('path');

const getElementsFromFile = require('./getElementsFromFile.js');

module.exports = async (filePaths, selectors) => {
  try {
    const allPromises = filePaths.map(async (file, i) => {
      const fileElements = await getElementsFromFile(file, selectors);
      return fileElements.map(({ el, level }) => ({
        el,
        text: el.textContent,
        id: el.id,
        fileID: i,
        page: path.basename(filePaths[i].split('.')[0]),
        level,
      }));
    });
    const data = await Promise.all(allPromises);
    return data.reduce((acc, curr) => [...acc, ...curr], []);
  } catch (e) {
    throw new Error(e);
  }
};
