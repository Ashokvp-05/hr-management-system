# 🚀 Quick Start Installation Guide

## 📋 What You Need to Install

### **1. Node.js (v20.x or higher)**
- **Download**: https://nodejs.org/
- **Check if installed**: 
  ```bash
  node --version
  ```
- **Required for**: Running JavaScript/TypeScript code

### **2. PostgreSQL (v14 or higher)**
- **Download**: https://www.postgresql.org/download/
- **Check if installed**:
  ```bash
  psql --version
  ```
- **Required for**: Database

### **3. Git**
- **Download**: https://git-scm.com/downloads
- **Check if installed**:
  ```bash
  git --version
  ```
- **Required for**: Version control

---

## ⚡ Quick Installation (5 Minutes)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/hr-management-system.git
cd hr-management-system
```

### **Step 2: Install Backend Dependencies**
```bash
cd hr-management/backend
npm install
```

### **Step 3: Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### **Step 4: Setup Database**

**Create database:**
```bash
# Open PostgreSQL terminal
psql -U postgres

# Create database
CREATE DATABASE hr_db;

# Exit
\q
```

**Configure environment:**

Create `hr-management/backend/.env`:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hr_db"
JWT_SECRET="change-this-secret-key"
```

Create `hr-management/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="change-this-nextauth-secret"
```

**Run migrations:**
```bash
cd hr-management/backend
npx prisma migrate dev
npx prisma db seed
```

### **Step 5: Start Servers**

**Terminal 1 - Backend:**
```bash
cd hr-management/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd hr-management/frontend
npm run dev
```

### **Step 6: Test Login**

Open http://localhost:3000

**Test Accounts:**
- Admin: `admin@hrms.com` / `Admin@123`
- Manager: `manager@hrms.com` / `Manager@123`
- Employee: `employee@hrms.com` / `Employee@123`

---

## ✅ Verification Checklist

- [ ] Node.js v20+ installed
- [ ] PostgreSQL v14+ installed
- [ ] Git installed
- [ ] Dependencies installed (backend & frontend)
- [ ] Database created and migrated
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Can login with test credentials
- [ ] Dashboard loads successfully

---

## 🐛 Common Issues & Fixes

### **"npm: command not found"**
→ Install Node.js from https://nodejs.org/

### **"psql: command not found"**
→ Install PostgreSQL from https://www.postgresql.org/

### **"Port 3000 already in use"**
```bash
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **"Database connection failed"**
→ Check PostgreSQL is running and DATABASE_URL is correct

### **"Prisma Client not generated"**
```bash
cd hr-management/backend
npx prisma generate
```

---

## 📞 Need Help?

1. Check the full README.md
2. Read GITHUB_PUSH_GUIDE.md
3. Open an issue on GitHub
4. Contact: support@rudratic.com

---

**Estimated Setup Time: 5-10 minutes** ⏱️
