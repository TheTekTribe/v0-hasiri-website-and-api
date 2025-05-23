import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return errorResponse("User ID not found in request", 401)
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "User profile retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve user profile: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return errorResponse("User ID not found in request", 401)
    }

    const body = await request.json()
    const { name, phone, address } = body

    // Update the user profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        phone,
        address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "User profile updated successfully")
  } catch (error) {
    return errorResponse("Failed to update user profile: " + (error as Error).message, 500)
  }
}
