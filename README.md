# 🚀 Rudratic HR Management System

A comprehensive, enterprise-grade Human Resources Management System built with **Next.js 16**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### **Core Modules**
- ✅ **Authentication & Authorization** - JWT-based auth with role-based access control (RBAC)
- ✅ **Employee Management** - Complete employee lifecycle management
- ✅ **Time & Attendance** - Clock in/out, overtime tracking, remote work support
- ✅ **Leave Management** - Leave requests, approvals, balance tracking
- ✅ **Payslip Generation** - Automated payslip creation and distribution
- ✅ **Performance Tracking** - Employee performance monitoring and analytics
- ✅ **Ticketing System** - Issue tracking and resolution
- ✅ **Announcements** - Company-wide and department-specific announcements
- ✅ **Reports & Analytics** - Comprehensive reporting with data export
- ✅ **Admin Dashboard** - Real-time system monitoring and controls

### **Additional Features**
- 🎨 **Modern UI/UX** - Dark mode, responsive design, smooth animations
- 🔒 **Security** - Helmet.js, CORS, input validation, SQL injection prevention
- 📊 **Data Visualization** - Charts and graphs using Recharts
- 🔔 **Real-time Notifications** - Toast notifications and in-app alerts
- 🌐 **Multi-role Support** - Admin, Manager, Employee dashboards
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- ⚡ **Performance Optimized** - Lazy loading, compression, caching

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with Server Components |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.1.18 | Styling |
| **Framer Motion** | 12.30.0 | Animations |
| **Radix UI** | Latest | Accessible components |
| **Recharts** | 3.7.0 | Data visualization |
| **NextAuth.js** | 5.0.0-beta | Authentication |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **TypeScript** | 5.3.3 | Type safety |
| **Prisma ORM** | 5.10.2 | Database ORM |
| **PostgreSQL** | 14+ | Database |
| **bcrypt** | 3.0.3 | Password hashing |
| **JWT** | 9.0.3 | Token-based auth |
| **Helmet.js** | 7.1.0 | Security headers |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

### **Required Software**

1. **Node.js** (v20.x or higher)
   ```bash
   # Check version
   node --version
   # Should be v20.0.0 or higher
   ```
   📥 Download: https://nodejs.org/

2. **PostgreSQL** (v14 or higher)
   ```bash
   # Check version
   psql --version
   # Should be 14.x or higher
   ```
   📥 Download: https://www.postgresql.org/download/

3. **Git**
   ```bash
   # Check version
   git --version
   ```
   📥 Download: https://git-scm.com/downloads

4. **npm** or **yarn** (comes with Node.js)
   ```bash
   npm --version
   # or
   yarn --version
   ```

---

## 🚀 Installation

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/hr-management-system.git
cd hr-management-system
```

### **Step 2: Install Dependencies**

#### **Backend Setup**
```bash
cd hr-management/backend
npm install
```

#### **Frontend Setup**
```bash
cd ../frontend
npm install
```

### **Step 3: Database Setup**

1. **Create PostgreSQL Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE hr_db;
   
   # Exit
   \q
   ```

2. **Configure Environment Variables**
   
   Create `.env` file in `hr-management/backend/`:
   ```bash
   PORT=4000
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hr_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   NODE_ENV=development
   ```

   Create `.env.local` file in `hr-management/frontend/`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your-nextauth-secret-key-change-this"
   ```

3. **Run Database Migrations**
   ```bash
   cd hr-management/backend
   npx prisma migrate dev
   npx prisma db seed
   ```
   ✅ This will create all tables and seed initial data

---

## ⚙️ Configuration

### **Environment Variables**

#### **Backend (.env)**
```env
PORT=4000                          # Backend server port
DATABASE_URL=postgresql://...      # PostgreSQL connection string
JWT_SECRET=your-secret-key         # JWT signing secret
NODE_ENV=development               # development | production
FRONTEND_URL=http://localhost:3000 # Frontend URL for CORS
```

#### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000  # Backend API URL
NEXTAUTH_URL=http://localhost:3000         # Frontend URL
NEXTAUTH_SECRET=your-nextauth-secret       # NextAuth secret
```

---

## 🎮 Running the Application

### **Development Mode**

#### **Option 1: Run Both Servers Separately**

**Terminal 1 - Backend:**
```bash
cd hr-management/backend
npm run dev
```
✅ Backend will run on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd hr-management/frontend
npm run dev
```
✅ Frontend will run on http://localhost:3000

#### **Option 2: Use Concurrently (Recommended)**

From the root directory:
```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers
concurrently "npm run dev --prefix hr-management/backend" "npm run dev --prefix hr-management/frontend"
```

### **Production Mode**

```bash
# Build frontend
cd hr-management/frontend
npm run build
npm start

# Build and run backend
cd ../backend
npm run build
NODE_ENV=production npm start
```

---

## 🧪 Testing

### **Test Credentials**

The system comes with pre-seeded test accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@hrms.com` | `Admin@123` | Full system access |
| **Manager** | `manager@hrms.com` | `Manager@123` | Team management |
| **Employee** | `employee@hrms.com` | `Employee@123` | Personal dashboard |

### **Testing Flow**

1. **Access the Application**
   ```
   http://localhost:3000
   ```

2. **Login Flow Test**
   - Visit root URL → Should redirect to `/login`
   - Enter credentials → Should redirect to role-based dashboard
   - Admin → `/admin`
   - Manager → `/manager`
   - Employee → `/dashboard`

3. **Feature Testing Checklist**

   #### **Employee Dashboard** (`employee@hrms.com`)
   - [ ] Clock In/Out
   - [ ] View attendance history
   - [ ] Request leave
   - [ ] View payslips
   - [ ] Update profile
   - [ ] View announcements

   #### **Manager Dashboard** (`manager@hrms.com`)
   - [ ] All employee features
   - [ ] Approve/reject leave requests
   - [ ] View team attendance
   - [ ] Generate team reports
   - [ ] Manage team announcements

   #### **Admin Dashboard** (`admin@hrms.com`)
   - [ ] All manager features
   - [ ] User management (CRUD)
   - [ ] System settings
   - [ ] Audit logs
   - [ ] Payroll management
   - [ ] Holiday management
   - [ ] Global announcements
   - [ ] Ticket management

### **API Testing**

Use Prisma Studio to inspect database:
```bash
cd hr-management/backend
npx prisma studio
```
Opens at http://localhost:5555

---

## 📁 Project Structure

```
hr-management-system/
├── hr-management/
│   ├── backend/                    # Express.js API
│   │   ├── prisma/
│   │   │   ├── migrations/        # Database migrations
│   │   │   ├── schema.prisma      # Database schema
│   │   │   └── seed.ts            # Seed data
│   │   ├── src/
│   │   │   ├── config/            # Configuration files
│   │   │   ├── controllers/       # Route controllers
│   │   │   ├── middleware/        # Express middleware
│   │   │   ├── routes/            # API routes
│   │   │   ├── services/          # Business logic
│   │   │   ├── app.ts             # Express app
│   │   │   └── server.ts          # Server entry point
│   │   ├── .env                   # Environment variables
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                   # Next.js application
│       ├── public/                 # Static assets
│       ├── src/
│       │   ├── app/               # App router pages
│       │   │   ├── (auth)/        # Auth pages
│       │   │   ├── (dashboard)/   # Dashboard pages
│       │   │   └── layout.tsx     # Root layout
│       │   ├── components/        # React components
│       │   ├── lib/               # Utilities
│       │   └── auth.ts            # NextAuth config
│       ├── .env.local             # Environment variables
│       ├── next.config.ts
│       ├── package.json
│       └── tailwind.config.ts
│
├── DIAGNOSTIC_REPORT.md           # System diagnostics
├── LOGIN_CREDENTIALS.md           # Test credentials
├── PERFORMANCE_OPTIMIZATIONS.md   # Performance docs
└── README.md                      # This file
```

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:4000/api
```

### **Authentication Endpoints**

#### **POST** `/api/auth/login`
Login with credentials
```json
{
  "email": "admin@hrms.com",
  "password": "Admin@123"
}
```

#### **POST** `/api/auth/register`
Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "department": "Engineering"
}
```

### **User Endpoints**
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### **Time Entry Endpoints**
- `POST /api/time/clock-in` - Clock in
- `POST /api/time/clock-out` - Clock out
- `GET /api/time/entries` - Get time entries

### **Leave Endpoints**
- `POST /api/leaves` - Create leave request
- `GET /api/leaves` - Get leave requests
- `PUT /api/leaves/:id/approve` - Approve leave (Manager/Admin)
- `PUT /api/leaves/:id/reject` - Reject leave (Manager/Admin)

### **For complete API documentation, see: `/docs` (Coming soon)**

---

## 🌐 Deployment

### **Frontend (Vercel)**

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### **Backend (Railway/Render)**

1. Push code to GitHub
2. Connect to Railway/Render
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### **Database (Neon/Supabase)**

Use managed PostgreSQL services for production:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Database Connection Error**
```bash
Error: P1001: Can't reach database server
```
**Solution:**
- Ensure PostgreSQL is running: `pg_ctl status`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -U postgres -l`

#### **2. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### **3. Module Not Found**
```bash
Error: Cannot find module...
```
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **4. Prisma Client Not Generated**
```bash
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
cd hr-management/backend
npx prisma generate
```

---

## 📸 Screenshots

### **Login Page**
![Login](./screenshots/login.png)

### **Admin Dashboard**
![Admin Dashboard](./screenshots/admin-dashboard.png)

### **Employee Dashboard**
![Employee Dashboard](./screenshots/employee-dashboard.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Rudratic Technologies** - *Initial work*

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Radix UI for accessible components
- All open-source contributors

---

## 📞 Support

For support, email support@rudratic.com or open an issue in the GitHub repository.

---

## 🔄 Changelog

### Version 1.0.0 (2026-02-11)
- ✅ Initial release
- ✅ Complete authentication system
- ✅ Employee, Manager, Admin dashboards
- ✅ Time tracking and attendance
- ✅ Leave management
- ✅ Payslip generation
- ✅ Performance optimizations
- ✅ Mobile responsive design

---

**Made with ❤️ by Rudratic Technologies**