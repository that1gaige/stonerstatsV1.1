@echo off
echo ================================
echo TokeTracker - First Time Setup
echo ================================
echo.

echo [INFO] This script will:
echo   1. Create package.json for local backend
echo   2. Install all required dependencies
echo   3. Update server IP configuration
echo   4. Start the server
echo.

cd /d "%~dp0"

echo [INFO] Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
npm --version
echo.

cd localbackend

echo [INFO] Creating package.json...
if not exist "package.json" (
    (
        echo {
        echo   "name": "toketracker-localbackend",
        echo   "version": "1.0.0",
        echo   "description": "Local backend server for TokeTracker app",
        echo   "main": "index.js",
        echo   "scripts": {
        echo     "start": "node index.js"
        echo   },
        echo   "dependencies": {
        echo     "express": "^4.18.2",
        echo     "cors": "^2.8.5",
        echo     "body-parser": "^1.20.2",
        echo     "bcryptjs": "^2.4.3",
        echo     "uuid": "^9.0.0",
        echo     "@trpc/server": "^10.45.0",
        echo     "zod": "^3.22.4"
        echo   }
        echo }
    ) > package.json
    echo [OK] package.json created
) else (
    echo [OK] package.json already exists
)
echo.

echo [INFO] Installing dependencies...
echo [INFO] This may take a minute...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

cd ..

echo [INFO] Updating server IP configuration...
node update-server-ip.js
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Could not auto-update IP
    echo [INFO] You may need to update constants/localBackendConfig.ts manually
)
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo   1. Start the backend: cd localbackend ^& start_server.bat
echo   2. Run the app: npx expo start
echo   3. Scan QR code with Expo Go app
echo.
echo For help, see: SETUP_GUIDE.md
echo ================================
echo.

pause
