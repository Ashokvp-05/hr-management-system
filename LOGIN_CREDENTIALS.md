# 🔐 HR Management System - Login Credentials

**Last Updated**: 2026-02-11 11:46 IST

---

## ✅ **ACTIVE LOGIN CREDENTIALS**

### **Admin Account**
```
Email:    admin@hrms.com
Password: Admin@123
Role:     ADMIN
Access:   Full system access + Admin dashboard
URL:      http://localhost:3000/admin
```

### **Manager Account**
```
Email:    manager@hrms.com
Password: Manager@123
Role:     MANAGER
Access:   Team management + Manager dashboard
URL:      http://localhost:3000/manager
```

### **Employee Account**
```
Email:    employee@hrms.com
Password: Employee@123
Role:     EMPLOYEE
Access:   Personal dashboard + Basic features
URL:      http://localhost:3000/dashboard
```

---

## 🚀 **How to Login**

1. **Open browser** (or Incognito window to test fresh login)
2. **Visit**: `http://localhost:3000`
3. **You'll be redirected to**: `/login`
4. **Enter credentials** from above
5. **After login**: Automatically redirected to role-based dashboard

---

## 🧪 **Testing the Flow**

### **Test 1: Employee Flow**
```
1. Open Incognito: http://localhost:3000
2. Should redirect to: /login
3. Login with: employee@hrms.com / Employee@123
4. Should redirect to: /dashboard ✅
```

### **Test 2: Manager Flow**
```
1. Logout or use new Incognito
2. Visit: http://localhost:3000
3. Login with: manager@hrms.com / Manager@123
4. Should redirect to: /manager ✅
```

### **Test 3: Admin Flow**
```
1. Logout or use new Incognito
2. Visit: http://localhost:3000
3. Login with: admin@hrms.com / Admin@123
4. Should redirect to: /admin ✅
```

---

## 🔄 **Logout Options**

When you need to logout to test different roles:

- **Option 1**: Visit `http://localhost:3000/logout`
- **Option 2**: Visit `http://localhost:3000/clear-session`
- **Option 3**: Use Incognito window (no session stored)

---

## 📊 **User Details**

| User | Name | Department | Designation |
|------|------|------------|-------------|
| admin@hrms.com | System Admin | IT | Administrator |
| manager@hrms.com | Sarah Manager | Sales | Sales Director |
| employee@hrms.com | John Doe | Engineering | Software Engineer |

---

## ✅ **Database Status**

- ✅ All 3 users created successfully
- ✅ Passwords hashed with bcrypt
- ✅ Roles assigned correctly
- ✅ Mock attendance data seeded (last 7 days)
- ✅ Mock leave requests added
- ✅ Audit logs populated

---

## 🌐 **Application URLs**

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Running |
| Backend API | http://localhost:4000 | ✅ Running |
| Prisma Studio | http://localhost:5555 | ✅ Running |

---

**Now you can login with your preferred credentials!** 🎉
