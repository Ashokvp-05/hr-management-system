# 🧪 HR Management System - Module 1 Test Cases

## 📋 Test Suite Overview

- **Project**: HR Management System
- **Module**: Module 1 (Core Features)
- **Version**: 1.0.0
- **Test Types**: Functional, Security, UI/UX, Performance

---

## 🔐 1. Authentication & Security

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **AUTH-01** | **Admin Login** | 1. Go to `/login`<br>2. Enter Email: `admin@hrms.com`<br>3. Enter Pass: `Admin@123`<br>4. Click Login | Redirects to `/admin` dashboard. No errors. | High |
| **AUTH-02** | **Manager Login** | 1. Enter Email: `manager@hrms.com`<br>2. Enter Pass: `Manager@123`<br>3. Click Login | Redirects to `/manager` dashboard. | High |
| **AUTH-03** | **Employee Login** | 1. Enter Email: `employee@hrms.com`<br>2. Enter Pass: `Employee@123`<br>3. Click Login | Redirects to `/dashboard` (Employee view). | High |
| **AUTH-04** | **Invalid Login** | 1. Enter valid email<br>2. Enter wrong password<br>3. Click Login | Shows "Invalid credentials" toast error. URL stays on `/login`. | High |
| **AUTH-05** | **Protected Route** | 1. Logout<br>2. Try to access `/admin`<br>3. Check URL | Redirects to `/login`. | High |
| **AUTH-06** | **Role Barrier** | 1. Login as Employee<br>2. Manually type `/admin` in URL | Redirects back to `/dashboard` or shows 403 Forbidden. | High |
| **AUTH-07** | **Logout** | 1. Click Profile Avatar<br>2. Click Logout | Session cleared. Redirects to `/login`. | Medium |

---

## ⏱️ 2. Time & Attendance

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **ATT-01** | **Clock In (Office)** | 1. Dashboard > Click "Clock In"<br>2. Select "In Office"<br>3. Confirm | Timer starts. Button changes to "Clock Out". Status: Active. | High |
| **ATT-02** | **Clock In (Remote)** | 1. Dashboard > Click "Clock In"<br>2. Select "Remote"<br>3. Confirm | Timer starts. Status: Active (Remote). | High |
| **ATT-03** | **Clock Out** | 1. Ensure Clocked In<br>2. Wait 1 min<br>3. Click "Clock Out" | Timer stops. Total hours calculated. Entry saved in history. | High |
| **ATT-04** | **Double Clock In** | 1. Clock In<br>2. Try to Clock In again (if possible) | UI should prevent this or show "Already clocked in" error. | Medium |
| **ATT-05** | **Min Time check** | 1. Clock In<br>2. Immediately Clock Out (<1 min) | Error: "Cannot clock out within 3 minutes". | Medium |
| **ATT-06** | **View History** | 1. Go to Attendance page | Shows list of past clock-ins with correct duration and dates. | Medium |

---

## 📅 3. Leave Management

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **LEAVE-01** | **Apply Leave** | 1. Go to Leaves > "Apply Leave"<br>2. Select Type (Sick)<br>3. Pick Dates<br>4. Add Reason > Submit | Request created. Status: "Pending". Balance unchanged (until approved). | High |
| **LEAVE-02** | **Invalid Dates** | 1. Apply Leave<br>2. Set End Date before Start Date | Validation Error: "End date must be after start date". | Medium |
| **LEAVE-03** | **Approve Leave** | 1. Login as Manager/Admin<br>2. Go to Leave Requests<br>3. Click "Approve" on pending item | Status changes to "Approved". Employee balance deducted. | High |
| **LEAVE-04** | **Reject Leave** | 1. Login as Manager<br>2. Click "Reject"<br>3. Enter Reason | Status changes to "Rejected". Employee sees rejection reason. | High |
| **LEAVE-05** | **Check Balance** | 1. Employee Dashboard<br>2. Check Leave Balance widget | Shows correct remaining days for Sick/Casual/Vacation. | Medium |

---

## 👥 4. Employee Management (Admin)

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **EMP-01** | **Create User** | 1. Admin > Users > "Add User"<br>2. Fill Form (Name, Email, Role)<br>3. Save | User created. Included in user list. Password hashed. | High |
| **EMP-02** | **Edit User** | 1. Click "Edit" on user<br>2. Change Department<br>3. Save | User details updated in comprehensive view. | Medium |
| **EMP-03** | **Deactivate User** | 1. Select User<br>2. Change Status to Inactive | User cannot login. | Medium |
| **EMP-04** | **Filter Users** | 1. Users List<br>2. Search by "Admin" or Name | List filters correctly showing matching records. | Low |

---

## 🎫 5. Ticketing System

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **TKT-01** | **Create Ticket** | 1. Click "? Support" Icon<br>2. Fill Subject/Desc<br>3. Priority: High | Ticket # generated. Admin receives notification (mock). | Medium |
| **TKT-02** | **View Tickets** | 1. Admin > Help Desk | New ticket appears in list with correct status/priority. | Medium |
| **TKT-03** | **Resolve Ticket** | 1. Admin > Help Desk<br>2. Update Status -> Resolved | User sees ticket as "Resolved" in their history. | Medium |

---

## 📢 6. Announcements

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **ANC-01** | **Post Update** | 1. Admin > Announcements<br>2. Create New<br>3. Select "All Company" | Announcement appears on Employee Dashboards. | Medium |

---

## 📄 7. Payslip System (Admin)

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **PAY-01** | **Upload Payslip** | 1. Admin > Payroll > Upload<br>2. Select Employee & File | File uploaded. Record created in DB. | Medium |
| **PAY-02** | **Download** | 1. Employee > Payslips<br>2. Click Download | PDF file downloads successfully. | High |

---

## 🧪 8. Performance & UI

| ID | Test Scenario | Steps | Expected Result | Priority |
|----|--------------|-------|-----------------|----------|
| **PERF-01** | **Dashboard Load** | 1. Login<br>2. Observe load time | Dashboard widgets load in < 1.5s. Skeletons show while loading. | Medium |
| **UI-01** | **Dark Mode** | 1. Click Theme Toggle<br>2. Switch to Dark | UI colors invert correctly. Text remains readable. | Low |
| **UI-02** | **Mobile Menu** | 1. Resize browser < 768px<br>2. Check Sidebar | Sidebar collapses/becomes hamburger menu. | Medium |

---

## 🐛 Defect Reporting Format

If a test fails, report issues in this format:
```text
Defect ID: BUG-001
Title: [Feature Name] - Brief description
Steps to Reproduce:
1. ...
2. ...
Expected: ...
Actual: ...
Severity: High/Medium/Low
Screenshot: (path/to/image)
```
