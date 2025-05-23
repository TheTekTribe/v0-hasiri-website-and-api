import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const id = params.id

    const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).single()

    if (error) {
      return errorResponse("Testimonial not found", 404)
    }

    return successResponse(data, "Testimonial retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve testimonial: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id
    const body = await request.json()

    // Update the testimonial
    const { data, error } = await supabase.from("testimonials").update(body).eq("id", id).select().single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Testimonial updated successfully")
  } catch (error) {
    return errorResponse("Failed to update testimonial: " + (error as Error).message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id

    // Delete the testimonial
    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, "Testimonial deleted successfully")
  } catch (error) {
    return errorResponse("Failed to delete testimonial: " + (error as Error).message, 500)
  }
}
