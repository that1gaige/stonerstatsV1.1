# StonerStats Local Backend Server

A self-contained Node.js/Express backend server for the StonerStats mobile app with JSON-based storage.

## Features

- REST API for authentication, strains, and sessions
- JSON file-based database
- Network accessible
- CORS enabled
- Windows batch file launcher
- Optional standalone .exe build

## Quick Start

### Using Batch File
1. Double-click `start_server.bat`
2. Server will run at `http://localhost:4000`

### Manual Start
```bash
cd localbackend
npm install
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Strains
```
GET    /api/strains
GET    /api/strains/:id
POST   /api/strains
PUT    /api/strains/:id
DELETE /api/strains/:id
```

### Sessions
```
GET    /api/sessions
GET    /api/sessions/:id
POST   /api/sessions
PUT    /api/sessions/:id
DELETE /api/sessions/:id
```

## Connecting from Mobile

Find your local IP:
```bash
ipconfig
```

Use `http://YOUR_IP:4000` instead of localhost.

## Building EXE

Double-click `build_windows_exe.bat` or run:
```bash
npm run build-exe
```

## Data Storage

All data is stored in JSON files:
- `data/users.json`
- `data/strains.json`
- `data/sessions.json`

## Troubleshooting

- Ensure Node.js is installed
- Check firewall settings for network access
- Verify devices are on same WiFi network
- Check port 4000 is not in use

## Security Notes

This is a LOCAL development server. Do not expose to internet without additional security.
