# 🏢 Rudratic HR Management System

> Enterprise-grade Human Resources Management Platform with Ultra-Premium UI/UX

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ Ultra-Premium dark theme login/register pages
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ JWT-based session management
- ✅ Password recovery flow
- ✅ Social login ready (Google, Microsoft, GitHub)

### 📊 Core HR Modules
- ✅ Employee Management
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Performance Reviews
- ✅ Kudos & Recognition
- ✅ Wellness Checks
- ✅ Ticket System
- ✅ Notifications & Announcements

### 🎨 Premium UI/UX
- ✅ Glassmorphism design
- ✅ Animated backgrounds
- ✅ Smooth transitions
- ✅ Dark mode optimized
- ✅ Responsive design
- ✅ Mouse spotlight effects

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Git installed

### Option 1: Automated Start (Recommended)

```powershell
# Navigate to project root
cd d:\HR\hr-management

# Run the start script
.\start.ps1
```

This will:
- ✅ Check prerequisites
- ✅ Setup database
- ✅ Start backend server (port 4000)
- ✅ Start frontend server (port 3000)
- ✅ Open browser automatically

### Option 2: Manual Start

#### Terminal 1 - Backend
```powershell
cd backend
npm install
npx prisma generate
npm run dev
```

#### Terminal 2 - Frontend
```powershell
cd frontend
npm install
npm run dev
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:4000 | REST API |
| **Prisma Studio** | http://localhost:5555 | Database GUI |
| **Auth Test** | http://localhost:3000/auth-test | Test authentication |

---

## 👤 Default Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@rudratic.com | Rudratic@Admin#2026 | Full system access |
| **Manager** | manager@rudratic.com | Rudratic@Mgr#2026 | Team management |
| **Employee** | employee@rudratic.com | Rudratic@User#2026 | Basic features |

---

## 📁 Project Structure

```
hr-management/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeder
│   └── .env                # Backend configuration
│
├── frontend/               # Next.js 16 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/    # Authentication pages
│   │   │   └── (dashboard)/ # Protected pages
│   │   ├── components/    # Reusable components
│   │   ├── auth.ts        # NextAuth configuration
│   │   └── middleware.ts  # Route protection
│   └── .env.local         # Frontend configuration
│
├── start.ps1              # Quick start script
├── SETUP_GUIDE.md         # Detailed setup guide
└── README.md              # This file
```

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/hr_db"
JWT_SECRET="your-secret-key"
```

### Frontend (.env.local)
```env
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 🧪 Testing the Authentication Flow

1. **Clear Session** (if needed)
   ```
   Visit: http://localhost:3000/logout
   ```

2. **Test Login**
   ```
   Visit: http://localhost:3000/login
   Use any default account credentials
   ```

3. **Test Registration**
   ```
   Visit: http://localhost:3000/register
   Create a new account
   ```

4. **Test Protected Routes**
   ```
   Try accessing /dashboard without login
   Should redirect to /login
   ```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[AUTH_INTEGRATION_GUIDE.md](./AUTH_INTEGRATION_GUIDE.md)** - Authentication system details
- **[API Documentation](./backend/README.md)** - Backend API reference

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Auth**: NextAuth.js v5
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Validation**: Zod

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Restart servers
.\start.ps1
```

### Database Connection Error
```powershell
# Check PostgreSQL service
Get-Service -Name postgresql*

# Verify database exists
psql -U postgres -c "\l"
```

### Prisma Client Error
```powershell
cd backend
npx prisma generate
```

For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting)

---

## 📈 Development Workflow

### Database Changes
```powershell
# Create migration
cd backend
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Code Quality
```powershell
# Frontend linting
cd frontend
npm run lint

# Type checking
npm run type-check
```

---

## 🚢 Deployment

### Production Build

#### Frontend
```powershell
cd frontend
npm run build
npm run start
```

#### Backend
```powershell
cd backend
npm run build
npm run start:prod
```

### Environment Variables
- Update all secrets in production
- Use strong random strings for `AUTH_SECRET` and `JWT_SECRET`
- Configure production database URL
- Set up email service for password reset

---

## 📝 License

This project is proprietary software developed for Rudratic Technologies.

---

## 👥 Support

For issues or questions:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review the [Troubleshooting](#-troubleshooting) section
3. Contact the development team

---

## 🎯 Current Status

✅ **Authentication System** - Fully integrated and tested  
✅ **Database Schema** - Complete with all HR modules  
✅ **Backend API** - All endpoints functional  
✅ **Frontend UI** - Ultra-premium design implemented  
✅ **Route Protection** - Middleware configured  
✅ **Session Management** - NextAuth.js integrated  

**Ready for review and testing!** 🚀

---

<div align="center">
  <strong>Built with ❤️ by Rudratic Technologies</strong>
</div>
