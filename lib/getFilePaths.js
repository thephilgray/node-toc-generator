const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const asyncReaddir = promisify(fs.readdir);
module.exports = async (dirname, extname) => {
  const dirPath = path.isAbsolute(dirname)
    ? dirname
    : path.resolve(process.cwd(), dirname);
  const files = await asyncReaddir(dirPath);
  return files.filter(filename => filename.indexOf(extname) > 0);
};
