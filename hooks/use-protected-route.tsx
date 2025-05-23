"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

type UseProtectedRouteOptions = {
  redirectTo?: string
  requiredPermission?: string
  requiredRole?: string | string[]
}

export function useProtectedRoute({
  redirectTo = "/login",
  requiredPermission,
  requiredRole,
}: UseProtectedRouteOptions = {}) {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Check for required permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/unauthorized")
      return
    }

    // Check for required role
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!hasRole(roles as any)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    redirectTo,
    pathname,
    requiredPermission,
    requiredRole,
    hasPermission,
    hasRole,
  ])

  return { isLoading, isAuthenticated }
}
