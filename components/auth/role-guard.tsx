"use client"

import type { ReactNode } from "react"
import { useAuth, type UserRole } from "@/context/auth-context"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { profile } = useAuth()

  if (!profile) {
    return fallback
  }

  if (!allowedRoles.includes(profile.role)) {
    return fallback
  }

  return <>{children}</>
}
