# 🔐 Authentication & Role-Based Access Control (RBAC) Flow

## Current Implementation Analysis

### ✅ What's Working Correctly

1. **Authentication Flow**
   - ✅ Login with credentials
   - ✅ Registration with auto EMPLOYEE role assignment
   - ✅ Password hashing (bcrypt)
   - ✅ JWT token generation
   - ✅ Session management (NextAuth.js)
   - ✅ Route protection (middleware)

2. **User Roles**
   - ✅ ADMIN - Full system access
   - ✅ MANAGER - Team management
   - ✅ EMPLOYEE - Basic features

3. **Session Data**
   - ✅ User ID
   - ✅ Name
   - ✅ Email
   - ✅ Role (from database)
   - ✅ Access Token (JWT)

---

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS APPLICATION                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Visit localhost:3000 │
            └──────────┬────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Middleware Checks    │
            │  Session Status       │
            └──────────┬────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    HAS SESSION                 NO SESSION
         │                           │
         ▼                           ▼
┌────────────────┐          ┌────────────────┐
│ Redirect to    │          │ Redirect to    │
│ /dashboard     │          │ /login         │
└────────┬───────┘          └────────┬───────┘
         │                           │
         │                           ▼
         │                  ┌────────────────┐
         │                  │ User Enters    │
         │                  │ Credentials    │
         │                  └────────┬───────┘
         │                           │
         │                           ▼
         │                  ┌────────────────┐
         │                  │ POST /api/auth/│
         │                  │ login          │
         │                  └────────┬───────┘
         │                           │
         │                           ▼
         │                  ┌────────────────┐
         │                  │ Backend        │
         │                  │ Validates      │
         │                  │ Credentials    │
         │                  └────────┬───────┘
         │                           │
         │                  ┌────────┴────────┐
         │                  │                 │
         │              SUCCESS           FAILURE
         │                  │                 │
         │                  ▼                 ▼
         │         ┌────────────────┐  ┌──────────┐
         │         │ Create JWT     │  │ Error    │
         │         │ Return User    │  │ Message  │
         │         │ + Role Data    │  └──────────┘
         │         └────────┬───────┘
         │                  │
         │                  ▼
         │         ┌────────────────┐
         │         │ NextAuth       │
         │         │ Creates Session│
         │         └────────┬───────┘
         │                  │
         └──────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ User Lands on  │
         │ Dashboard      │
         │ with Role Data │
         └────────────────┘
```

---

## 🎯 Role-Based Access Control (RBAC)

### Current Status: ⚠️ **Needs Implementation**

The role data is being passed to the frontend session, but **role-based UI restrictions are not yet implemented**.

### What Needs to Be Added:

1. **Role-Based Component Visibility**
   - Hide/show features based on user role
   - Admin sees all features
   - Manager sees team management
   - Employee sees basic features

2. **Role-Based Route Protection**
   - Certain routes only for ADMIN
   - Some routes for ADMIN + MANAGER
   - Basic routes for all authenticated users

3. **Role-Based API Access**
   - Backend validates role before allowing actions
   - Prevent unauthorized API calls

---

## 🛠️ Implementation Plan

### Phase 1: Frontend Role Checks

#### 1.1 Create Role Check Hook
```typescript
// hooks/useRole.ts
import { useSession } from "next-auth/react"

export function useRole() {
    const { data: session } = useSession()
    const role = session?.user?.role

    return {
        role,
        isAdmin: role === "ADMIN",
        isManager: role === "MANAGER" || role === "ADMIN",
        isEmployee: role === "EMPLOYEE",
        hasRole: (allowedRoles: string[]) => 
            role ? allowedRoles.includes(role) : false
    }
}
```

#### 1.2 Create Role-Based Components
```typescript
// components/RoleGate.tsx
import { useRole } from "@/hooks/useRole"

export function RoleGate({ 
    children, 
    allowedRoles 
}: { 
    children: React.ReactNode
    allowedRoles: string[] 
}) {
    const { hasRole } = useRole()
    
    if (!hasRole(allowedRoles)) {
        return null
    }
    
    return <>{children}</>
}
```

#### 1.3 Usage in Dashboard
```typescript
<RoleGate allowedRoles={["ADMIN"]}>
    <AdminConsole />
</RoleGate>

<RoleGate allowedRoles={["ADMIN", "MANAGER"]}>
    <TeamManagement />
</RoleGate>

<RoleGate allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
    <MyProfile />
</RoleGate>
```

### Phase 2: Backend Role Validation

#### 2.1 Create Role Middleware
```typescript
// middleware/roleCheck.ts
export const requireRole = (allowedRoles: string[]) => {
    return async (req, res, next) => {
        const userRole = req.user?.role
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: "Insufficient permissions" 
            })
        }
        
        next()
    }
}
```

#### 2.2 Apply to Routes
```typescript
// routes/admin.routes.ts
router.get('/admin/users', 
    authMiddleware, 
    requireRole(['ADMIN']), 
    adminController.getAllUsers
)

router.get('/manager/team', 
    authMiddleware, 
    requireRole(['ADMIN', 'MANAGER']), 
    managerController.getTeam
)
```

### Phase 3: Route-Level Protection

#### 3.1 Update Middleware
```typescript
// middleware.ts
export const config = {
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const userRole = auth?.user?.role
            
            // Admin-only routes
            if (nextUrl.pathname.startsWith("/admin")) {
                return userRole === "ADMIN"
            }
            
            // Manager routes
            if (nextUrl.pathname.startsWith("/manager")) {
                return userRole === "ADMIN" || userRole === "MANAGER"
            }
            
            // Default protection
            return !!auth?.user
        }
    }
}
```

---

## 📊 Role Permissions Matrix

| Feature | ADMIN | MANAGER | EMPLOYEE |
|---------|-------|---------|----------|
| **View Dashboard** | ✅ | ✅ | ✅ |
| **My Profile** | ✅ | ✅ | ✅ |
| **My Attendance** | ✅ | ✅ | ✅ |
| **My Leave Requests** | ✅ | ✅ | ✅ |
| **Submit Tickets** | ✅ | ✅ | ✅ |
| **View Notifications** | ✅ | ✅ | ✅ |
| **Team Management** | ✅ | ✅ | ❌ |
| **Approve Leave** | ✅ | ✅ | ❌ |
| **View Team Attendance** | ✅ | ✅ | ❌ |
| **Performance Reviews** | ✅ | ✅ | ❌ |
| **User Management** | ✅ | ❌ | ❌ |
| **Role Assignment** | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ |
| **Admin Console** | ✅ | ❌ | ❌ |
| **Security Logs** | ✅ | ❌ | ❌ |
| **Database Access** | ✅ | ❌ | ❌ |

---

## 🔧 Quick Fixes Needed

### 1. Add Role to Session Type
```typescript
// types/next-auth.d.ts
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            role: string
            accessToken: string
        }
    }
}
```

### 2. Update Backend Response
The backend is already returning role correctly:
```typescript
role: user.role?.name  // ✅ Returns "ADMIN", "MANAGER", or "EMPLOYEE"
```

### 3. Frontend Session Access
```typescript
const { data: session } = useSession()
const userRole = session?.user?.role  // "ADMIN", "MANAGER", or "EMPLOYEE"
```

---

## 🧪 Testing RBAC

### Test Scenarios

1. **Admin User**
   - Login as: admin@rudratic.com
   - Should see: All features including Admin Console
   - Should access: All routes

2. **Manager User**
   - Login as: manager@rudratic.com
   - Should see: Team management features
   - Should NOT see: Admin Console, User Management

3. **Employee User**
   - Login as: employee@rudratic.com
   - Should see: Basic features only
   - Should NOT see: Team management, Admin features

---

## 📝 Implementation Checklist

- [ ] Create `useRole` hook
- [ ] Create `RoleGate` component
- [ ] Add role checks to dashboard components
- [ ] Create backend role middleware
- [ ] Apply role middleware to API routes
- [ ] Update frontend middleware for route protection
- [ ] Add TypeScript types for session
- [ ] Test all three roles
- [ ] Document role permissions
- [ ] Add role-based UI indicators

---

## 🚀 Next Steps

1. **Implement Role Hook** - Create reusable role checking logic
2. **Add Role Gates** - Protect UI components based on roles
3. **Backend Validation** - Ensure API endpoints check roles
4. **Route Protection** - Block unauthorized route access
5. **Testing** - Verify all three roles work correctly

---

## 📖 Current Flow Summary

✅ **Authentication**: Fully working
✅ **Session Management**: Fully working
✅ **Role Assignment**: Fully working
⚠️ **Role-Based UI**: Needs implementation
⚠️ **Role-Based Routes**: Needs implementation
⚠️ **Role-Based API**: Needs implementation

**The foundation is solid. Now we need to implement the RBAC layer on top of it.**
