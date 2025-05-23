import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/products",
  "/api/categories",
  "/api/homepage",
]

// Routes that require specific roles
const roleProtectedRoutes = {
  "/admin": ["admin"],
  "/admin/products": ["admin"],
  "/admin/categories": ["admin"],
  "/admin/orders": ["admin", "employee"],
  "/admin/users": ["admin"],
  "/admin/content": ["admin"],
  "/admin/analytics": ["admin"],
  "/admin/appearance": ["admin"],
  "/admin/settings": ["admin"],
  "/admin/roles": ["admin"],
  "/admin/homepage": ["admin"],
  "/admin/testimonials": ["admin"],
  "/admin/branding": ["admin"],
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const pathname = request.nextUrl.pathname

  // Skip authentication for public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  // Skip authentication for static files
  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i) || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  // Get the authorization header or cookie
  const authHeader = request.headers.get("authorization")
  const cookies = request.cookies

  // Create Supabase client
  const supabase = createServerClient()

  // Check for session in cookies first (for browser requests)
  let session = null
  const supabaseSessionCookie = cookies.get("sb-session")

  if (supabaseSessionCookie) {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data.session) {
        session = data.session
      }
    } catch (error) {
      console.error("Error getting session from cookie:", error)
    }
  }

  // If no session from cookie, try the Authorization header (for API requests)
  if (!session && authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    if (token) {
      try {
        const { data, error } = await supabase.auth.getUser(token)
        if (!error && data.user) {
          // We have a valid user, but we need the full session for role checks
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData.session) {
            session = sessionData.session
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error)
      }
    }
  }

  // If no valid session, redirect to login for browser requests or return 401 for API requests
  if (!session) {
    const isApiRequest = pathname.startsWith("/api/")
    if (isApiRequest) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    } else {
      const returnUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url))
    }
  }

  // Add the user ID to the request headers for downstream use
  requestHeaders.set("x-user-id", session.user.id)

  // Check for role-protected routes
  for (const [routePrefix, allowedRoles] of Object.entries(roleProtectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (profileError || !profile || !allowedRoles.includes(profile.role)) {
        const isApiRequest = pathname.startsWith("/api/")
        if (isApiRequest) {
          return NextResponse.json({ error: "Access denied" }, { status: 403 })
        } else {
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
      }
    }
  }

  // Continue with the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure the middleware to run for all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
