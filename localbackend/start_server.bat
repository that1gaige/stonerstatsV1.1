@echo off
echo ================================
echo StonerStats Local Backend Server
echo ================================
echo.

cd /d "%~dp0"

echo [INFO] Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

echo [INFO] Syncing Expo client config with your current IP...
node ..\update-server-ip.js
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Could not auto-update Expo config. Update constants\localBackendConfig.ts manually if needed.
) else (
    echo [OK] Expo client config updated.
)
echo.

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        echo [INFO] Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting StonerStats Backend Server...
echo.
node index.js

pause
