const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const safeDeleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
  return false;
};

const getFileStats = (filePath) => {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return null;
  }
};

module.exports = {
  ensureDirectoryExists,
  safeDeleteFile,
  getFileStats
};