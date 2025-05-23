# Hasiri Authentication & Authorization System

This document outlines the authentication and authorization system implemented for the Hasiri platform.

## Overview

The authentication system is built on Supabase Auth with custom extensions for role-based access control (RBAC) and permission-based authorization. It provides a secure, scalable, and user-friendly authentication experience.

## Features

- **User Authentication**
  - Email/password authentication
  - Social login (Google, Facebook)
  - Email verification
  - Password reset
  - Session management
  - Secure token handling

- **Authorization**
  - Role-based access control (RBAC)
  - Permission-based authorization
  - Route protection
  - Component-level access control

- **Security**
  - CSRF protection
  - Rate limiting
  - Secure password handling
  - Audit logging
  - Session expiration

- **User Experience**
  - Responsive design
  - Loading states
  - Error handling
  - Form validation
  - Redirect after authentication

## Architecture

### Client-Side

- **Auth Context**: Central provider for authentication state
- **Protected Routes**: Components that require authentication
- **Role Guard**: Component for role-based access control
- **Permission Guard**: Component for permission-based access control

### Server-Side

- **Middleware**: Route protection and token validation
- **API Routes**: Authentication endpoints
- **Database**: User profiles, permissions, and audit logs

## Database Schema

- **profiles**: Extends Supabase auth.users with additional user information
- **permissions**: Available permissions in the system
- **user_permissions**: Many-to-many relationship between users and permissions
- **login_history**: Audit log of authentication events

## User Roles

- **customer**: Regular user with basic permissions
- **farmer**: User with farming-related permissions
- **vendor**: User with product selling permissions
- **employee**: Internal staff with limited admin access
- **admin**: Full system access

## Permissions

Permissions follow a `{action}_{resource}` naming convention:

- **view_products**: Ability to view product listings
- **manage_products**: Ability to create, update, and delete products
- **view_orders**: Ability to view all orders
- **manage_orders**: Ability to update order status and details
- **view_own_orders**: Ability to view own orders
- **place_orders**: Ability to place new orders
- **view_users**: Ability to view user accounts
- **manage_users**: Ability to create, update, and delete users
- **view_analytics**: Ability to view analytics data
- **manage_content**: Ability to manage website content
- **manage_settings**: Ability to manage system settings
- **manage_roles**: Ability to manage roles and permissions

## Usage

### Protecting Routes

\`\`\`tsx
// In a page component
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
\`\`\`

### Role-Based Component Rendering

\`\`\`tsx
// In a component
import RoleGuard from "@/components/auth/role-guard";

export default function UserActions() {
  return (
    <div>
      <RoleGuard allowedRoles={["admin", "employee"]}>
        <AdminActions />
      </RoleGuard>
      
      <RoleGuard allowedRoles={["customer"]}>
        <CustomerActions />
      </RoleGuard>
    </div>
  );
}
\`\`\`

### Permission-Based Component Rendering

\`\`\`tsx
// In a component
import PermissionGuard from "@/components/auth/permission-guard";

export default function OrderActions() {
  return (
    <div>
      <PermissionGuard requiredPermissions={["manage_orders"]}>
        <UpdateOrderButton />
      </PermissionGuard>
      
      <PermissionGuard requiredPermissions={["view_orders"]}>
        <ViewOrderDetailsButton />
      </PermissionGuard>
    </div>
  );
}
\`\`\`

### Using Auth Context

\`\`\`tsx
// In a component
import { useAuth } from "@/context/auth-context";

export default function ProfileButton() {
  const { user, profile, signOut } = useAuth();
  
  if
\`\`\`
