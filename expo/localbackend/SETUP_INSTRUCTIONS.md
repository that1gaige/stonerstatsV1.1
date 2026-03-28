# Local Backend Setup Instructions

## Quick Setup

1. **Navigate to the localbackend folder:**
   ```bash
   cd localbackend
   ```

2. **Create package.json** (copy this content to `package.json`):
   ```json
   {
     "name": "stonerstats-localbackend",
     "version": "1.0.0",
     "description": "Local backend server for StonerStats app",
     "main": "index.js",
     "scripts": {
       "start": "node index.js",
       "dev": "node index.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "body-parser": "^1.20.2",
       "bcryptjs": "^2.4.3",
       "uuid": "^9.0.1"
     },
     "keywords": ["backend", "api", "stonerstats"],
     "author": "",
     "license": "MIT"
   }
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the server:**
   ```bash
   node index.js
   ```
   OR double-click `start_server.bat` on Windows

## What Went Wrong

Your Desktop copy of localbackend is missing:
- ❌ `package.json` (defines what packages to install)
- ❌ `node_modules` folder (the actual packages)

## The Fix

**Option 1: Copy the ENTIRE localbackend folder**
- Copy the ENTIRE localbackend folder from your project to Desktop
- Make sure it includes package.json

**Option 2: Create package.json manually**
1. Open Notepad
2. Paste the JSON content above
3. Save as `package.json` in the localbackend folder
4. Run `npm install` in that folder
5. Run `start_server.bat`

**Option 3: Run from project folder (EASIEST)**
Just run the server directly from your project:
```bash
cd /path/to/your/rork-project/localbackend
npm install
node index.js
```

## Current Server URL

After fixing and running, your server will be at:
- **http://192.168.10.226:4000** (latest)
- **http://[previous-ip]:4000** (if IP changed)

Add both to your app's connection options.
