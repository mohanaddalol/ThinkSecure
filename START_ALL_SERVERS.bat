@echo off
REM ThinkSecure - Launch All Servers
REM This script starts both backend and frontend in separate persistent windows

echo ========================================
echo   ThinkSecure - Starting All Servers
echo ========================================
echo.

REM Get the directory where this script is located
set "PROJECT_DIR=%~dp0"

echo Starting Backend Server...
start "ThinkSecure - Backend Server" cmd /k "cd /d "%PROJECT_DIR%backend" && node server.js"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul
   
echo Starting Frontend Server...
start "ThinkSecure - Frontend Server" cmd /k "cd /d "%PROJECT_DIR%Front-end" && npm run dev"

echo.
echo ========================================
echo   Both Servers Are Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened:
echo   1. Backend Server (Node.js)
echo   2. Frontend Server (Vite)
echo.
echo DO NOT CLOSE those windows to keep servers running!
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul

REM Open browser to the application
start http://localhost:5173

echo.
echo You can now close this window.
echo The servers will continue running in their own windows.
echo.
pause