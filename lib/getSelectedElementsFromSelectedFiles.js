const path = require('path');

const getElementsFromFile = require('./getElementsFromFile.js');

module.exports = async (filePaths, selectors) => {
  const allPromises = filePaths.map(async (file, i) => {
    const fileElements = await getElementsFromFile(file, selectors);
    return fileElements.map(el => ({
      el,
      text: el.textContent,
      id: el.id,
      fileID: i,
      page: path.basename(filePaths[i].split('.')[0]),
    }));
  });
  const data = await Promise.all(allPromises);
  return data.reduce((acc, curr) => [...acc, ...curr], []);
};
