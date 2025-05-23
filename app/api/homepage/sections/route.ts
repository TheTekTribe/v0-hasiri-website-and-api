import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const includeDisabled = searchParams.get("include_disabled") === "true"

    // Get homepage sections
    let query = supabase.from("homepage_sections").select("*").order("display_order")

    if (!includeDisabled) {
      query = query.eq("is_enabled", true)
    }

    const { data, error } = await query

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Homepage sections retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve homepage sections: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    const { section_type, title, subtitle, content, is_enabled, display_order } = body

    if (!section_type) {
      return errorResponse("Section type is required", 400)
    }

    // Insert the section
    const { data, error } = await supabase
      .from("homepage_sections")
      .insert({
        section_type,
        title,
        subtitle,
        content,
        is_enabled: is_enabled !== undefined ? is_enabled : true,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Homepage section created successfully")
  } catch (error) {
    return errorResponse("Failed to create homepage section: " + (error as Error).message, 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    if (!Array.isArray(body)) {
      return errorResponse("Expected an array of sections with id and display_order", 400)
    }

    // Update the display order of multiple sections
    const updates = body.map(({ id, display_order }) => {
      if (!id || display_order === undefined) {
        throw new Error("Each item must have id and display_order")
      }

      return supabase.from("homepage_sections").update({ display_order }).eq("id", id)
    })

    await Promise.all(updates)

    return successResponse(null, "Homepage sections reordered successfully")
  } catch (error) {
    return errorResponse("Failed to reorder homepage sections: " + (error as Error).message, 500)
  }
}
