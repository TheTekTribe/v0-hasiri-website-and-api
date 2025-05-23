import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const includeDisabled = searchParams.get("include_disabled") === "true"

    // Get carousel images
    let query = supabase.from("carousel_images").select("*").order("display_order")

    if (!includeDisabled) {
      query = query.eq("is_enabled", true)
    }

    const { data, error } = await query

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Carousel images retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve carousel images: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    const { image_url, title, subtitle, cta_text, cta_link, display_order, is_enabled } = body

    if (!image_url) {
      return errorResponse("Image URL is required", 400)
    }

    // Insert the carousel image
    const { data, error } = await supabase
      .from("carousel_images")
      .insert({
        image_url,
        title,
        subtitle,
        cta_text,
        cta_link,
        display_order: display_order || 0,
        is_enabled: is_enabled !== undefined ? is_enabled : true,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Carousel image created successfully")
  } catch (error) {
    return errorResponse("Failed to create carousel image: " + (error as Error).message, 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    if (!Array.isArray(body)) {
      return errorResponse("Expected an array of images with id and display_order", 400)
    }

    // Update the display order of multiple images
    const updates = body.map(({ id, display_order }) => {
      if (!id || display_order === undefined) {
        throw new Error("Each item must have id and display_order")
      }

      return supabase.from("carousel_images").update({ display_order }).eq("id", id)
    })

    await Promise.all(updates)

    return successResponse(null, "Carousel images reordered successfully")
  } catch (error) {
    return errorResponse("Failed to reorder carousel images: " + (error as Error).message, 500)
  }
}
