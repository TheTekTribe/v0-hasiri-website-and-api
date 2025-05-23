import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    const supabase = createServerClient()

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Add a delay to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500))
      return errorResponse(error.message, 401)
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      return errorResponse("Failed to retrieve user profile", 500)
    }

    // Get user permissions
    const { data: permissions } = await supabase
      .from("user_permissions")
      .select("permission_name")
      .eq("user_id", data.user.id)

    // Record login attempt
    await supabase.from("login_history").insert({
      user_id: data.user.id,
      ip_address: request.headers.get("x-forwarded-for") || request.ip || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      success: true,
    })

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: data.user.email_confirmed_at !== null,
      },
      profile,
      permissions: permissions?.map((p) => p.permission_name) || [],
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return errorResponse("Login failed: " + (error as Error).message, 500)
  }
}
