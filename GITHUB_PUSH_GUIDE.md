# 📤 GitHub Push Guide - HR Management System

## 🎯 Complete Step-by-Step Instructions

### **Prerequisites**
- ✅ Git installed
- ✅ GitHub account created
- ✅ Code is working locally

---

## 📝 Step 1: Initialize Git Repository

Open PowerShell in the project root (`d:\HR`) and run:

```powershell
# Navigate to project directory
cd d:\HR

# Initialize Git repository
git init

# Check status
git status
```

---

## 🔧 Step 2: Configure Git (First Time Only)

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

## 📦 Step 3: Stage All Files

```powershell
# Add all files to staging
git add .

# Verify files are staged
git status
```

You should see files in green (staged for commit).

---

## 💾 Step 4: Create First Commit

```powershell
# Commit with a descriptive message
git commit -m "Initial commit: Complete HR Management System with Next.js and Express"
```

---

## 🌐 Step 5: Create GitHub Repository

### **Option A: Using GitHub Website**

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Fill in details:
   - **Repository name**: `hr-management-system`
   - **Description**: "Enterprise HR Management System with Next.js, Express, and PostgreSQL"
   - **Visibility**: Choose **Public** or **Private**
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (we already have them)
4. Click **"Create repository"**

### **Option B: Using GitHub CLI** (if installed)

```powershell
# Login to GitHub
gh auth login

# Create repository
gh repo create hr-management-system --public --source=. --remote=origin
```

---

## 🔗 Step 6: Connect to GitHub Repository

After creating the repository on GitHub, you'll see a setup page. Copy the commands or use these:

```powershell
# Add GitHub as remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git

# Verify remote was added
git remote -v
```

---

## 🚀 Step 7: Push to GitHub

```powershell
# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

### **If you get authentication error:**

**Option 1: Using Personal Access Token (Recommended)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Give it a name: "HR Management System"
4. Select scopes:
   - ✅ `repo` (full control)
   - ✅ `workflow`
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use token as password:
   ```
   Username: YOUR_GITHUB_USERNAME
   Password: YOUR_PERSONAL_ACCESS_TOKEN
   ```

**Option 2: Using SSH**

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
Get-Content ~/.ssh/id_ed25519.pub | clip

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL instead:
git remote set-url origin git@github.com:YOUR_USERNAME/hr-management-system.git
```

---

## ✅ Step 8: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/hr-management-system`
2. You should see all your files!
3. README.md should be displayed on the main page

---

## 🔄 Future Updates (After Making Changes)

```powershell
# Check what changed
git status

# Stage changes
git add .

# Commit changes
git commit -m "Describe your changes here"

# Push to GitHub
git push
```

---

## 📋 Quick Reference Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
```

---

## 🔒 IMPORTANT: Security Checklist

Before pushing, ensure:

- ✅ `.gitignore` file is present
- ✅ No `.env` files are included
- ✅ No `node_modules/` directories
- ✅ No database credentials in code
- ✅ No API keys or secrets

### **Verify with:**
```powershell
# Check what will be committed
git status

# See ignored files
git status --ignored
```

---

## 🎨 Customize GitHub Repository

After pushing, add these to your GitHub repo:

### **1. Add Topics/Tags**
Go to repository → About ⚙️ → Add topics:
- `nextjs`
- `react`
- `typescript`
- `expressjs`
- `postgresql`
- `prisma`
- `hr-management`
- `employee-management`

### **2. Add Description**
```
Enterprise HR Management System - Employee tracking, attendance, leave management, payroll
```

### **3. Set Homepage**
```
http://localhost:3000
```

### **4. Add License**
Create `LICENSE` file with MIT license (if open source)

---

## 📸 Optional: Add Screenshots

1. Take screenshots of your application
2. Create `screenshots/` folder
3. Add images
4. Reference in README.md

---

## 🐛 Troubleshooting

### **Error: "fatal: not a git repository"**
```powershell
git init
```

### **Error: "remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git
```

### **Error: "failed to push some refs"**
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### **Accidentally committed .env file?**
```powershell
# Remove from Git (keeps local file)
git rm --cached .env
git rm --cached hr-management/backend/.env
git rm --cached hr-management/frontend/.env.local

# Commit the removal
git commit -m "Remove environment files from tracking"

# Push
git push
```

---

## ✅ Final Checklist

Before sharing your repository:

- [ ] All code pushed to GitHub
- [ ] README.md is complete and clear
- [ ] `.gitignore` is working (no sensitive files)
- [ ] Repository description added
- [ ] Topics/tags added
- [ ] License added (if applicable)
- [ ] Screenshots added (optional)
- [ ] Test credentials documented
- [ ] Installation instructions verified

---

## 📤 Quick Push Script

Save this as `push.ps1` for quick pushes:

```powershell
# Quick Push Script
git add .
git commit -m "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push
Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green
```

Usage:
```powershell
.\push.ps1
```

---

## 🎉 You're Done!

Your HR Management System is now on GitHub! 

**Share your repository:**
```
https://github.com/YOUR_USERNAME/hr-management-system
```

---

**Need help?** Check GitHub's documentation: https://docs.github.com/en/get-started
