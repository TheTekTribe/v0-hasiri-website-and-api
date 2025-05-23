import { createServerClient } from "@/lib/supabase/server"
import { apiResponse } from "@/lib/api-utils"

// GET /api/roles - Get all roles
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()

    // Check if user is admin
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return apiResponse(401, { error: "Unauthorized" })
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (userError || userData?.role !== "admin") {
      return apiResponse(403, { error: "Admin access required" })
    }

    // Get all roles
    const { data, error } = await supabase.from("roles").select("*").order("name")

    if (error) {
      throw error
    }

    return apiResponse(200, { roles: data })
  } catch (error) {
    console.error("Error fetching roles:", error)
    return apiResponse(500, { error: "Failed to fetch roles" })
  }
}

// POST /api/roles - Create a new role
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check if user is admin
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return apiResponse(401, { error: "Unauthorized" })
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (userError || userData?.role !== "admin") {
      return apiResponse(403, { error: "Admin access required" })
    }

    // Get role data from request
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return apiResponse(400, { error: "Role name is required" })
    }

    // Create new role
    const { data, error } = await supabase.from("roles").insert({ name, description }).select()

    if (error) {
      throw error
    }

    return apiResponse(201, { role: data[0] })
  } catch (error) {
    console.error("Error creating role:", error)
    return apiResponse(500, { error: "Failed to create role" })
  }
}
