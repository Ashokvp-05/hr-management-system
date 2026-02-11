# 🚀 Deployment Guide - HR Management System

This guide explains how to deploy the **Frontend** (Next.js) to **Vercel** and the **Backend** (Express + PostgreSQL) to **Railway / Render**.

---

## 🏗️ Phase 1: Deploy Backend & Database

We will use **Railway** (easiest) or **Render** for the backend + database.

### **Option A: Railway (Recommended)**

1.  **Login** to [Railway.app](https://railway.app/).
2.  **Create Project** -> "Deploy from GitHub repo".
3.  Select `hr-management-system`.
4.  **Add Database**:
    -   Click "New" -> Database -> PostgreSQL.
    -   Click heavily on the PostgreSQL card -> Connect -> Copy `DATABASE_URL`.
5.  **Configure Backend Service**:
    -   Go to Settings -> "Root Directory" -> Set to `hr-management/backend`.
    -   Go to specific Variables:
        ```
        PORT=4000
        DATABASE_URL=<Paste from step 4>
        JWT_SECRET=super_secure_random_string_here
        FRONTEND_URL=https://your-vercel-app-url.vercel.app (You will update this later)
        NODE_ENV=production
        ```
    -   **Build Command**: `npm install && npx prisma generate && npm run build`
    -   **Start Command**: `npm start`
6.  **Deploy**: Click Deploy. Wait for it to turn Green 🟢.
7.  **Run Migrations**:
    -   In Railway, click on the **Backend Service**.
    -   Go to "CLI" tab or "Command Palette".
    -   Run: `npx prisma migrate deploy`
    -   Run: `npx prisma db seed` (to create Admin user).
8.  **Copy Backend URL**:
    -   Go to Settings -> Domains -> Copy the generated URL (e.g., `https://hr-backend-production.up.railway.app`).

---

## 🌐 Phase 2: Deploy Frontend (Vercel)

1.  **Login** to [Vercel](https://vercel.com).
2.  **Add New Project** -> "Import" `hr-management-system`.
3.  **Configure Project**:
    -   **Framework Preset**: Next.js (Auto-detected).
    -   **Root Directory**: Click Edit -> Select `hr-management/frontend`.
4.  **Environment Variables**:
    -   Add the following variables:
        ```
        NEXT_PUBLIC_API_URL=<Your Backend URL from Phase 1>/api
        NEXTAUTH_URL=https://<your-vercel-project-name>.vercel.app (or auto-assigned)
        NEXTAUTH_SECRET=another_super_secure_random_string
        ```
        *Note: Ensure `NEXT_PUBLIC_API_URL` ends with `/api` unless your backend routes don't use it, but our app does.*
5.  **Deploy**: Click "Deploy".
6.  **Wait** for the celebration confetti! 🎉

---

## 🔗 Phase 3: Final Connection Check

1.  **Update Backend CORS**:
    -   Go back to **Railway/Render Backend Settings**.
    -   Update `FRONTEND_URL` to your actual Vercel URL (e.g., `https://hr-system-ashok.vercel.app`).
    -   Redeploy Backend.

2.  **Test Live**:
    -   Open your Vercel URL.
    -   Login with Admin (admin@hrms.com / Admin@123).
    -   Verify data loads correctly.

---

## 🛠️ Troubleshooting

### **1. "Prisma Client not initialized" on Backend**
-   Ensure your Build Command includes `npx prisma generate`.

### **2. Frontend Login Fails**
-   Check `NEXT_PUBLIC_API_URL` variable in Vercel. It MUST point to the *deployed* backend, NOT localhost.
-   Check Backend Logs in Railway for CORS errors.

### **3. Styles Missing / 404s**
-   Ensure "Root Directory" was set correctly during deployment setup.

---

**You are now Live! 🌍**
