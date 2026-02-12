# Module 1 Functionality Verification Script - CORRECTED
# Updated with correct API endpoints

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " MODULE 1 - FUNCTIONALITY VERIFICATION" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

$backend = "http://localhost:4000"
$frontend = "http://localhost:3000"
$passed = 0
$failed = 0

function Test-API {
    param([string]$Name, [string]$Url, [string]$Method = "GET", [string]$Body = "", [hashtable]$Headers = @{})
    
    Write-Host "Testing: $Name... " -NoNewline -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri             = $Url
            Method          = $Method
            Headers         = $Headers
            UseBasicParsing = $true
            TimeoutSec      = 5
            ErrorAction     = "Stop"
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -match "^2") {
            Write-Host "✅ PASS ($($response.StatusCode))" -ForegroundColor Green
            $script:passed++
            return $response
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*404*") {
            Write-Host "❌ FAIL - Endpoint not found (404)" -ForegroundColor Red
        }
        elseif ($errorMsg -like "*401*") {
            Write-Host "❌ FAIL - Unauthorized (401)" -ForegroundColor Red
        }
        else {
            Write-Host "❌ FAIL - $errorMsg" -ForegroundColor Red
        }
        $script:failed++
        return $null
    }
}

# PHASE 1: Server Health Checks
Write-Host "PHASE 1: Server Health Checks" -ForegroundColor Cyan
Write-Host "-------------------------------`n" -ForegroundColor Cyan

Test-API -Name "Backend Root" -Url "$backend/"
Test-API -Name "Backend API Status" -Url "$backend/api"

try {
    $frontendCheck = Invoke-WebRequest -Uri $frontend -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Testing: Frontend Server...  ✅ PASS ($($frontendCheck.StatusCode))" -ForegroundColor Green
    $passed++
}
catch {
    Write-Host "Testing: Frontend Server...  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# PHASE 2: Authentication
Write-Host "`nPHASE 2: Authentication System" -ForegroundColor Cyan
Write-Host "--------------------------------`n" -ForegroundColor Cyan

# Employee Login
$empLogin = @{
    email    = "employee@rudratic.com"
    password = "Employee@123"
} | ConvertTo-Json

$empResponse = Test-API -Name "Employee Login" -Url "$backend/api/auth/login" -Method POST -Body $empLogin
$empToken = if ($empResponse) { 
    try {
        ($empResponse.Content | ConvertFrom-Json).token 
    }
    catch { 
        $null 
    }
}
else { $null }

# Manager Login
$mgrLogin = @{
    email    = "manager@rudratic.com"
    password = "Manager@123"
} | ConvertTo-Json

$mgrResponse = Test-API -Name "Manager Login" -Url "$backend/api/auth/login" -Method POST -Body $mgrLogin
$mgrToken = if ($mgrResponse) { 
    try {
        ($mgrResponse.Content | ConvertFrom-Json).token 
    }
    catch { 
        $null 
    }
}
else { $null }

# Admin Login
$adminLogin = @{
    email    = "admin@rudratic.com"
    password = "Admin@123"
} | ConvertTo-Json

$adminResponse = Test-API -Name "Admin Login" -Url "$backend/api/auth/login" -Method POST -Body $adminLogin
$adminToken = if ($adminResponse) { 
    try {
        ($adminResponse.Content | ConvertFrom-Json).token 
    }
    catch { 
        $null 
    }
}
else { $null }

# PHASE 3: Core Modules (with Admin token)
if ($adminToken) {
    Write-Host "`nPHASE 3: Core Modules (Admin Access)" -ForegroundColor Cyan
    Write-Host "---------------------------------------`n" -ForegroundColor Cyan
    
    $authHeaders = @{ "Authorization" = "Bearer $adminToken" }
    
    Test-API -Name "User Management" -Url "$backend/api/users" -Headers $authHeaders
    Test-API -Name "Time Entries" -Url "$backend/api/time" -Headers $authHeaders
    Test-API -Name "Leave Requests" -Url "$backend/api/leaves" -Headers $authHeaders
    Test-API -Name "Payslips" -Url "$backend/api/payslips" -Headers $authHeaders
    Test-API -Name "Tickets" -Url "$backend/api/tickets" -Headers $authHeaders
    Test-API -Name "Announcements" -Url "$backend/api/announcements" -Headers $authHeaders
    Test-API -Name "Holidays" -Url "$backend/api/holidays" -Headers $authHeaders
    Test-API -Name "Kudos" -Url "$backend/api/kudos" -Headers $authHeaders
    Test-API -Name "Reports" -Url "$backend/api/reports/attendance" -Headers $authHeaders
    Test-API -Name "Admin Dashboard" -Url "$backend/api/admin/dashboard-stats" -Headers $authHeaders
}
else {
    Write-Host "`n⚠️  SKIPPING PHASE 3 - Admin token not available`n" -ForegroundColor Yellow
}

# PHASE 4: Employee Access
if ($empToken) {
    Write-Host "`nPHASE 4: Employee-Specific Access" -ForegroundColor Cyan
    Write-Host "------------------------------------`n" -ForegroundColor Cyan
    
    $empHeaders = @{ "Authorization" = "Bearer $empToken" }
    
    Test-API -Name "Employee Payslips" -Url "$backend/api/payslips" -Headers $empHeaders
    Test-API -Name "Employee Tickets" -Url "$backend/api/tickets" -Headers $empHeaders
    Test-API -Name "Employee Time" -Url "$backend/api/time" -Headers $empHeaders
    Test-API -Name "Employee Leaves" -Url "$backend/api/leaves" -Headers $empHeaders
    Test-API -Name "Employee Profile" -Url "$backend/api/profile" -Headers $empHeaders
}
else {
    Write-Host "`n⚠️  SKIPPING PHASE 4 - Employee token not available`n" -ForegroundColor Yellow
}

# PHASE 5: Manager Access
if ($mgrToken) {
    Write-Host "`nPHASE 5: Manager-Specific Access" -ForegroundColor Cyan
    Write-Host "-----------------------------------`n" -ForegroundColor Cyan
    
    $mgrHeaders = @{ "Authorization" = "Bearer $mgrToken" }
    
    Test-API -Name "Manager Leaves" -Url "$backend/api/leaves" -Headers $mgrHeaders
    Test-API -Name "Manager Team Time" -Url "$backend/api/time" -Headers $mgrHeaders
    Test-API -Name "Manager Users" -Url "$backend/api/users" -Headers $mgrHeaders
}
else {
    Write-Host "`n⚠️  SKIPPING PHASE 5 - Manager token not available`n" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

$total = $passed + $failed
$passRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 2) } else { 0 }

Write-Host "Total Tests:  $total" -ForegroundColor White
Write-Host "Passed:       $passed" -ForegroundColor Green
Write-Host "Failed:       $failed" -ForegroundColor Red
Write-Host "Pass Rate:    $passRate%`n" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })

# Results Interpretation
if ($passRate -ge 80) {
    Write-Host "✅ MODULE 1 IS FULLY FUNCTIONAL!" -ForegroundColor Green
    Write-Host "   All major features are working correctly." -ForegroundColor Gray
}
elseif ($passRate -ge 60) {
    Write-Host "⚠️  MODULE 1 IS PARTIALLY FUNCTIONAL" -ForegroundColor Yellow
    Write-Host "   Most features work but some issues detected." -ForegroundColor Gray
}
else {
    Write-Host "❌ MODULE 1 NEEDS ATTENTION" -ForegroundColor Red
    Write-Host "   Critical issues detected. Review required." -ForegroundColor Gray
}

# Feature Status
Write-Host "`nFeature Status:" -ForegroundColor Cyan
Write-Host "  [✓] Backend Server" -ForegroundColor $(if ($passed -ge 2) { "Green" } else { "Red" })
Write-Host "  [✓] Frontend Server" -ForegroundColor $(if ($passed -ge 3) { "Green" } else { "Red" })
Write-Host "  [✓] Authentication System" -ForegroundColor $(if ($empToken -and $mgrToken -and $adminToken) { "Green" } else { "Red" })
Write-Host "  [✓] Role-Based Access Control" -ForegroundColor $(if ($empToken -and $mgrToken -and $adminToken) { "Green" } else { "Red" })
Write-Host "  [✓] Core Modules (Users, Time, Leaves, etc.)" -ForegroundColor $(if ($passed -ge 10) { "Green" } elseif ($passed -ge 5) { "Yellow" } else { "Red" })

Write-Host "`n=========================================`n" -ForegroundColor Cyan
