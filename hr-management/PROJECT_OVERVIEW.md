# 🏢 Rudratic Nexus HR - Project Overview

## 🌟 Project Description
**Rudratic Nexus HR** is a modern, enterprise-grade Human Resource Management System (HRMS) designed to streamline workforce management. It serves as a central hub for employees, managers, and administrators to handle daily operations efficiently.

The system features a **role-based architecture**, ensuring secure access to data and providing tailored interfaces for different user types. Built with a focus on **User Experience (UX)** and **Performance**, it utilizes a cutting-edge tech stack (Next.js 15, Node.js, PostgreSQL).

---

## 🚀 Key Features

### 1. **Smart Dashboard**
-   **Real-time Analytics**: Visual interaction for attendance, leave balances, and productivity.
-   **Widgets**: Clock-in/out, Team Availability, Upcoming Events, and AI Coach.

### 2. **Role-Based Access Control (RBAC)**
-   **Admin Console**: Full system control, user management, and security logs.
-   **Manager View**: Team oversight, leave approvals, and performance tracking.
-   **Employee Portal**: Personal stats, attendance marking, and self-service requests.

### 3. **Core Modules**
-   **⏱️ Attendance Tracking**: Geolocation-based clock-in/out with visual timeline.
-   **📅 Leave Management**: Request leaves, view balances, and track approval status.
-   **🎫 Help Desk / Ticketing**: Raise issues (IT, HR, Admin) and track resolution.
-   **👤 Profile Management**: Manage personal details and settings.

---

## 🔄 User Workflows

### 1. **Authentication Flow**
1.  **User Visits**: `http://localhost:3000/clear-session` (Ensures clean login state)
2.  **Login**: Enters credentials at the Login Page.
3.  **Role Check**: System specifically identifies the user role (Admin/Manager/Employee).
4.  **Smart Redirect**:
    -   **Admins** ➔ Redirected to **/admin/dashboard**
    -   **Managers** ➔ Redirected to **/manager/dashboard**
    -   **Employees** ➔ Redirected to **/dashboard** (Main User Dashboard)

### 2. **Employee Daily Routine**
1.  **Login** ➔ View Personal Dashboard.
2.  **Clock In** ➔ Use the "Clock In" widget (captures time & location).
3.  **Work** ➔ Dashboard updates "Total Hours" and "Productivity" in real-time.
4.  **Request Leave** ➔ Navigate to Leave module ➔ Submit request ➔ Manager notified.
5.  **Report Issue** ➔ Open Help Desk ➔ Create Ticket ➔ Track status.

### 3. **Admin Management Flow**
1.  **Login** ➔ View Admin Console (High-level stats).
2.  **User Management** ➔ Add new employees or update roles.
3.  **Monitor System** ➔ Check system health and security logs.
4.  **Resolve Tickets** ➔ View raised tickets ➔ Assign priority ➔ Resolve.

---

## 🛠️ Technical Workflow

### **Frontend (Next.js 16)**
-   **Client Side**: React components, Tailwind CSS styling, Lucide icons.
-   **Routing**: App Router (`src/app`) for seamless navigation.
-   **State**: `zustand` and `React Context` for managing app state.
-   **Auth**: `NextAuth.js` manages sessions and JWT tokens.

### **Backend (Node.js + Express)**
-   **API Server**: Handles business logic at `http://localhost:4000`.
-   **Security**: JWT verification middleware protects sensitive routes.
-   **Database**: **PostgreSQL** (via **Prisma ORM**) stores all user and transactional data.

### **Data Flow**
`User Action` (Frontend) ➔ `Next.js API Route` ➔ `Backend API` (Express) ➔ `Prisma ORM` ➔ `PostgreSQL Database`

---

## 📂 Project Structure
```
d:\HR\hr-management\
├── 📂 frontend/        # Next.js Application
│   ├── src/app/        # Pages & Routing
│   ├── src/components/ # UI Components
│   └── src/lib/        # Utilities (Redirects, API config)
│
└── 📂 backend/         # Node.js API Server
    ├── src/controllers/ # Logic handlers
    ├── src/routes/      # API Endpoints
    └── prisma/          # Database Schema
```
