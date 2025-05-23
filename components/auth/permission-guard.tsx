"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/context/auth-context"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermissions: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

export default function PermissionGuard({
  children,
  requiredPermissions,
  requireAll = true,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (requiredPermissions.length === 0) {
    return <>{children}</>
  }

  const hasAccess = requireAll
    ? requiredPermissions.every((permission) => hasPermission(permission))
    : requiredPermissions.some((permission) => hasPermission(permission))

  if (!hasAccess) {
    return fallback
  }

  return <>{children}</>
}
