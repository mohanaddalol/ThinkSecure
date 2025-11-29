@echo off
REM ThinkSecure - Frontend Development Server Launcher
REM This script starts the Vite dev server in a persistent terminal window

echo ========================================
echo   ThinkSecure - Starting Frontend
echo ========================================
echo.

REM Navigate to the Front-end directory
cd /d "%~dp0Front-end"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo ERROR: node_modules not found!
    echo Please run 'npm install' first.
    echo.
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please ensure you're in the correct directory.
    echo.
    pause
    exit /b 1
)

echo Starting Vite Development Server...
echo This window will stay open - DO NOT CLOSE IT!
echo.
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start npm dev server (this will keep the window open)
npm run dev

REM If npm exits, pause to see any error messages
if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
    pause
)
