# 🔗 HR Management System - Access Links

## 📱 **FRONTEND (Next.js)**

### Local Development
- **URL**: http://localhost:3000
- **Location**: `d:\HR\hr-management\frontend`
- **Start Command**:
  ```powershell
  cd d:\HR\hr-management\frontend
  npm run dev
  ```

### Production Build
- **Start Command**:
  ```powershell
  npm run build
  npm start
  ```

---

## ⚙️ **BACKEND (Express API)**

### Local Development
- **URL**: http://localhost:5000
- **Location**: `d:\HR\hr-management\backend`
- **Start Command**:
  ```powershell
  cd d:\HR\hr-management\backend
  npm run dev
  ```

### API Endpoints
- **Base URL**: `http://localhost:5000/api`
- **Auth**: `/api/auth/*`
- **Employees**: `/api/employees/*`
- **Attendance**: `/api/attendance/*`
- **Leave**: `/api/leave/*`
- **Payroll**: `/api/payroll/*`
- **Reports**: `/api/reports/*`

---

## 🗄️ **DATABASE (PostgreSQL)**

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database Name**: `hr_db`
- **Username**: `postgres`
- **Password**: `Ashok@005`

### Connection String
```
postgresql://postgres:Ashok%40005@127.0.0.1:5432/hr_db
```

### Database Tools Access

#### **pgAdmin**
- **URL**: http://localhost:5050 (if installed)
- Connect using above credentials

#### **Command Line (psql)**
```powershell
psql -h localhost -U postgres -d hr_db
```

#### **Prisma Studio** (Database GUI)
```powershell
cd d:\HR\hr-management\backend
npx prisma studio
```
- Opens at: http://localhost:5555

---

## 🚀 **GITHUB REPOSITORY**

- **Repository**: https://github.com/Ashokvp-05/hr-management-system
- **Clone Command**:
  ```powershell
  git clone https://github.com/Ashokvp-05/hr-management-system.git
  ```

---

## 🔧 **QUICK START (Run Everything)**

### Terminal 1 - Database
```powershell
# If using local PostgreSQL, ensure it's running
# Check status: Get-Service postgresql*
```

### Terminal 2 - Backend
```powershell
cd d:\HR\hr-management\backend
npm run dev
```
✅ Backend running at: **http://localhost:5000**

### Terminal 3 - Frontend
```powershell
cd d:\HR\hr-management\frontend
npm run dev
```
✅ Frontend running at: **http://localhost:3000**

---

## 📊 **SYSTEM PORTS**

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (Express) | 5000 | http://localhost:5000/api |
| Database (PostgreSQL) | 5432 | localhost:5432 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 🔐 **ENVIRONMENT VARIABLES**

### Backend `.env` Location
`d:\HR\hr-management\backend\.env`

```env
DATABASE_URL="postgresql://postgres:Ashok%40005@127.0.0.1:5432/hr_db"
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend `.env.local` Location
`d:\HR\hr-management\frontend\.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

---

## 🛠️ **USEFUL COMMANDS**

### Check if Ports are in Use
```powershell
# Check Frontend port (3000)
netstat -ano | findstr :3000

# Check Backend port (5000)
netstat -ano | findstr :5000

# Check Database port (5432)
netstat -ano | findstr :5432
```

### Kill Process on Port
```powershell
# Find PID
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Commands
```powershell
# Run migrations
cd d:\HR\hr-management\backend
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

---

## 📝 **DEFAULT LOGIN CREDENTIALS**

After seeding the database:

### Admin
- **Email**: admin@hrms.com
- **Password**: Admin@123

### Employee
- **Email**: employee@hrms.com
- **Password**: Employee@123

### Manager
- **Email**: manager@hrms.com
- **Password**: Manager@123

---

## 🌐 **DEPLOYMENT LINKS** (When Deployed)

### Frontend
- **Production**: _(To be deployed on Vercel)_
- **Vercel Dashboard**: https://vercel.com/dashboard

### Backend
- **Production**: _(To be deployed on Railway/Render)_
- **Railway Dashboard**: https://railway.app/dashboard
- **Render Dashboard**: https://dashboard.render.com

### Database
- **Production**: _(To be deployed on Neon/Supabase)_
- **Neon Dashboard**: https://console.neon.tech
- **Supabase Dashboard**: https://app.supabase.com

---

## 📞 **SUPPORT & DOCUMENTATION**

- **Project Documentation**: `d:\HR\README.md`
- **Master Plan**: `d:\HR\MASTER_PLAN.md`
- **Deployment Guide**: `d:\HR\DEPLOYMENT.md`
- **Architecture**: `d:\HR\High-Level Architecture Diagram`

---

## ✅ **HEALTH CHECKS**

### Backend Health
```bash
curl http://localhost:5000/health
```

### Database Connection Test
```bash
cd d:\HR
node test-connection.js
```

---

**Last Updated**: 2026-02-02  
**Project**: HR Management System  
**Developer**: Ashokvp-05
