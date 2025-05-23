import { createServerClient } from "@/lib/supabase/server"
import { apiResponse } from "@/lib/api-utils"

// GET /api/roles/[id] - Get a specific role
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Get role by ID
    const { data, error } = await supabase.from("roles").select("*").eq("id", params.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return apiResponse(404, { error: "Role not found" })
      }
      throw error
    }

    return apiResponse(200, { role: data })
  } catch (error) {
    console.error("Error fetching role:", error)
    return apiResponse(500, { error: "Failed to fetch role" })
  }
}

// PUT /api/roles/[id] - Update a role
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Update role
    const { data, error } = await supabase.from("roles").update({ name, description }).eq("id", params.id).select()

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return apiResponse(404, { error: "Role not found" })
    }

    return apiResponse(200, { role: data[0] })
  } catch (error) {
    console.error("Error updating role:", error)
    return apiResponse(500, { error: "Failed to update role" })
  }
}

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Delete role permissions first (due to foreign key constraints)
    const { error: permError } = await supabase.from("role_permissions").delete().eq("role_id", params.id)

    if (permError) {
      throw permError
    }

    // Delete user roles
    const { error: userRoleError } = await supabase.from("user_roles").delete().eq("role_id", params.id)

    if (userRoleError) {
      throw userRoleError
    }

    // Delete the role
    const { error } = await supabase.from("roles").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return apiResponse(200, { message: "Role deleted successfully" })
  } catch (error) {
    console.error("Error deleting role:", error)
    return apiResponse(500, { error: "Failed to delete role" })
  }
}
