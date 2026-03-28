@echo off
echo ================================
echo StonerStats Backend - Build EXE
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

echo [OK] Node.js found
echo.

REM Install dependencies if needed
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

REM Check if pkg is installed
echo [INFO] Checking for pkg...
call npm list pkg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing pkg...
    call npm install --save-dev pkg
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install pkg!
        pause
        exit /b 1
    )
)

echo [INFO] Building Windows executable...
echo This may take a few minutes...
echo.

call npm run build-exe

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo [SUCCESS] Build completed!
    echo ================================
    echo.
    echo Executable created: stonerstats-server.exe
    echo.
    echo To run the server, double-click stonerstats-server.exe
    echo or run it from command line.
) else (
    echo.
    echo [ERROR] Build failed!
    echo Please check the error messages above.
)

echo.
pause
