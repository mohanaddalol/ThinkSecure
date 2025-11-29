# ThinkSecure - Server Startup Script
# This script starts both backend and frontend servers

Write-Host "=" -ForegroundColor Cyan -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " ThinkSecure - Starting Servers..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Kill any existing node processes on required ports
Write-Host "`nCleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend Server in new window
Write-Host "`nStarting Backend Server (Port 5000)..." -ForegroundColor Cyan
$backendPath = "$PSScriptRoot\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host 'BACKEND SERVER' -ForegroundColor Green; node server.js"

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend Server in new window
Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
$frontendPath = "$PSScriptRoot\Front-end"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Green; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nBackend:  " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host "`nOpening browser..." -ForegroundColor Cyan

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

Write-Host "`nPress any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
