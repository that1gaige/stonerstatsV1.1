#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const newIP = process.argv[2] || getLocalIPAddress();
const configPath = path.join(__dirname, 'constants', 'localBackendConfig.ts');

console.log('\n🔧 Updating server IP configuration...');
console.log(`New IP: ${newIP}`);

try {
  let content = fs.readFileSync(configPath, 'utf8');
  
  const oldUrlRegex = /url: 'http:\/\/[\d.]+:4000'/;
  const match = content.match(oldUrlRegex);
  
  if (match) {
    const oldUrl = match[0];
    const newUrl = `url: 'http://${newIP}:4000'`;
    content = content.replace(oldUrlRegex, newUrl);
    
    fs.writeFileSync(configPath, content, 'utf8');
    
    console.log('✅ Updated successfully!');
    console.log(`   Old: ${oldUrl}`);
    console.log(`   New: ${newUrl}`);
    console.log('\n📱 Restart your Expo app to use the new IP.');
  } else {
    console.log('⚠️  Could not find IP to replace in config file.');
    console.log('   Please update manually in constants/localBackendConfig.ts');
  }
} catch (error) {
  console.error('❌ Error updating config:', error.message);
  process.exit(1);
}
