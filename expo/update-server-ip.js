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

  const pcBlockRegex = /(id:\s*'PC'[\s\S]*?url:\s*')http:\/\/[^']+(')/;
  const match = content.match(pcBlockRegex);

  if (match) {
    const updatedUrl = `http://${newIP}:${serverPort}`;
    content = content.replace(pcBlockRegex, `$1${updatedUrl}$2`);

    fs.writeFileSync(configPath, content, 'utf8');

    console.log('✅ Updated successfully!');
    console.log(`   Updated PC Server URL -> ${updatedUrl}`);
    console.log('\n📱 Restart your Expo app to use the new IP.');
    console.log('\n💡 Tip: Your device must be on the same WiFi network as this computer.');
  } else {
    console.log('⚠️  Could not find PC Server block in config file.');
    console.log('   Manually update the "PC" entry in constants/localBackendConfig.ts');
    console.log(`   Set url to: http://${newIP}:${serverPort}`);
  }
} catch (error) {
  console.error('❌ Error updating config:', error.message);
  process.exit(1);
}
