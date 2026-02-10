# Admin Dashboard & Workflow Guide

## Overview

The Admin Dashboard is the central command center for the HR Management System. It allows Administrators to:
- Approve or Reject **User Registrations**.
- Approve or Reject **Leave Requests**.
- View System Statistics.
- Access Quick Links for Payroll and Employee Management.

## Accessing the Dashboard

1. Log in with an account that has the `ADMIN` role.
2. Click on the **Admin Overview** link in the navigation bar (or visit `/admin`).
3. Note: Regular users cannot see this page.

## Key Features

### 1. Action Center (Approvals)

The **Action Center** is the main interactive widget on the dashboard. It contains two tabs:

#### Leave Requests Tab
- **Purpose**: Manage incoming leave requests from employees.
- **Actions**:
    - **Approve**: Grants the leave.
    - **Refuse**: Rejects the request.
- **Data displayed**: Employee Name, Leave Type (Sick, Casual, etc.), Dates, and Reason.

#### Pending Users Tab
- **Purpose**: Moderate new signups (if the system requires approval).
- **Actions**:
    - **Approve**: Activates the user account.
    - **Refuse**: Deactivates/Deletes the pending request.

### 2. Quick Stats
The top row displays real-time counters:
- **Total Employees**: Total active users.
- **Pending Approvals**: Count of leaves waiting for review.
- **New Signups**: Count of users waiting for activation.

### 3. Quick Actions
Sidebar provides direct links to:
- **All Leave History**: Full archive of past leaves.
- **Run Payroll**: Navigate to payroll module.
- **Manage Users**: Full user list management.

## Role Definitions

### 1. Administrator (`ADMIN`)
- **Access**: Full Read/Write.
- **Responsibilities**: Manage users, approvals, payroll, and settings.

### 2. Manager (`MANAGER`) - View Only
- **Access**: Read-Only view of team data.
- **Capabilities**:
    - View Team Attendance
    - View Working Hours & Leave Status
    - View Reports & Analytics
- **Restrictions**:
    - **Cannot** Approve/Reject Requests.
    - **Cannot** Edit User Profiles.
    - **Cannot** Modify Attendance.
    - **Cannot** Access System Settings.
- **Visual Indicator**: Dashboard displays "Manager View (Read-Only)".

## Technical Notes for Developers

- **Route**: `src/app/(dashboard)/admin/page.tsx`
- **Component Structure**: 
    - Server Component (`page.tsx`) fetches initial data.
    - Client Component (`AdminActionCenter.tsx`) handles interactions.
- **API Endpoints**:
    - `GET /api/admin/stats`
    - `GET /api/admin/pending-users`
    - `GET /api/leaves/all`
    - `PUT /api/leaves/:id/approve`
    - `PUT /api/admin/users/:id/approve`

## Troubleshooting

- **"Failed to fetch"**: Ensure the backend server (`localhost:4000`) is running.
- **"403 Forbidden"**: Ensure your user has `role: 'ADMIN'` in the database.
