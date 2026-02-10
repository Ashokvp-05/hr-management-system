# ⚡ RBAC QUICK TEST - 5 MINUTE VERIFICATION

**Purpose:** Quickly verify Role-Based Access Control is working

---

## 🎯 **STEP 1: Check Test Users** (1 min)

### Open Prisma Studio:
```
http://localhost:5555
```

### Click "User" table and verify you have:

| Email | Role | Status |
|-------|------|--------|
| admin@test.com | ADMIN | ACTIVE |
| manager@test.com | MANAGER | ACTIVE |
| employee@test.com | EMPLOYEE | ACTIVE |

**❌ Don't have these users?** → See "Create Test Users" section below

---

## 🎯 **STEP 2: Test Admin Login** (1 min)

1. **Open:** http://localhost:3000/login

2. **Enter:**
   ```
   Email: admin@test.com
   Password: [your admin password]
   ```

3. **Click:** "Sign in"

4. **✅ CHECK:**
   - URL changes to: `http://localhost:3000/admin`
   - You see "Admin God Mode" header
   - Dashboard has admin features (User Mgmt, System Pulse, Security)

**Result:** ✅ PASS if on `/admin` | ❌ FAIL if elsewhere

---

## 🎯 **STEP 3: Test Manager Login** (1 min)

1. **Logout:** Navigate to http://localhost:3000/logout

2. **Open:** http://localhost:3000/login

3. **Enter:**
   ```
   Email: manager@test.com
   Password: [your manager password]
   ```

4. **Click:** "Sign in"

5. **✅ CHECK:**
   - URL changes to: `http://localhost:3000/manager`
   - You see manager dashboard
   - Manager-specific features visible

**Result:** ✅ PASS if on `/manager` | ❌ FAIL if elsewhere

---

## 🎯 **STEP 4: Test Employee Login** (1 min)

1. **Logout:** Navigate to http://localhost:3000/logout

2. **Open:** http://localhost:3000/login

3. **Enter:**
   ```
   Email: employee@test.com
   Password: [your employee password]
   ```

4. **Click:** "Sign in"

5. **✅ CHECK:**
   - URL changes to: `http://localhost:3000/dashboard`
   - You see employee dashboard
   - NO admin/manager features visible

**Result:** ✅ PASS if on `/dashboard` | ❌ FAIL if elsewhere

---

## 🎯 **STEP 5: Test Access Protection** (1 min)

**While logged in as Employee:**

1. **Type in browser:** `http://localhost:3000/admin`

2. **Press Enter**

3. **✅ CHECK:**
   - You are BLOCKED from accessing `/admin`
   - Redirected back to `/dashboard`
   - OR see "Access Denied" message

**Result:** ✅ PASS if blocked | ❌ FAIL if can access

---

## 📊 **QUICK RESULTS**

| Test | Expected Result | Status |
|------|----------------|--------|
| Admin login | Redirect to `/admin` | ☐ PASS ☐ FAIL |
| Manager login | Redirect to `/manager` | ☐ PASS ☐ FAIL |
| Employee login | Redirect to `/dashboard` | ☐ PASS ☐ FAIL |
| Access protection | Employee blocked from `/admin` | ☐ PASS ☐ FAIL |

---

## ✅ **RBAC VERDICT**

### **If all tests PASS:**
🎉 **RBAC IS WORKING CORRECTLY!**
- Your role-based access control is functioning properly
- Users are redirected correctly based on their roles
- Protected routes are secure

### **If any test FAILS:**
⚠️ **RBAC NEEDS FIXING**
- Review the full guide: `RBAC_TESTING_GUIDE.md`
- Check troubleshooting section
- Verify user roles in database

---

## 🛠️ **CREATE TEST USERS** (If you don't have them)

### **Method 1: Using Sign-Up Page** (Easiest)

#### Create Admin User:
1. Open: http://localhost:3000/signup
2. Fill:
   ```
   Full Name: Admin Test
   Email: admin@test.com
   Company: Test Company
   Password: Admin123!
   Confirm: Admin123!
   [x] I agree to terms
   ```
3. Click "Create account"
4. **Update role to ADMIN:**
   - Open Prisma Studio: http://localhost:5555
   - Find user with email `admin@test.com`
   - Change `role` from "EMPLOYEE" to "ADMIN"
   - Click "Save 1 change"

#### Create Manager User:
1. Logout
2. Open: http://localhost:3000/signup
3. Fill:
   ```
   Email: manager@test.com
   Password: Manager123!
   ```
4. Update role to "MANAGER" in Prisma Studio

#### Create Employee User:
1. Logout
2. Open: http://localhost:3000/signup
3. Fill:
   ```
   Email: employee@test.com
   Password: Employee123!
   ```
4. Role will be "EMPLOYEE" by default (no change needed)

---

### **Method 2: Direct Database Insert** (Advanced)

**Using Prisma Studio:**

1. Open: http://localhost:5555
2. Click: "User" table
3. Click: "+ Add record"
4. Fill (you'll need to hash password separately):
   ```
   name: Admin Test
   email: admin@test.com
   role: ADMIN
   status: ACTIVE
   department: IT
   ```
5. Repeat for MANAGER and EMPLOYEE roles

**Note:** Password hashing is complex. Use Method 1 (Sign-Up) instead.

---

## 🔍 **TROUBLESHOOTING**

### **Problem: Wrong redirect after login**

**Check:**
1. User role in database (should be UPPERCASE)
2. Browser console for errors (F12)
3. Session cookie exists (DevTools → Application → Cookies)

**Fix:**
```sql
-- Update role to correct value in database
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

---

### **Problem: Can't access any dashboard**

**Check:**
1. Backend is running: http://localhost:4000
2. Frontend is running: http://localhost:3000
3. Database is connected

**Fix:**
```powershell
# Restart backend
cd d:\HR\hr-management\backend
npm run dev

# Restart frontend
cd d:\HR\hr-management\frontend
npm run dev
```

---

### **Problem: Session lost after refresh**

**Check:**
1. `NEXTAUTH_SECRET` is set in `.env.local`
2. Cookies are enabled in browser
3. "Remember me" was checked during login

**Fix:**
Add to `frontend/.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
```

---

## 🚀 **FULL TESTING GUIDE**

For comprehensive testing with 8 detailed test cases:
📄 **Read:** `RBAC_TESTING_GUIDE.md`

---

## 📞 **QUICK COMMANDS**

```powershell
# Check if servers are running
netstat -an | findstr "3000"  # Frontend
netstat -an | findstr "4000"  # Backend
netstat -an | findstr "5555"  # Prisma Studio

# Open Prisma Studio
cd d:\HR\hr-management\backend
npx prisma studio

# Open Login Page
start http://localhost:3000/login
```

---

**⏱️ TOTAL TIME: 5 MINUTES**

**Start testing now!** 🚀

---

**END OF QUICK TEST** ✅
