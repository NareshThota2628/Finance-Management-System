const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const TEMP_DIR = path.join(__dirname, '../../temp');

const saveFile = (fileName, data) => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const filePath = path.join(TEMP_DIR, fileName);
  fs.writeFileSync(filePath, data);
  logger.info(`File saved: ${filePath}`);
  return filePath;
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logger.info(`File deleted: ${filePath}`);
  }
};

module.exports = { saveFile, deleteFile };