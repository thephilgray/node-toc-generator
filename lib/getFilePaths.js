const fs = require('fs');
const { promisify } = require('util');

const asyncReaddir = promisify(fs.readdir);
module.exports = async (dirname, extname) => {
  const files = await asyncReaddir(dirname);
  return files.filter(filename => filename.indexOf(extname) > 0);
};
