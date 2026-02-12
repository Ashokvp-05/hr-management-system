# API Endpoint Testing Script for HR Management System
# Tests all critical endpoints to verify Module 1 functionality

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  HR MANAGEMENT SYSTEM - API VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "http://localhost:4000"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "[TEST] $Name..." -ForegroundColor Yellow -NoNewline
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            $script:testResults += @{Name=$Name; Status="PASS"; Code=$response.StatusCode}
            return $true
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:testResults += @{Name=$Name; Status="FAIL"; Code=$response.StatusCode}
            return $false
        }
    } catch {
        Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{Name=$Name; Status="ERROR"; Error=$_.Exception.Message}
        return $false
    }
}

function Test-AuthenticatedEndpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Token,
        [string]$Method = "GET"
    )
    
    $headers = @{
        "Authorization" = "Bearer $Token"
    }
    
    Test-Endpoint -Name $Name -Url $Url -Method $Method -Headers $headers
}

# Test 1: Health Check
Write-Host ""
Write-Host "PHASE 1: Backend Health Check" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
Test-Endpoint -Name "Backend Health" -Url "$backendUrl/api/health"

# Test 2: Authentication
Write-Host ""
Write-Host "PHASE 2: Authentication Tests" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan

# Test Employee Login
$employeeLoginBody = @{
    email = "employee@rudratic.com"
    password = "Employee@123"
} | ConvertTo-Json

Write-Host "[TEST] Employee Login..." -ForegroundColor Yellow -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/auth/login" -Method POST -Body $employeeLoginBody -ContentType "application/json" -UseBasicParsing
    $employeeData = $response.Content | ConvertFrom-Json
    $employeeToken = $employeeData.token
    Write-Host " ✅ PASS (Token received)" -ForegroundColor Green
    $script:testResults += @{Name="Employee Login"; Status="PASS"; Code=$response.StatusCode}
} catch {
    Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $script:testResults += @{Name="Employee Login"; Status="ERROR"; Error=$_.Exception.Message}
    $employeeToken = $null
}

# Test Manager Login
$managerLoginBody = @{
    email = "manager@rudratic.com"
    password = "Manager@123"
} | ConvertTo-Json

Write-Host "[TEST] Manager Login..." -ForegroundColor Yellow -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/auth/login" -Method POST -Body $managerLoginBody -ContentType "application/json" -UseBasicParsing
    $managerData = $response.Content | ConvertFrom-Json
    $managerToken = $managerData.token
    Write-Host " ✅ PASS (Token received)" -ForegroundColor Green
    $script:testResults += @{Name="Manager Login"; Status="PASS"; Code=$response.StatusCode}
} catch {
    Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $script:testResults += @{Name="Manager Login"; Status="ERROR"; Error=$_.Exception.Message}
    $managerToken = $null
}

# Test Admin Login
$adminLoginBody = @{
    email = "admin@rudratic.com"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "[TEST] Admin Login..." -ForegroundColor Yellow -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/auth/login" -Method POST -Body $adminLoginBody -ContentType "application/json" -UseBasicParsing
    $adminData = $response.Content | ConvertFrom-Json
    $adminToken = $adminData.token
    Write-Host " ✅ PASS (Token received)" -ForegroundColor Green
    $script:testResults += @{Name="Admin Login"; Status="PASS"; Code=$response.StatusCode}
} catch {
    Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $script:testResults += @{Name="Admin Login"; Status="ERROR"; Error=$_.Exception.Message}
    $adminToken = $null
}

# Test 3: User Management (Admin)
if ($adminToken) {
    Write-Host ""
    Write-Host "PHASE 3: User Management (Admin Token)" -ForegroundColor Cyan
    Write-Host "---------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get All Users" -Url "$backendUrl/api/users" -Token $adminToken
}

# Test 4: Attendance/Time Entry
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 4: Attendance System (Employee Token)" -ForegroundColor Cyan
    Write-Host "--------------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Attendance Records" -Url "$backendUrl/api/time-entries" -Token $employeeToken
}

# Test 5: Leave Management
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 5: Leave Management (Employee Token)" -ForegroundColor Cyan
    Write-Host "-------------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Leave Requests" -Url "$backendUrl/api/leaves" -Token $employeeToken
}

# Test 6: Payslips
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 6: Payslip System (Employee Token)" -ForegroundColor Cyan
    Write-Host "-----------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Payslips" -Url "$backendUrl/api/payslips" -Token $employeeToken
}

# Test 7: Tickets
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 7: Ticketing System (Employee Token)" -ForegroundColor Cyan
    Write-Host "-------------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Tickets" -Url "$backendUrl/api/tickets" -Token $employeeToken
}

# Test 8: Announcements
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 8: Announcements System (Employee Token)" -ForegroundColor Cyan
    Write-Host "-----------------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Announcements" -Url "$backendUrl/api/announcements" -Token $employeeToken
}

# Test 9: Calendar/Holidays
if ($employeeToken) {
    Write-Host ""
    Write-Host "PHASE 9: Calendar/Holiday System (Employee Token)" -ForegroundColor Cyan
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Test-AuthenticatedEndpoint -Name "Get Holidays" -Url "$backendUrl/api/holidays" -Token $employeeToken
}

# Summary
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failedTests = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$errorTests = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed:      $passedTests" -ForegroundColor Green
Write-Host "Failed:      $failedTests" -ForegroundColor Red
Write-Host "Errors:      $errorTests" -ForegroundColor Yellow

$passRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host ""
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

# Export results
$testResults | Export-Csv -Path "test-results.csv" -NoTypeInformation
Write-Host ""
Write-Host "Test results saved to: test-results.csv" -ForegroundColor Gray
