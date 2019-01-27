const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const asyncReaddir = promisify(fs.readdir);
module.exports = async (dirname, extensions = []) => {
  // dirname expects an absolute path
  // if the user supplies a relative path, we will handle this on their behalf
  const dirPath = path.isAbsolute(dirname)
    ? dirname
    : path.resolve(process.cwd(), dirname);
  // extensions parameter expects an array of extension names with the '.'
  // if the user passes a string or a list without the '.', we will handle this on their behalf
  const extensionsArray = []
    .concat(extensions)
    .map(ext => (ext.indexOf('.') === 0 ? ext : `.${ext}`));
  try {
    const files = await asyncReaddir(dirPath);
    return files.filter(filename => {
      const filepath = path.resolve(dirname, filename);
      const filepathExt = path.extname(filepath);

      return extensionsArray.indexOf(filepathExt) > -1;
    });
  } catch (e) {
    throw new Error(e);
  }
};
