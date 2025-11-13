@echo off
echo ================================
echo StonerStats Local Backend Server
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

REM Create data directory if it doesn't exist
if not exist "data" (
    echo [INFO] Creating data directory...
    mkdir data
)

REM Initialize JSON files if they don't exist
if not exist "data\users.json" (
    echo [] > data\users.json
)
if not exist "data\strains.json" (
    echo [] > data\strains.json
)
if not exist "data\sessions.json" (
    echo [] > data\sessions.json
)

echo [INFO] Starting StonerStats Backend Server...
echo.
node index.js

pause
