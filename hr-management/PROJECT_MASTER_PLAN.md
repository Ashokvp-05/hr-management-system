# 📌 Rudratic HR Management System - Master Plan

> **Official Design & Implementation Guide**
> based on User Requirements (`d:\HR\req`) and Antigravity Agent Protocol.

---

## 1. System Architecture & Tech Stack

**Architecture Style:** Modular Monolith (Frontend) + N-Tier REST API (Backend).

### Technology Stack
- **Frontend (`@[frontend-specialist]`):** Next.js 14, Tailwind CSS v4, Lucide Icons, Shadcn/UI, Recharts (Analytics).
- **Backend (`@[backend-specialist]`):** Node.js, Express.js, TypeScript.
- **Database (`@[database-architect]`):** PostgreSQL 15, Prisma ORM.
- **Auth (`@[security-auditor]`):** NextAuth.js (JWT), Bcrypt hashing.
- **Infrastructure:** Vercel (Frontend), EC2/Railway (Backend), Cron Jobs (Notifications).

---

## 2. Antigravity Agent Mapping

We utilize the following specialized agents to deliver high-quality modules:

| Module | Responsible Agent | Status |
| :--- | :--- | :--- |
| **UI/UX Design** | `@[frontend-specialist]` | ✅ **Integrated** (Premium Glassmorphism) |
| **API & Logic** | `@[backend-specialist]` | ✅ **Integrated** (Express/Prisma) |
| **Database Design** | `@[database-architect]` | ⚠️ **Update Needed** (New Req Fields) |
| **Feature Specs** | `@[product-owner]` | ✅ **Completed** (KPI Dashboard) |
| **Security/Auth** | `@[security-auditor]` | ✅ **Secured** (JWT/RBAC) |
| **Testing** | `@[test-engineer]` | ⏳ **Pending** |
| **Documentation** | `@[documentation-writer]` | ⏳ **In Progress** |

---

## 3. Database Schema Design (Updated)

To support the new requirements (`d:\HR\req`), the schema must be evolved.

### Core Models
*   **User:**
    *   `id`, `email`, `password`, `name`, `role` (DEV/ADMIN/INTERN).
    *   `workMode`: `INTERN` | `HYBRID` | `REMOTE` (New Tag).
    *   `discordId`: String (New).
    *   `phone`: String (New).
*   **TimeEntry:**
    *   `checkIn`, `checkOut`, `duration`.
    *   `type`: `OFFICE` | `REMOTE`.
    *   `location`: JSON (For Remote Geotagging).
    *   `status`: `WORKING` | `COMPLETED` | `REST` (For auto-reset).
*   **LeaveRequest:**
    *   `type`: `CASUAL` | `MEDICAL` | `OTHER`.
    *   `status`: `PENDING` | `APPROVED` | `REJECTED`.

---

## 4. Feature Implementation List

### ✅ Phase 1: Foundation (Completed)
*   [x] Admin & User Login (Role-based).
*   [x] Dashboard UI (Glassmorphism, Dark Mode).
*   [x] Basic Clock-In/Out (Office/Remote).
*   [x] Real-time Admin Stats.

### 🚀 Phase 2: User Requirements Alignment (Next Steps)
*   **Profile Enhancements (`@[backend-specialist]`):**
    *   [ ] Add `discordId`, `workMode`, `phone` to User Profile.
    *   [ ] Front-end "Edit Profile" page.
*   **Advanced Attendance Logic (`@[backend-specialist]`):**
    *   [ ] **12-Hour Confirmation:** If duration > 12h, prompt user. No accept = Reset to "REST".
    *   [ ] **7 PM Notification:** Cron job to trigger generic alert.
    *   [ ] **Live Active List:** Admins see real-time active users list.
*   **Holidays & Leaves:**
    *   [ ] Connect "Applying for Leave" to Backend.
    *   [ ] Dropdown for Leave Types (Casual/Medical).
    *   [ ] Indian/International Holiday Calendar (Static JSON or API).

### 📊 Phase 3: Analytics & Reporting
*   **Reporting Engine (`@[database-architect]`):**
    *   [ ] Generate Excel/CSV reports for admins.
    *   [ ] Graphical views (already started with Charts).

---

## 5. API Structure Overview

### Auth
*   `POST /api/auth/login`
*   `POST /api/auth/register`

### User Operations
*   `GET /api/users/profile` (Me)
*   `PUT /api/users/profile` (Update Discord/Phone)
*   `GET /api/users` (Admin: List all users w/ WorkMode)

### Time & Attendance
*   `POST /api/time/clock-in` (Captures Location)
*   `POST /api/time/clock-out` (Triggers 12h Check)
*   `GET /api/time/active` (Admin: Who is online?)
*   `GET /api/time/history` (User: My history)

### Leaves
*   `POST /api/leaves` (Request)
*   `PUT /api/leaves/:id` (Approve/Reject)

---

## 6. Security & Compliance Plan (`@[security-auditor]`)

1.  **Geofencing:** Remote clock-ins *must* respond with lat/long (Already implemented in frontend).
2.  **Data Privacy:** User can only see *their own* data (RBAC enforced in `auth.middleware.ts`).
3.  **Integrity:** 12-hour reset rule prevents "fake" overnight hours.

---

## 7. Testing Checklist (`@[test-engineer]`)

*   [ ] **Unit:** Test Salary Calculation logic.
*   [ ] **Integration:** Test Clock-In -> DB Save -> Clock-Out flow.
*   [ ] **E2E:** Login as User -> Request Leave -> Login as Admin -> Approve Leave.
