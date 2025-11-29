@echo off
REM ThinkSecure - Backend Server Launcher
REM This script starts the Node.js backend server in a persistent terminal window

echo ========================================
echo   ThinkSecure - Starting Backend
echo ========================================
echo.

REM Navigate to the backend directory
cd /d "%~dp0backend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo ERROR: node_modules not found!
    echo Please run 'npm install' first.
    echo.
    pause
    exit /b 1
)

REM Check if server.js exists
if not exist "server.js" (
    echo ERROR: server.js not found!
    echo Please ensure you're in the correct directory.
    echo.
    pause
    exit /b 1
)

echo Starting Node.js Backend Server...
echo This window will stay open - DO NOT CLOSE IT!
echo.
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start Node server (this will keep the window open)
node server.js

REM If node exits, pause to see any error messages
if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
    pause
)
