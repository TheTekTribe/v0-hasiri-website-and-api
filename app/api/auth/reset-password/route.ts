import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return errorResponse("Password is required", 400)
    }

    const supabase = createServerClient()

    // Get user from session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse("Authentication required", 401)
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse({}, "Password updated successfully")
  } catch (error) {
    return errorResponse("Password reset failed: " + (error as Error).message, 500)
  }
}
