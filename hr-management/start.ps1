# HR Management System - Quick Start Script
# This script starts both backend and frontend servers

Write-Host ">>> Starting HR Management System..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path ".\backend") -or -not (Test-Path ".\frontend")) {
    Write-Host "[ERROR] Please run this script from the hr-management root directory" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Pre-flight checks..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is running
Write-Host "[INFO] Checking PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "[OK] PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "[WARN] PostgreSQL service not detected or not running" -ForegroundColor Yellow
    Write-Host "       Please ensure PostgreSQL is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[DB] Setting up database..." -ForegroundColor Cyan
Set-Location backend

# Generate Prisma client
Write-Host "     Generating Prisma client..." -ForegroundColor Yellow
cmd /c npx prisma generate | Out-Null

Write-Host "[OK] Database setup complete" -ForegroundColor Green
Write-Host ""

Set-Location ..

# Kill any existing node processes
Write-Host "[CLEAN] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[START] Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend in a new window
Write-Host "[BACKEND] Starting Backend Server (Port 4000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Write-Host "[FRONTEND] Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "[OK] Servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "[URL] Application URLs:" -ForegroundColor Yellow
Write-Host "      Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "      Backend:   http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "[TEST] Test Pages:" -ForegroundColor Yellow
Write-Host "       Auth Test: http://localhost:3000/auth-test" -ForegroundColor White
Write-Host "       Login:     http://localhost:3000/login" -ForegroundColor White
Write-Host "       Logout:    http://localhost:3000/logout" -ForegroundColor White
Write-Host ""
Write-Host "[USER] Default Test Accounts:" -ForegroundColor Yellow
Write-Host "       Admin:    admin@rudratic.com / Admin@123" -ForegroundColor White
Write-Host "       Manager:  manager@rudratic.com / Manager@123" -ForegroundColor White
Write-Host "       Employee: employee@rudratic.com / Employee@123" -ForegroundColor White
Write-Host ""
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Important Tips:" -ForegroundColor Yellow
Write-Host "   - Two PowerShell windows will open (Backend and Frontend)" -ForegroundColor Gray
Write-Host "   - Keep both windows running" -ForegroundColor Gray
Write-Host "   - Press Ctrl+C in each window to stop servers" -ForegroundColor Gray
Write-Host "   - Visit http://localhost:3000 to start" -ForegroundColor Gray
Write-Host ""
Write-Host "[DOCS] See SETUP_GUIDE.md for details" -ForegroundColor Cyan
Write-Host ""

# Wait for user input
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "*** Happy coding!" -ForegroundColor Cyan
