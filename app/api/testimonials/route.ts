import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page") as "login" | "signup" | null
    const includeInactive = searchParams.get("include_inactive") === "true"

    // Get testimonials
    let query = supabase.from("testimonials").select("*").order("display_order")

    if (page) {
      query = query.or(`page.eq.${page},page.eq.both`)
    }

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Testimonials retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve testimonials: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    const { image_url, quote, author, video_id, profile_image, page, display_order, is_active } = body

    if (!quote || !author) {
      return errorResponse("Quote and author are required", 400)
    }

    // Insert the testimonial
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        image_url,
        quote,
        author,
        video_id,
        profile_image,
        page: page || "both",
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Testimonial created successfully")
  } catch (error) {
    return errorResponse("Failed to create testimonial: " + (error as Error).message, 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    if (!Array.isArray(body)) {
      return errorResponse("Expected an array of testimonials with id and display_order", 400)
    }

    // Update the display order of multiple testimonials
    const updates = body.map(({ id, display_order }) => {
      if (!id || display_order === undefined) {
        throw new Error("Each item must have id and display_order")
      }

      return supabase.from("testimonials").update({ display_order }).eq("id", id)
    })

    await Promise.all(updates)

    return successResponse(null, "Testimonials reordered successfully")
  } catch (error) {
    return errorResponse("Failed to reorder testimonials: " + (error as Error).message, 500)
  }
}
