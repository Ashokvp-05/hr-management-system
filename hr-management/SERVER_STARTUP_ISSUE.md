# 🔧 Server Startup Issue - Root Cause Analysis

**Issue Date:** February 11, 2026 @ 17:32 IST  
**Error:** ERR_CONNECTION_REFUSED on localhost:3000  
**Status:** ✅ RESOLVED

---

## 🔴 **Problem Identified**

### **Root Cause:**
The `start.ps1` script opens backend and frontend in **separate PowerShell windows** using `Start-Process`. This approach has limitations:
- The parent script completes and exits immediately after spawning child processes
- Output from child windows is not visible in the main terminal
- Requires waiting for user input before opening browser
- Frontend compilation takes 6-8 seconds but script doesn't wait
- Browser opened before frontend was ready

### **Symptom:**
- Browser opened at http://localhost:3000
- Frontend was still compiling (not yet listening on port 3000)
- Result: **ERR_CONNECTION_REFUSED**

---

## ✅ **Solution Applied**

### **Manual Server Startup (Current Method)**

Started servers manually in foreground to see output and ensure proper initialization:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
**Output:**
```
Server is running on port 4000 ✅
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
**Output:**
```
▲ Next.js 16.1.6 (Turbopack)
- Local: http://localhost:3000
✓ Ready in 6.6s ✅
```

---

## 📊 **Verification**

### Port Connectivity Test:
```powershell
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
# Result: True ✅

Test-NetConnection -ComputerName localhost -Port 4000 -InformationLevel Quiet
# Result: True ✅
```

### Both Servers Running:
- ✅ Backend: http://localhost:4000 (Express API)
- ✅ Frontend: http://localhost:3000 (Next.js)

---

## 🛠️ **Why the Start Script Failed**

### **Original Script Behavior:**
```powershell
# Line 59: Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Line 62: Wait only 3 seconds
Start-Sleep -Seconds 3

# Line 66: Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

# Line 99-103: Wait for user input, then open browser
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:3000"
```

### **Issues:**
1. **New Windows:** Processes run in separate windows, parent script can't track their status
2. **Timing:** 3-second wait between backend and frontend is arbitrary
3. **Frontend Compilation:** Next.js takes 6-8 seconds to compile, but browser opens immediately after user presses key
4. **No Health Checks:** Script doesn't verify servers are actually listening before opening browser
5. **Silent Failures:** If frontend fails to start, user only sees "can't connect" in browser

---

## 📝 **Recommended Approaches**

### **Option 1: Wait for Server Readiness (Best for Automation)**

Update `start.ps1` to wait for actual port availability:

```powershell
# Start Backend
Write-Host "[BACKEND] Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait for backend to be ready
Write-Host "[WAIT] Waiting for backend (Port 4000)..." -ForegroundColor Yellow
$backendReady = $false
$attempts = 0
while (-not $backendReady -and $attempts -lt 30) {
    $attempts++
    Start-Sleep -Seconds 1
    $backendReady = Test-NetConnection -ComputerName localhost -Port 4000 -InformationLevel Quiet -WarningAction SilentlyContinue
    Write-Host "." -NoNewline
}
if ($backendReady) {
    Write-Host "`n[OK] Backend is ready!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Backend failed to start" -ForegroundColor Red
    exit 1
}

# Start Frontend
Write-Host "[FRONTEND] Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

# Wait for frontend to be ready
Write-Host "[WAIT] Waiting for frontend (Port 3000)..." -ForegroundColor Yellow
$frontendReady = $false
$attempts = 0
while (-not $frontendReady -and $attempts -lt 60) {  # Frontend takes longer
    $attempts++
    Start-Sleep -Seconds 1
    $frontendReady = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
    Write-Host "." -NoNewline
}
if ($frontendReady) {
    Write-Host "`n[OK] Frontend is ready!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Frontend failed to start" -ForegroundColor Red
    exit 1
}

# Now safe to open browser
Write-Host "`n[LAUNCH] Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"
Write-Host "[SUCCESS] Application is running!" -ForegroundColor Green
```

### **Option 2: Concurrent Windows with Instructions (Current Method)**

Keep current approach but add clear instructions:

```powershell
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "IMPORTANT: Two PowerShell windows will open:" -ForegroundColor Yellow
Write-Host "  1. Backend Server (Port 4000)" -ForegroundColor White
Write-Host "  2. Frontend Server (Port 3000)" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Wait for BOTH windows to show 'Ready' messages:" -ForegroundColor Green
Write-Host "  Backend:  'Server is running on port 4000'" -ForegroundColor Gray
Write-Host "  Frontend: '✓ Ready in X.Xs'" -ForegroundColor Gray
Write-Host "" -ForegroundColor White
Write-Host "THEN manually open: http://localhost:3000" -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
```

### **Option 3: Manual Start (Recommended for Development)**

Create a simple `dev.md` guide:

**Backend Terminal:**
```bash
cd backend
npm run dev
```

**Frontend Terminal:**
```bash
cd frontend
npm run dev
```

**Advantages:**
- Full visibility of both server outputs
- Can see errors immediately
- Can restart individual servers
- Standard development practice
- Works on all platforms

---

## 🎯 **Current Status**

### ✅ **Servers Running Successfully**

**Terminal 1 (Backend):**
```
Server is running on port 4000
```
CommandID: `60474ba8-15df-4061-a8e8-5c6330b0fa95`

**Terminal 2 (Frontend):**
```
▲ Next.js 16.1.6 (Turbopack)
- Local: http://localhost:3000
✓ Ready in 6.6s
```
CommandID: `ffd9a4b7-10f7-4207-9cb2-4f5aae266527`

### ✅ **Application Accessible**
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:4000 ✅

---

## 📚 **Quick Start Commands**

### **Stop All Servers:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **Start Backend:**
```powershell
cd d:\HR\hr-management\backend
npm run dev
```

### **Start Frontend:**
```powershell
cd d:\HR\hr-management\frontend
npm run dev
```

### **Check Server Status:**
```powershell
# Check if ports are listening
Test-NetConnection localhost -Port 3000 -InformationLevel Quiet
Test-NetConnection localhost -Port 4000 -InformationLevel Quiet

# List Node processes
Get-Process -Name node -ErrorAction SilentlyContinue
```

---

## 🔍 **Common Issues & Solutions**

### **Issue 1: ERR_CONNECTION_REFUSED**
**Cause:** Frontend not started or still compiling  
**Solution:** Wait for "✓ Ready" message before opening browser

### **Issue 2: Port Already in Use**
**Cause:** Previous Node process still running  
**Solution:**
```powershell
Get-Process -Name node | Stop-Process -Force
```

### **Issue 3: "Cannot find module" errors**
**Cause:** Dependencies not installed  
**Solution:**
```powershell
cd backend && npm install
cd ../frontend && npm install
```

### **Issue 4: Database Connection Failed**
**Cause:** PostgreSQL not running  
**Solution:**
```powershell
Get-Service -Name "postgresql*" | Start-Service
```

### **Issue 5: Prisma Client Not Generated**
**Cause:** Schema changed or first install  
**Solution:**
```powershell
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## 📝 **Updated Start.ps1 (Recommended)**

Created improved version: `start-improved.ps1`

**Key Improvements:**
- ✅ Waits for actual port availability
- ✅ Health checks before opening browser
- ✅ Better error messages
- ✅ Timeout handling
- ✅ Status indicators

---

## 🎓 **Lessons Learned**

1. **Async Process Management:** `Start-Process` creates detached processes; parent can't track status
2. **Timing Matters:** Fixed delays (3 seconds) don't account for compilation time
3. **Health Checks:** Always verify ports are listening before declaring "ready"
4. **Visibility:** Separate windows hide output and errors
5. **User Experience:** Opening browser before frontend is ready creates poor UX

---

## ✅ **Resolution**

**Problem:** ERR_CONNECTION_REFUSED  
**Root Cause:** Browser opened before frontend finished compiling  
**Solution:** Started servers manually with visible output, waited for "Ready" messages  
**Status:** ✅ **RESOLVED - Application Running Successfully**

---

**Document Created:** February 11, 2026 @ 17:35 IST  
**Agent:** Debugger & Backend Specialist  
**Issue Status:** ✅ RESOLVED
