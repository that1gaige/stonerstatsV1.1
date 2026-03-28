const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'stonerstats-local-key-change-in-production-32bytes!!';
const ALGORITHM = 'aes-256-cbc';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureUserDir(userId) {
  const userDir = path.join(DATA_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

function getFilePath(fileName) {
  ensureDataDir();
  return path.join(DATA_DIR, fileName);
}

function getUserFilePath(userId, fileName) {
  const userDir = ensureUserDir(userId);
  return path.join(userDir, fileName);
}

function encrypt(text) {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error.message);
    return text;
  }
}

function decrypt(text) {
  try {
    const parts = text.split(':');
    if (parts.length !== 2) return text;
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return text;
  }
}

function readJSONFile(fileName, encrypted = false) {
  const filePath = getFilePath(fileName);
  
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content || content.trim() === '') {
      return [];
    }
    
    if (encrypted) {
      content = decrypt(content);
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return [];
  }
}

function writeJSONFile(fileName, data, encrypted = false) {
  const filePath = getFilePath(fileName);
  
  try {
    let content = JSON.stringify(data, null, 2);
    
    if (encrypted) {
      content = encrypt(content);
    }
    
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error.message);
    return false;
  }
}

function readUserJSONFile(userId, fileName, encrypted = false) {
  const filePath = getUserFilePath(userId, fileName);
  
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content || content.trim() === '') {
      return [];
    }
    
    if (encrypted) {
      content = decrypt(content);
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading user file ${userId}/${fileName}:`, error.message);
    return [];
  }
}

function writeUserJSONFile(userId, fileName, data, encrypted = false) {
  const filePath = getUserFilePath(userId, fileName);
  
  try {
    let content = JSON.stringify(data, null, 2);
    
    if (encrypted) {
      content = encrypt(content);
    }
    
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error writing user file ${userId}/${fileName}:`, error.message);
    return false;
  }
}

module.exports = {
  readJSONFile,
  writeJSONFile,
  readUserJSONFile,
  writeUserJSONFile,
  encrypt,
  decrypt
};
