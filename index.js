const path = require('path');
const getFilePaths = require('./lib/getFilePaths.js');
const getSelectedElementsFromSelectedFiles = require('./lib/getSelectedElementsFromSelectedFiles.js');

const defaultProps = {
  extensions: ['html'],
  headings: ['h1', 'h2', 'h3', 'h4', 'h5'],
};
module.exports = async (
  pagesDir,
  extensions = defaultProps.extensions,
  headings = defaultProps.headings
) => {
  try {
    const filePaths = await getFilePaths(pagesDir, extensions);
    // TODO: need to return the full filePaths for convenience
    // temporary workaround:
    const fullFilePaths = filePaths.map(filePath =>
      path.join(pagesDir, filePath)
    );
    const data = await getSelectedElementsFromSelectedFiles(
      fullFilePaths,
      headings
    );
    return data;
  } catch (e) {
    throw new Error(e);
  }
};
