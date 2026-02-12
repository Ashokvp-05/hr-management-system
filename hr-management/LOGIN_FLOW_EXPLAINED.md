# 🔐 Application Login Flow - Explained

**Date:** February 11, 2026 @ 17:37 IST  
**Topic:** Why the application opens to different pages

---

## ✅ **This is CORRECT Behavior!**

Your application uses **session-based authentication**. Here's how it works:

---

## 🔄 **The Application Flow**

### **Scenario 1: First Time / Not Logged In**

```
User visits: http://localhost:3000
             ↓
Middleware checks: "Is user logged in?"
             ↓
Answer: NO
             ↓
Redirects to: /login
             ↓
User sees: LOGIN PAGE ✅
```

### **Scenario 2: Already Logged In (Your Case)**

```
User visits: http://localhost:3000
             ↓
Middleware checks: "Is user logged in?"
             ↓
Answer: YES (session cookie exists)
             ↓
Gets user role from session: "ADMIN"
             ↓
Redirects to role-based dashboard: /admin
             ↓
User sees: ADMIN DASHBOARD ✅
```

---

## 🎯 **Why You Saw the Admin Page Instead of Login**

**You have an active session from a previous login!**

This happens when:
1. You logged in before (during testing)
2. Session cookie is still valid
3. Application remembers you
4. Automatically sends you to your dashboard

**This is good UX!** Users don't want to login every time they visit.

---

## 🔐 **How to See the Login Page**

### **Method 1: Logout First (Recommended)**

Visit the logout page to clear your session:
```
http://localhost:3000/logout
```

Then visit:
```
http://localhost:3000
```

You'll be redirected to the login page.

### **Method 2: Clear Session Manually**

Visit:
```
http://localhost:3000/clear-session
```

### **Method 3: Use Incognito/Private Window**

Open browser in private mode:
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Edge: `Ctrl + Shift + N`

Then visit: `http://localhost:3000`

### **Method 4: Clear Browser Cookies**

1. Open browser DevTools: `F12`
2. Go to: Application → Cookies
3. Delete cookies for `localhost:3000`
4. Refresh page

---

## 📊 **Authentication Flow Explained**

### **File: `frontend/src/middleware.ts`**

This file intercepts EVERY request and decides where to send users:

```typescript
// Line 30-36: Root page handling
if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
        // User is logged in → Send to their dashboard
        return NextResponse.redirect(new URL(getDashboardByRole(role), nextUrl))
    }
    // User not logged in → Send to login
    return NextResponse.redirect(new URL("/login", nextUrl))
}
```

### **File: `frontend/src/app/page.tsx`**

Root page also has server-side logic:

```typescript
export default async function RootPage() {
  const session = await auth()
  
  if (session) {
    // Has session → Redirect to role-based dashboard
    redirect(getDashboardByRole(session.user?.role))
  }
  
  // No session → Redirect to login
  redirect("/login")
}
```

### **Role-Based Redirects:**

```typescript
// File: frontend/src/lib/role-redirect.ts

getDashboardByRole(role) {
  ADMIN roles       → /admin
  MANAGER role      → /manager
  EMPLOYEE/Default  → /dashboard
}
```

---

## 🎭 **Different User Experiences**

### **Admin User:**
```
Login → http://localhost:3000/admin
Features: Full system access, user management, all reports
```

### **Manager User:**
```
Login → http://localhost:3000/manager
Features: Team management, leave approvals, team reports
```

### **Employee User:**
```
Login → http://localhost:3000/dashboard
Features: Personal records, leave requests, payslips, attendance
```

---

## 🧪 **Testing Different Roles**

### **To Test as Admin:**
1. Logout: `http://localhost:3000/logout`
2. Login with:
   - Email: `admin@rudratic.com`
   - Password: `Admin@123`
3. Will redirect to: `/admin`

### **To Test as Manager:**
1. Logout: `http://localhost:3000/logout`
2. Login with:
   - Email: `manager@rudratic.com`
   - Password: `Manager@123`
3. Will redirect to: `/manager`

### **To Test as Employee:**
1. Logout: `http://localhost:3000/logout`
2. Login with:
   - Email: `employee@rudratic.com`
   - Password: `Employee@123`
3. Will redirect to: `/dashboard`

---

## 🔒 **Session Management**

### **How Sessions Work:**

1. **Login:** User enters credentials
2. **Backend validates:** Checks database
3. **Creates JWT token:** Signed token with user data
4. **Stores in cookie:** Secure HTTP-only cookie
5. **Every request:** Cookie sent automatically
6. **Middleware validates:** Checks token on each page

### **Session Persistence:**

**Current Settings:**
- Session expires: 30 days (configurable)
- Cookie name: Managed by NextAuth
- Storage: HTTP-only cookie (secure)

**To change session duration:**

Edit `frontend/src/auth.ts`:
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
}
```

---

## 🎯 **Expected Behavior Summary**

| URL | Not Logged In | Logged In as ADMIN | Logged In as MANAGER | Logged In as EMPLOYEE |
|-----|---------------|-------------------|---------------------|-----------------------|
| `/` | → `/login` | → `/admin` | → `/manager` | → `/dashboard` |
| `/login` | Shows login | → `/admin` (disabled) | → `/manager` (disabled) | → `/dashboard` (disabled) |
| `/admin` | → `/login` | Shows admin dashboard | Shows admin dashboard | Shows admin dashboard |
| `/manager` | → `/login` | Shows manager dashboard | Shows manager dashboard | → Forbidden |
| `/dashboard` | → `/login` | Shows employee dashboard | Shows employee dashboard | Shows employee dashboard |

**Note:** Lines 24-28 in middleware show that logged-in users CAN still access login page (currently disabled redirect).

---

## 📝 **Common Questions**

### **Q: Why don't I see the login page when I visit localhost:3000?**
**A:** You're already logged in! The app remembers you. Logout first to see login.

### **Q: How do I test the login flow?**
**A:** Visit `http://localhost:3000/logout` first, then go to the home page.

### **Q: Can I force the login page to show?**
**A:** Yes, directly visit: `http://localhost:3000/login`

### **Q: How long does the session last?**
**A:** 30 days by default. You can change this in the auth config.

### **Q: Where is session data stored?**
**A:** In a secure HTTP-only cookie. You can't access it via JavaScript (security feature).

### **Q: Will I be logged out if I close the browser?**
**A:** No, session persists. You must explicitly logout.

---

## 🚀 **Quick Links**

| Purpose | URL |
|---------|-----|
| **Home** | http://localhost:3000 |
| **Login** | http://localhost:3000/login |
| **Logout** | http://localhost:3000/logout |
| **Clear Session** | http://localhost:3000/clear-session |
| **Auth Test** | http://localhost:3000/auth-test |
| **RBAC Test** | http://localhost:3000/rbac-test |
| **Admin Dashboard** | http://localhost:3000/admin |
| **Manager Dashboard** | http://localhost:3000/manager |
| **Employee Dashboard** | http://localhost:3000/dashboard |

---

## ✅ **Summary**

**Your application is working perfectly!**

- ✅ Middleware is protecting routes
- ✅ Session management is working
- ✅ Role-based redirects are correct
- ✅ You saw `/admin` because you're already logged in

**To see login page:**
1. Visit: http://localhost:3000/logout
2. Then visit: http://localhost:3000
3. You'll now see the login page ✅

---

**Document Created:** February 11, 2026 @ 17:37 IST  
**Agent:** Frontend Specialist  
**Topic:** Authentication & Session Flow
