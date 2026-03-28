# How to Set Up the Local Backend Server

## Quick Setup (Copy all these files to your Desktop/localbackend folder)

You need to copy **ALL** of these files from the project's `localbackend` folder:

### Required Files:
```
localbackend/
├── package.json (CREATE THIS - see below)
├── index.js
├── start_server.bat
├── trpcAdapter.js
├── config/
│   └── dataManager.js
├── controllers/
│   ├── authController.js
│   ├── strainsController.js
│   └── sessionsController.js
└── routes/
    ├── auth.js
    ├── strains.js
    └── sessions.js
```

## Step 1: Create package.json

In your Desktop/localbackend folder, create a file called `package.json` with this content:

```json
{
  "name": "stonerstats-localbackend",
  "version": "1.0.0",
  "description": "Local backend server for StonerStats app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "bcrypt": "^5.1.1",
    "uuid": "^9.0.1"
  }
}
```

## Step 2: Install Dependencies

Open Command Prompt in the Desktop/localbackend folder and run:
```bash
npm install
```

## Step 3: Run the Server

Double-click `start_server.bat` or run:
```bash
node index.js
```

## Alternative: Run from Project Folder

Instead of copying to Desktop, you can run directly from the project:

1. Open Command Prompt
2. Navigate to your project folder
3. Run:
```bash
cd localbackend
npm install
node index.js
```

## What the Server Will Display:

```
================================
🌿 StonerStats Backend Server
================================
Status: RUNNING
Port: 4000

Access URLs:
  Local:   http://localhost:4000
  Network: http://192.168.10.226:4000

Health Check:
  http://localhost:4000/api/health
================================
```

Copy the Network URL and add it to the app's server selection.
