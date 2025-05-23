import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

    if (existingUser) {
      // Add a delay to prevent enumeration attacks
      await new Promise((resolve) => setTimeout(resolve, 500))
      return errorResponse("An account with this email already exists", 400)
    }

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get("origin")}/login?verified=true`,
      },
    })

    if (authError) {
      return errorResponse(authError.message, 400)
    }

    if (authData.user) {
      // Create a profile for the user
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: "customer", // Default role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id)
        return errorResponse(profileError.message, 400)
      }

      // Add default permissions for customer role
      const { error: permissionError } = await supabase.from("user_permissions").insert([
        { user_id: authData.user.id, permission_name: "view_products" },
        { user_id: authData.user.id, permission_name: "place_orders" },
        { user_id: authData.user.id, permission_name: "view_own_orders" },
      ])

      if (permissionError) {
        console.error("Error adding default permissions:", permissionError)
      }
    }

    return successResponse(
      { user: authData.user },
      "Registration successful. Please check your email for verification.",
    )
  } catch (error) {
    console.error("Registration error:", error)
    return errorResponse("Registration failed: " + (error as Error).message, 500)
  }
}
