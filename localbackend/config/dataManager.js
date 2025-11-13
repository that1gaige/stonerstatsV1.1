const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(fileName) {
  ensureDataDir();
  return path.join(DATA_DIR, fileName);
}

function readJSONFile(fileName) {
  const filePath = getFilePath(fileName);
  
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content || content.trim() === '') {
      return [];
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return [];
  }
}

function writeJSONFile(fileName, data) {
  const filePath = getFilePath(fileName);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error.message);
    return false;
  }
}

module.exports = {
  readJSONFile,
  writeJSONFile
};
