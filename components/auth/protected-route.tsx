"use client"

import type React from "react"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string | string[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isLoading } = useProtectedRoute({
    redirectTo,
    requiredPermission,
    requiredRole,
  })

  const { isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will be redirected by the hook
  }

  return <>{children}</>
}
