# HR Management System - Complete Setup Guide

## 🎯 Real-World Production Flow

This guide will help you start the project correctly for real-world usage.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ Node.js installed (v18 or higher)
- ✅ PostgreSQL installed and running
- ✅ Database `hr_db` created
- ✅ Environment files configured

---

## 🔧 Step 1: Verify Database Connection

### Check PostgreSQL is running:
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
```

### Test database connection:
```powershell
# Navigate to backend
cd d:\HR\hr-management\backend

# Test Prisma connection
npx prisma db pull
```

If successful, you should see: "Introspecting based on datasource..."

---

## 🗄️ Step 2: Database Setup

### Apply migrations and seed data:
```powershell
# Still in backend directory
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

This will:
- Create all database tables
- Generate Prisma client
- Seed initial roles (ADMIN, MANAGER, EMPLOYEE)
- Create test users

---

## 🚀 Step 3: Start Backend Server

```powershell
# In backend directory (d:\HR\hr-management\backend)
npm run dev
```

**Expected output:**
```
Server is running on port 4000
Initializing Cron Jobs...
```

**Backend will be available at:** `http://localhost:4000`

**Keep this terminal running!**

---

## 🎨 Step 4: Start Frontend Server

Open a **NEW terminal** and run:

```powershell
# Navigate to frontend
cd d:\HR\hr-management\frontend

# Start development server
npm run dev
```

**Expected output:**
```
▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
✓ Ready in X.Xs
```

**Frontend will be available at:** `http://localhost:3000`

**Keep this terminal running!**

---

## 🧪 Step 5: Test the Complete Flow

### 5.1 Clear Any Existing Session
1. Open browser
2. Visit: `http://localhost:3000/logout`
3. Or clear browser cookies for localhost:3000

### 5.2 Test Authentication Flow

#### A. Visit Root URL
- Go to: `http://localhost:3000`
- **Expected**: Redirect to `/login` (Ultra-Premium dark theme)

#### B. Test Registration
1. Click **"Sign Up"** on login page
2. Fill the form:
   - **Name**: John Doe
   - **Email**: john@company.com
   - **Password**: Test@123
   - **Confirm Password**: Test@123
3. Click **"Create Account"**
4. **Expected**: 
   - Success toast message
   - Redirect to `/login?registered=true`
   - See "Registration successful! Please login." message

#### C. Test Login
1. Enter credentials:
   - **Email**: john@company.com
   - **Password**: Test@123
2. Click **"Sign In"**
3. **Expected**:
   - Success toast "Welcome back"
   - Redirect to `/dashboard`
   - See the HR dashboard

#### D. Test Protected Routes
1. While logged in, try to visit `/login`
   - **Expected**: Redirect to `/dashboard`
2. Click logout (from dashboard user menu)
3. Try to visit `/dashboard`
   - **Expected**: Redirect to `/login`

---

## 🔐 Default Test Accounts

After seeding, these accounts are available:

### Admin Account
- **Email**: admin@rudratic.com
- **Password**: Rudratic@Admin#2026
- **Role**: ADMIN
- **Access**: Full system access

### Manager Account
- **Email**: manager@rudratic.com
- **Password**: Rudratic@Mgr#2026
- **Role**: MANAGER
- **Access**: Team management

### Employee Account
- **Email**: employee@rudratic.com
- **Password**: Rudratic@User#2026
- **Role**: EMPLOYEE
- **Access**: Basic features

---

## 📊 Step 6: Verify Database (Optional)

Open Prisma Studio to view database:

```powershell
# In backend directory
npx prisma studio
```

**Prisma Studio will open at:** `http://localhost:5555`

You can view:
- Users table
- Roles table
- All other tables

---

## 🎯 Real-World Usage Checklist

### ✅ For Development:
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Database connected and seeded
- [ ] Can register new users
- [ ] Can login with credentials
- [ ] Protected routes working
- [ ] Session management working

### ✅ For Production:
- [ ] Update `AUTH_SECRET` in `.env.local` (use strong random string)
- [ ] Update `JWT_SECRET` in backend `.env`
- [ ] Configure real Google OAuth credentials
- [ ] Set up production database
- [ ] Configure email service for password reset
- [ ] Build frontend: `npm run build`
- [ ] Use PM2 or similar for backend process management

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `backend/.env`
3. Ensure database `hr_db` exists

### Issue: "Port 3000 already in use"
**Solution:**
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Restart frontend
npm run dev
```

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```powershell
cd backend
npx prisma generate
```

### Issue: Login redirects to dashboard immediately
**Solution:**
- You have an active session
- Visit `/logout` to clear session
- Or use incognito/private browsing

---

## 📁 Project Structure

```
hr-management/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── .env                 # Backend config
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/      # Auth pages
    │   │   ├── (dashboard)/ # Protected pages
    │   │   └── page.tsx     # Root redirect
    │   ├── components/      # Reusable components
    │   ├── auth.ts          # NextAuth config
    │   └── middleware.ts    # Route protection
    └── .env.local           # Frontend config
```

---

## 🚀 Quick Start Commands

### Terminal 1 (Backend):
```powershell
cd d:\HR\hr-management\backend
npm run dev
```

### Terminal 2 (Frontend):
```powershell
cd d:\HR\hr-management\frontend
npm run dev
```

### Terminal 3 (Optional - Database UI):
```powershell
cd d:\HR\hr-management\backend
npx prisma studio
```

---

## 📞 Support

If you encounter any issues:
1. Check both terminal outputs for errors
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check the troubleshooting section above

---

**Your HR Management System is ready for real-world use!** 🎉
