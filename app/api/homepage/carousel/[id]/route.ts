import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const id = params.id

    const { data, error } = await supabase.from("carousel_images").select("*").eq("id", id).single()

    if (error) {
      return errorResponse("Carousel image not found", 404)
    }

    return successResponse(data, "Carousel image retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve carousel image: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id
    const body = await request.json()

    // Update the carousel image
    const { data, error } = await supabase.from("carousel_images").update(body).eq("id", id).select().single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Carousel image updated successfully")
  } catch (error) {
    return errorResponse("Failed to update carousel image: " + (error as Error).message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const id = params.id

    // Delete the carousel image
    const { error } = await supabase.from("carousel_images").delete().eq("id", id)

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, "Carousel image deleted successfully")
  } catch (error) {
    return errorResponse("Failed to delete carousel image: " + (error as Error).message, 500)
  }
}
