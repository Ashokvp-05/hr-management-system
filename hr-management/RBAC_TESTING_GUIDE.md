# 🔐 RBAC TESTING GUIDE - Role-Based Access Control

**Date:** 2026-02-10  
**Version:** v3.0.1  
**Purpose:** Verify Role-Based Access Control is working correctly

---

## 🎯 **WHAT IS RBAC?**

**RBAC** = Role-Based Access Control

Your HR application has **3 main user roles:**

| Role | Access Level | Dashboard URL | Permissions |
|------|--------------|---------------|-------------|
| **ADMIN** | Full Access | `/admin` | All features + User Management |
| **MANAGER** | Medium Access | `/manager` | Team Management + Approvals |
| **EMPLOYEE** | Basic Access | `/dashboard` | Personal data only |

---

## ✅ **HOW RBAC WORKS IN YOUR APP**

### **Step 1: User Logs In**
```
User enters email & password → Login page
```

### **Step 2: Authentication**
```
Backend verifies credentials → Retrieves user role from database
```

### **Step 3: Role-Based Redirect**
```
Frontend checks role → Redirects to appropriate dashboard:
- ADMIN → /admin
- MANAGER → /manager
- EMPLOYEE → /dashboard
```

### **Step 4: Protected Routes**
```
Each dashboard page checks role → Blocks unauthorized access
```

---

## 🧪 **RBAC TESTING - STEP BY STEP**

### **Prerequisites**
1. ✅ Backend running: http://localhost:4000
2. ✅ Frontend running: http://localhost:3000
3. ✅ Database running (Prisma Studio: http://localhost:5555)

---

## **TEST 1: Check Test Users in Database**

### **Option A: Using Prisma Studio** (Easiest)

1. **Open Prisma Studio:**
   ```
   http://localhost:5555
   ```

2. **Click on "User" table** (left sidebar)

3. **Check existing users and their roles:**
   
   Look for these columns:
   - `email` - User's email
   - `role` - User's role (ADMIN/MANAGER/EMPLOYEE)
   - `status` - Should be "ACTIVE"

4. **Note down test credentials:**
   ```
   Example users you should see:
   
   Email: admin@test.com
   Role: ADMIN
   Status: ACTIVE
   
   Email: manager@test.com
   Role: MANAGER
   Status: ACTIVE
   
   Email: employee@test.com
   Role: EMPLOYEE
   Status: ACTIVE
   ```

### **Option B: Using Backend API**

Open PowerShell and run:
```powershell
# Get list of all users
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/users" -Method GET -Headers @{ "Authorization" = "Bearer YOUR_TOKEN" }
```

---

## **TEST 2: Create Test Users** (If they don't exist)

### **Manual Creation via Prisma Studio**

1. Open: http://localhost:5555
2. Click: "User" table
3. Click: "Add record" button
4. Fill in:
   ```
   name: Admin Test
   email: admin@test.com
   password: [hashed password - see note below]
   role: ADMIN
   status: ACTIVE
   department: IT
   ```

**Note:** You need to hash passwords. Use the Sign-Up page instead!

### **Easier: Use Sign-Up Page**

1. **Open:** http://localhost:3000/signup

2. **Create Admin User:**
   ```
   Full Name: Admin Test
   Email: admin@test.com
   Company: Test Company
   Password: Admin123!
   Confirm: Admin123!
   [x] I agree to terms
   ```
   Click "Create account"

3. **Update role in database:**
   - Open Prisma Studio: http://localhost:5555
   - Find the user you just created
   - Change `role` from "EMPLOYEE" to "ADMIN"
   - Save

4. **Repeat for Manager & Employee:**
   ```
   Manager:
   - Email: manager@test.com
   - Password: Manager123!
   - Role: MANAGER (update in DB)
   
   Employee:
   - Email: employee@test.com
   - Password: Employee123!
   - Role: EMPLOYEE (default)
   ```

---

## **TEST 3: Test ADMIN Role Redirect**

### **Test Case: TC-RBAC-001**

**Expected Behavior:** Admin users should redirect to `/admin`

**Steps:**

1. **Logout** (if logged in):
   - Navigate to: http://localhost:3000/logout

2. **Go to Login:**
   - Navigate to: http://localhost:3000/login

3. **Login as Admin:**
   ```
   Email: admin@test.com
   Password: Admin123!
   ```

4. **Click "Sign in"**

5. **✅ VERIFY:**
   - [ ] Success toast shows "Welcome back!"
   - [ ] URL changes to: `http://localhost:3000/admin`
   - [ ] Admin dashboard loads
   - [ ] You see "Admin God Mode" header
   - [ ] You see admin-specific features (User Management, System Pulse, etc.)

6. **Check Browser Console (F12):**
   - [ ] No errors
   - [ ] No "unauthorized" messages

**Result:**
- ✅ **PASS** - If redirected to `/admin` and dashboard loads
- ❌ **FAIL** - If redirected elsewhere or see errors

---

## **TEST 4: Test MANAGER Role Redirect**

### **Test Case: TC-RBAC-002**

**Expected Behavior:** Manager users should redirect to `/manager`

**Steps:**

1. **Logout:**
   - Navigate to: http://localhost:3000/logout

2. **Go to Login:**
   - Navigate to: http://localhost:3000/login

3. **Login as Manager:**
   ```
   Email: manager@test.com
   Password: Manager123!
   ```

4. **Click "Sign in"**

5. **✅ VERIFY:**
   - [ ] Success toast shows "Welcome back!"
   - [ ] URL changes to: `http://localhost:3000/manager`
   - [ ] Manager dashboard loads
   - [ ] You see manager-specific features (Team overview, Approvals, etc.)

6. **Check Browser Console (F12):**
   - [ ] No errors
   - [ ] No "unauthorized" messages

**Result:**
- ✅ **PASS** - If redirected to `/manager` and dashboard loads
- ❌ **FAIL** - If redirected elsewhere or see errors

---

## **TEST 5: Test EMPLOYEE Role Redirect**

### **Test Case: TC-RBAC-003**

**Expected Behavior:** Employee users should redirect to `/dashboard`

**Steps:**

1. **Logout:**
   - Navigate to: http://localhost:3000/logout

2. **Go to Login:**
   - Navigate to: http://localhost:3000/login

3. **Login as Employee:**
   ```
   Email: employee@test.com
   Password: Employee123!
   ```

4. **Click "Sign in"**

5. **✅ VERIFY:**
   - [ ] Success toast shows "Welcome back!"
   - [ ] URL changes to: `http://localhost:3000/dashboard`
   - [ ] Employee dashboard loads
   - [ ] You see employee features (Attendance, Leave, Profile, etc.)
   - [ ] You do NOT see admin/manager features

6. **Check Browser Console (F12):**
   - [ ] No errors
   - [ ] No "unauthorized" messages

**Result:**
- ✅ **PASS** - If redirected to `/dashboard` and loads correctly
- ❌ **FAIL** - If redirected elsewhere or see errors

---

## **TEST 6: Test Protected Routes** (Access Restriction)

### **Test Case: TC-RBAC-004**

**Expected Behavior:** Employees CANNOT access admin/manager pages

**Steps:**

1. **Login as Employee** (as in TEST 5)

2. **Try to access Admin page manually:**
   - Type in browser: `http://localhost:3000/admin`
   - Press Enter

3. **✅ VERIFY:**
   - [ ] You are redirected AWAY from `/admin`
   - [ ] You are sent to `/dashboard` (employee page)
   - [ ] OR you see "Access Denied" message

4. **Try to access Manager page:**
   - Type in browser: `http://localhost:3000/manager`
   - Press Enter

5. **✅ VERIFY:**
   - [ ] You are redirected AWAY from `/manager`
   - [ ] You are sent to `/dashboard`
   - [ ] OR you see "Access Denied" message

**Result:**
- ✅ **PASS** - If employee CANNOT access admin/manager pages
- ❌ **FAIL** - If employee CAN access admin/manager pages

---

### **Test Case: TC-RBAC-005**

**Expected Behavior:** Managers CAN access admin pages (if configured)

**Steps:**

1. **Login as Manager** (as in TEST 4)

2. **Try to access Admin page:**
   - Type in browser: `http://localhost:3000/admin`
   - Press Enter

3. **✅ VERIFY:**
   - [ ] Check if your config allows managers to access admin
   - If YES: Manager should see admin dashboard
   - If NO: Manager should be redirected to `/manager`

**Check Configuration:**

Open file: `d:\HR\hr-management\frontend\src\app\(dashboard)\admin\page.tsx`

Look for line ~43:
```typescript
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER']
```

If `'MANAGER'` is in the array → Managers CAN access admin page ✅  
If `'MANAGER'` is NOT in the array → Managers CANNOT access admin page ❌

---

## **TEST 7: Test Session Persistence**

### **Test Case: TC-RBAC-006**

**Expected Behavior:** User stays logged in after page refresh

**Steps:**

1. **Login as any role** (Admin/Manager/Employee)

2. **Verify you're on the correct dashboard**

3. **Press F5** (refresh page)

4. **✅ VERIFY:**
   - [ ] You stay logged in
   - [ ] You stay on the same dashboard
   - [ ] No redirect to login page

5. **Close browser tab**

6. **Open new tab and navigate to:**
   - `http://localhost:3000`

7. **✅ VERIFY:**
   - [ ] You are still logged in (if "Remember me" was checked)
   - [ ] You are redirected to your dashboard
   - [ ] OR you are redirected to login (if "Remember me" was NOT checked)

**Result:**
- ✅ **PASS** - If session persists correctly
- ❌ **FAIL** - If you're logged out unexpectedly

---

## **TEST 8: Test Root Page Redirect**

### **Test Case: TC-RBAC-007**

**Expected Behavior:** Accessing `/` redirects based on role

**Steps:**

1. **Login as Admin**

2. **Navigate to:**
   - `http://localhost:3000/`

3. **✅ VERIFY:**
   - [ ] Automatically redirected to `/admin`

4. **Logout and login as Manager**

5. **Navigate to:**
   - `http://localhost:3000/`

6. **✅ VERIFY:**
   - [ ] Automatically redirected to `/manager`

7. **Logout and login as Employee**

8. **Navigate to:**
   - `http://localhost:3000/`

9. **✅ VERIFY:**
   - [ ] Automatically redirected to `/dashboard`

**Result:**
- ✅ **PASS** - If root redirects correctly for all roles
- ❌ **FAIL** - If redirects are wrong

---

## **TEST 9: Test Logout**

### **Test Case: TC-RBAC-008**

**Expected Behavior:** Logout clears session and redirects to login

**Steps:**

1. **Login as any role**

2. **Click Logout** (or navigate to `/logout`)

3. **✅ VERIFY:**
   - [ ] Session is cleared
   - [ ] Redirected to `/login`
   - [ ] Cannot access protected pages anymore

4. **Try to manually access dashboard:**
   - Type: `http://localhost:3000/admin`

5. **✅ VERIFY:**
   - [ ] Redirected back to `/login`
   - [ ] See message like "Please log in"

**Result:**
- ✅ **PASS** - If logout works correctly
- ❌ **FAIL** - If session persists after logout

---

## 🔍 **TROUBLESHOOTING RBAC ISSUES**

### **Issue 1: Wrong Dashboard After Login**

**Symptom:** Admin logs in but goes to `/dashboard` instead of `/admin`

**Debug Steps:**

1. **Check user role in database:**
   - Open Prisma Studio: http://localhost:5555
   - Click "User" table
   - Find the user
   - Check `role` column - should be "ADMIN" (uppercase)

2. **Check role-redirect logic:**
   - Open file: `d:\HR\hr-management\frontend\src\lib\role-redirect.ts`
   - Verify the role mapping is correct

3. **Check case sensitivity:**
   - Role should be UPPERCASE in database
   - Code normalizes to uppercase: `.toUpperCase()`

4. **Check browser console:**
   - Press F12
   - Look for role value logged
   - Check for redirect errors

**Fix:**
```sql
-- Update role to ADMIN (uppercase)
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

---

### **Issue 2: Can Access Unauthorized Pages**

**Symptom:** Employee can access `/admin` page

**Debug Steps:**

1. **Check page protection:**
   - Open: `d:\HR\hr-management\frontend\src\app\(dashboard)\admin\page.tsx`
   - Look for code around line 40-50:
   ```typescript
   const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', ...]
   const role = (session?.user?.role || "USER").toUpperCase()
   
   if (!session || !ADMIN_ROLES.includes(role)) {
       redirect("/dashboard")
   }
   ```

2. **Verify session is being checked:**
   - Session should exist
   - Role should be checked
   - Unauthorized should redirect

3. **Check middleware:**
   - Check if `middleware.ts` exists
   - Verify auth middleware is working

**Fix:**
Review the auth check in the page component and ensure it's wrapped with `auth()` from NextAuth.

---

### **Issue 3: Session Lost After Refresh**

**Symptom:** User is logged out when refreshing page

**Debug Steps:**

1. **Check NextAuth configuration:**
   - File: `d:\HR\hr-management\frontend\src\auth.ts`
   - Verify session strategy is correct

2. **Check cookies:**
   - Open DevTools → Application → Cookies
   - Look for `next-auth.session-token`
   - Should be present and not expired

3. **Check environment variables:**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=[should-be-set]
   ```

**Fix:**
Ensure `NEXTAUTH_SECRET` is set in `.env.local`

---

## ✅ **RBAC TESTING CHECKLIST**

Use this quick checklist to verify RBAC is working:

### **Quick Test** (5 minutes)

- [ ] **Test 1:** Admin login → redirects to `/admin` ✅
- [ ] **Test 2:** Manager login → redirects to `/manager` ✅
- [ ] **Test 3:** Employee login → redirects to `/dashboard` ✅
- [ ] **Test 4:** Employee CANNOT access `/admin` ✅
- [ ] **Test 5:** Employee CANNOT access `/manager` ✅
- [ ] **Test 6:** Session persists after refresh ✅
- [ ] **Test 7:** Root `/` redirects based on role ✅
- [ ] **Test 8:** Logout clears session correctly ✅

### **Full Test** (15 minutes)

Complete all tests TC-RBAC-001 through TC-RBAC-008 above.

---

## 📊 **RBAC TEST RESULTS TEMPLATE**

```
=== RBAC TEST RESULTS ===
Date: __________
Tester: __________

Admin Login Test:
- Status: ☐ PASS ☐ FAIL
- URL after login: __________
- Notes: __________

Manager Login Test:
- Status: ☐ PASS ☐ FAIL
- URL after login: __________
- Notes: __________

Employee Login Test:
- Status: ☐ PASS ☐ FAIL
- URL after login: __________
- Notes: __________

Protected Routes Test:
- Employee blocked from /admin: ☐ YES ☐ NO
- Employee blocked from /manager: ☐ YES ☐ NO
- Notes: __________

Session Persistence:
- Session survives refresh: ☐ YES ☐ NO
- Logout clears session: ☐ YES ☐ NO
- Notes: __________

Overall RBAC Status:
☐ WORKING CORRECTLY
☐ NEEDS FIXES
☐ NOT WORKING

Critical Issues: __________
Minor Issues: __________
```

---

## 🎯 **EXPECTED RESULTS**

### **✅ RBAC is Working Correctly if:**

1. ✅ Admin users → `/admin` dashboard
2. ✅ Manager users → `/manager` dashboard
3. ✅ Employee users → `/dashboard`
4. ✅ Employees CANNOT access admin/manager pages
5. ✅ Sessions persist after refresh
6. ✅ Logout works correctly
7. ✅ No console errors
8. ✅ Proper role-based UI (correct features shown)

### **❌ RBAC is NOT Working if:**

1. ❌ All users go to same dashboard
2. ❌ Employees can access admin pages
3. ❌ Session lost after refresh
4. ❌ Wrong features shown to wrong roles
5. ❌ Console shows role/auth errors
6. ❌ Redirects are inconsistent

---

## 🚀 **QUICK START COMMANDS**

```powershell
# 1. Ensure backend is running
cd d:\HR\hr-management\backend
npm run dev

# 2. Ensure frontend is running
cd d:\HR\hr-management\frontend
npm run dev

# 3. Open Prisma Studio (check users)
cd d:\HR\hr-management\backend
npx prisma studio

# 4. Test login
# Open browser: http://localhost:3000/login
```

---

## 📞 **NEED HELP?**

### **Common Commands:**

**Check Backend Status:**
```powershell
curl http://localhost:4000/api/health
```

**View Database Users:**
```powershell
# Open Prisma Studio
cd d:\HR\hr-management\backend
npx prisma studio
# Navigate to: http://localhost:5555
# Click: User table
```

**Create Test User via Backend:**
```powershell
# Use Postman or similar to POST to:
# http://localhost:4000/api/auth/register
```

---

**END OF RBAC TESTING GUIDE** ✅

**Start with the Quick Test (5 min) to verify RBAC is working!**
