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
const serverPort = process.env.LOCALBACKEND_PORT || '4000';
const scriptDir = path.dirname(process.argv[1] || '.');
const configPath = path.join(scriptDir, 'constants', 'localBackendConfig.ts');

console.log('\n🔧 Updating server IP configuration...');
console.log(`New IP: ${newIP}:${serverPort}`);

try {
  let content = fs.readFileSync(configPath, 'utf8');

  const localBlockRegex = /(id:\s*'local'[\s\S]*?url:\s*')http:\/\/[^']+(')/;
  const match = content.match(localBlockRegex);

  if (match) {
    const updatedUrl = `http://${newIP}:${serverPort}`;
    content = content.replace(localBlockRegex, `$1${updatedUrl}$2`);

    fs.writeFileSync(configPath, content, 'utf8');

    console.log('✅ Updated successfully!');
    console.log(`   Updated Local Server URL -> ${updatedUrl}`);
    console.log('\n📱 Restart your Expo app to use the new IP.');
  } else {
    console.log('⚠️  Could not find Local Server block in config file.');
    console.log('   Please update manually in constants/localBackendConfig.ts');
  }
} catch (error) {
  console.error('❌ Error updating config:', error.message);
  process.exit(1);
}
