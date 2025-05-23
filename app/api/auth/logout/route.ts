import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get the token from the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Invalid authorization header", 401)
    }

    const token = authHeader.split(" ")[1]

    // Get user ID before signing out (for audit log)
    const { data: userData } = await supabase.auth.getUser(token)
    const userId = userData?.user?.id

    // Sign out the user
    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      return errorResponse(error.message, 400)
    }

    // Log the logout event if we have a user ID
    if (userId) {
      await supabase.from("login_history").insert({
        user_id: userId,
        ip_address: request.headers.get("x-forwarded-for") || request.ip || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        event_type: "logout",
        success: true,
      })
    }

    return successResponse(null, "Logged out successfully")
  } catch (error) {
    console.error("Logout error:", error)
    return errorResponse("Logout failed: " + (error as Error).message, 500)
  }
}
