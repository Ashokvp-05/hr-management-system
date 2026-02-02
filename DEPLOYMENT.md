# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (Optional)

## Backend Deployment

1. **Environment Variables**:
   Copy `.env.example` to `.env` and populate:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`

2. **Build**:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```

3. **Start**:
   ```bash
   npm start
   ```

## Frontend Deployment

1. **Environment Variables**:
   Copy `.env.example` to `.env.local` and populate:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

2. **Build**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Start**:
   ```bash
   npm start
   ```

## Docker Deployment

Use the provided `docker-compose.yml` (to be created) for a full stack deployment.
