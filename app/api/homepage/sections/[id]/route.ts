import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const id = params.id

    const { data, error } = await supabase.from("homepage_sections").select("*").eq("id", id).single()

    if (error) {
      return errorResponse("Section not found", 404)
    }

    return successResponse(data, "Homepage section retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve homepage section: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id
    const body = await request.json()

    // Update the section
    const { data, error } = await supabase.from("homepage_sections").update(body).eq("id", id).select().single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Homepage section updated successfully")
  } catch (error) {
    return errorResponse("Failed to update homepage section: " + (error as Error).message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id

    // Delete the section
    const { error } = await supabase.from("homepage_sections").delete().eq("id", id)

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, "Homepage section deleted successfully")
  } catch (error) {
    return errorResponse("Failed to delete homepage section: " + (error as Error).message, 500)
  }
}
