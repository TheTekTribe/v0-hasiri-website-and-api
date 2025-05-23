import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Categories retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve categories: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    const { name, slug, description, image_url } = body

    if (!name || !slug) {
      return errorResponse("Name and slug are required", 400)
    }

    // Check if slug is unique
    const { data: existingCategory } = await supabase.from("categories").select("id").eq("slug", slug).single()

    if (existingCategory) {
      return errorResponse("A category with this slug already exists", 400)
    }

    // Insert the category
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description,
        image_url,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Category created successfully")
  } catch (error) {
    return errorResponse("Failed to create category: " + (error as Error).message, 500)
  }
}
