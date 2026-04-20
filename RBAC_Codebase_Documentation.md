# RBAC Implementation in Ziplofy Codebase

> Documentation of Role-Based Access Control (RBAC) across **Ziplofy3b** (backend) and **frontend** folders.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Backend (Ziplofy3b)](#2-backend-ziplofy3b)
3. [Frontend](#3-frontend)
4. [Permission Model](#4-permission-model)
5. [Routes & Enforcement](#5-routes--enforcement)
6. [File Reference](#6-file-reference)

---

## 1. Overview

The Ziplofy platform uses a **Section-Subsection** RBAC model:

- **Users** are assigned a single **Role** (1:1)
- **Roles** define **permissions** at Section and Subsection level
- **Permission types**: `view`, `edit`, `upload`
- **Super Admin** bypasses all checks and has full access

| Component | Location | Purpose |
|-----------|----------|---------|
| Role model | Ziplofy3b | Stores role definitions and permissions |
| User model | Ziplofy3b | Links users to roles |
| Auth middleware | Ziplofy3b | `protect`, `authorize`, `authorizePermission` |
| Permission hooks | frontend | `usePermissions`, `usePermissionCheck` |
| Roles UI | frontend | RolesPermission page for managing roles |
| Sidebar | frontend | Visibility based on `usePermissions` |

---

## 2. Backend (Ziplofy3b)

### 2.1 Data Models

#### User (`src/models/user.model.ts`)

```ts
{
  name, email, password,
  role: ObjectId → Role,
  status: "active" | "inactive" | "suspended",
  assignedSupportDeveloperId: ObjectId | null
}
```

- Each user has exactly one `role` (reference to Role).
- Users are authenticated via JWT; `protect` middleware attaches `req.user` with `role`, `superAdmin`, etc.

#### Role (`src/models/role.model.ts`)

```ts
{
  name: "super-admin" | "support-admin" | "developer-admin" | "client-admin",
  description: string,
  isSuperAdmin: boolean,
  permissions: [
    {
      section: "Client List" | "Payment" | "Invoice" | "User Management" | ...,
      permissions: ["view" | "edit" | "upload"],
      subsections?: [
        { subsection: string, permissions: ["view" | "edit" | "upload"] }
      ]
    }
  ]
}
```

**Role methods:**

- `hasPermission(section, permission)` – section-level check
- `hasSubsectionPermission(section, subsection, permission)` – subsection-level check
- `addPermission`, `addSubsectionPermission`, `removePermission`, `removeSubsectionPermission`

**Built-in roles (seed):**

| Role | Description | Access |
|------|-------------|--------|
| `super-admin` | Full system access | All permissions (isSuperAdmin: true) |
| `support-admin` | Support team | Client List, User Management, Support |
| `developer-admin` | Developer team | Client List, Developer, Support |
| `client-admin` | Client admin | Client List, Payment, Invoice, Support (view only) |

#### Permission Definition (separate model)

- `src/models/permission/permission-definition.model.ts` – hierarchical permission definitions (e.g. `orders.view`, `orders.edit.apply_discounts`).
- Used by `seed.permissions.ts` for a finer-grained (Ziplofy-style) permission catalog.
- **Note:** The main RBAC in the app uses the **Role.permissions** structure (section/subsection), not this permission-definition model.

### 2.2 Auth Middleware (`src/middlewares/auth.middleware.ts`)

| Middleware | Description |
|------------|-------------|
| `protect` | Validates JWT, loads user (from DB or JWT payload), sets `req.user` |
| `authorize(...roles)` | Ensures `req.user.role` is in the allowed roles; super-admin bypasses |
| `authorizePermission(section, permission, subsection?)` | Checks Role `hasPermission` / `hasSubsectionPermission`; super-admin bypasses |
| `optionalAuth` | Same as protect but does not fail if no token; attaches `req.user` when valid |

**Special behavior:**

- Super-admin token (`SUPER_ADMIN_TOKEN`) and `req.user.superAdmin === true` bypass role and permission checks.
- `authorizePermission` supports alternative mappings: `Theme Management` ↔ `Developer` → `Theme Developer`.

---

## 3. Frontend

### 3.1 Auth Context (`src/contexts/admin-auth.context.tsx`)

- `useAdminAuth()` provides: `user`, `token`, `login`, `verifyOtp`, `logout`
- `user` shape: `{ id, name, email, roleId, roleName, roleLevel }`
- After login/`/auth/me`: `roleName`, `superAdmin`, and `roleWithPermissions` are stored (localStorage + context).

### 3.2 Permission Hooks

#### `usePermissions` (`src/hooks/usePermissions.ts`)

- Source: `/auth/me` → `roleWithPermissions.permissions` (or `/roles` as fallback)
- Super-admin: all permissions for all sections

**Exports:**

| Function | Purpose |
|----------|---------|
| `hasViewPermission(section, subsection?)` | view or edit/upload implies view |
| `hasEditPermission(section, subsection?)` | edit |
| `hasUploadPermission(section, subsection?)` | upload |
| `getPermissionDetails(section, subsection?)` | `{ canView, canEdit, canUpload, hasAnyPermission }` |

**Structure used:**

```ts
{
  "Client List": { permissions: ["view","edit","upload"] },
  "Developer": {
    permissions: ["view"],
    subsections: { "Theme Developer": ["view","edit","upload"] }
  }
}
```

#### `usePermissionCheck` (`src/hooks/usePermissionCheck.ts`)

- Simpler hook: `usePermissionCheck(section, subsection?)` → `{ canView, canEdit, canUpload, hasAnyPermission }`
- Super-admin: all true; non-super-admin: currently returns all false (placeholder; TODO: connect to real role permissions).

### 3.3 Permission Components (`src/Components/PermissionGate.tsx`)

- `PermissionGate` – conditionally renders children based on action/section/subsection
- `PermissionButton` – disabled when permission missing
- `PermissionIcon` – icon changes based on permission

Used in ThemeDeveloper, ManageUser, PermissionExamples, etc.

### 3.4 Roles & Permissions UI (`src/Components/pages/RolesPermission.tsx`)

- Lists roles from `GET /roles`
- Super-admin only: can edit role permissions
- Edits saved via `PUT /roles/:id/permissions`
- Sections/subsections match sidebar structure (Client List, Payment, Invoice, User Management, Membership, Developer, Support, etc.)

### 3.5 Sidebar (`src/Components/Sidebar.tsx`)

- Uses `usePermissions` and `hasViewPermission`
- Visibility: Client List, Payment, Invoice, User Management, Membership, Developer, Support, Theme Management
- Super-admin sees all; others see sections/subsections based on role permissions.

---

## 4. Permission Model

### 4.1 Sections (Backend Role Model)

| Section | Subsections |
|---------|-------------|
| Client List | — |
| Payment | — |
| Invoice | — |
| User Management | Manage User, Roles and Permission |
| Membership | Membership Plan |
| Developer | Dev Admin, Theme Developer, Support Developer, Hire Developer Requests |
| Support | Domain, Ticket, Raise Task, Live Support |
| Theme Management | — |

### 4.2 Permission Types

| Type | Meaning |
|------|---------|
| `view` | Can see the section/subsection |
| `edit` | Can modify existing content |
| `upload` | Can add/create new content |

**Rules:**

- Granting `edit` or `upload` auto-includes `view` (backend and frontend).
- Removing `view` is disallowed when `edit` or `upload` are present.

---

## 5. Routes & Enforcement

### 5.1 Role Routes (`/api/roles`)

| Method | Path | Middleware | Who |
|--------|------|------------|-----|
| GET | / | protect, authorize(super-admin, support-admin, developer-admin, client-admin) | All admin roles |
| GET | /:id | same | All admin roles |
| POST | / | same | All admin roles |
| PUT | /:id | same | All admin roles |
| PUT | /:id/permissions | same | Only super-admin can change permissions (enforced in controller) |
| DELETE | /:id | same | All admin roles |

### 5.2 User Routes (`/api/users`)

| Method | Path | Middleware |
|--------|------|------------|
| GET | / | protect, authorizePermission("User Management", "view", "Manage User") |
| GET | /:id | protect, authorizePermission("User Management", "view", "Manage User") |
| POST | / | protect, authorizePermission("User Management", "upload", "Manage User") |
| PUT | /:id | protect, authorizePermission("User Management", "edit", "Manage User") |
| DELETE | /:id | protect, authorizePermission("User Management", "edit", "Manage User") |

### 5.3 Theme Routes (`/api/themes`)

| Method | Path | Middleware |
|--------|------|------------|
| GET | /stats | protect, authorize(super-admin) |
| POST | / | protect, authorizePermission("Theme Management", "upload") |
| PUT | /:id | protect, authorizePermission("Theme Management", "edit") |
| DELETE | /:id | protect, authorizePermission("Theme Management", "edit") |

`authorizePermission("Theme Management", …)` also accepts `Developer` → `Theme Developer` as an alternative.

### 5.4 Client Users Route

- `GET /api/client-users` – `authorizePermission("Client List", "view")`

### 5.5 Assigned Support Developer

- `POST /api/assigned-support-developer` – `protect`, `authorize(super-admin)` only

---

## 6. File Reference

### Ziplofy3b (Backend)

| File | Purpose |
|------|---------|
| `src/models/user.model.ts` | User schema, role reference |
| `src/models/role.model.ts` | Role schema, permission helpers |
| `src/models/permission/permission-definition.model.ts` | Hierarchical permission catalog |
| `src/middlewares/auth.middleware.ts` | protect, authorize, authorizePermission |
| `src/controllers/auth.controller.ts` | Login, getMe (includes roleWithPermissions) |
| `src/controllers/role.controller.ts` | CRUD roles, updateRolePermissions |
| `src/controllers/permission.controller.ts` | getAllPermissions (permission definitions) |
| `src/routes/auth.route.ts` | /auth/me, login, etc. |
| `src/routes/role.route.ts` | /roles CRUD |
| `src/routes/user.route.ts` | /users with authorizePermission |
| `src/routes/theme.route.ts` | /themes with authorizePermission |
| `src/seed/roles/seed.roles.ts` | Default roles |
| `src/seed/permissions/seed.permissions.ts` | Permission definitions (separate catalog) |
| `src/types/index.ts` | RoleType enum |

### Frontend

| File | Purpose |
|------|---------|
| `src/contexts/admin-auth.context.tsx` | Admin auth state, /auth/me |
| `src/hooks/usePermissions.ts` | Main permission hooks |
| `src/hooks/usePermissionCheck.ts` | Simple permission check (placeholder logic) |
| `src/Components/PermissionGate.tsx` | PermissionGate, PermissionButton, PermissionIcon |
| `src/Components/pages/RolesPermission.tsx` | Roles & permissions management UI |
| `src/Components/Sidebar.tsx` | Sidebar visibility from permissions |
| `src/Components/pages/ThemeDeveloper.tsx` | Theme developer with permission checks |
| `src/Components/pages/ManageUser.tsx` | User management with permission checks |
| `src/PERMISSION_IMPLEMENTATION_GUIDE.md` | Implementation guide for developers |

---

## Summary

- **RBAC is section/subsection based** with `view`, `edit`, `upload`.
- **Ziplofy3b** enforces it via `authorize` (role-based) and `authorizePermission` (permission-based).
- **Frontend** uses `usePermissions` (and in some places `usePermissionCheck`) and `PermissionGate` for conditional rendering.
- **Super Admin** always bypasses checks; permission changes are restricted to super-admin in the roles UI and backend.
