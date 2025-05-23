import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse, getPaginationParams } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    const slug = params.slug
    const searchParams = request.nextUrl.searchParams
    const includeProducts = searchParams.get("include_products") === "true"

    // Get the category
    const { data: category, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      return errorResponse("Category not found", 404)
    }

    // If products are requested, get them
    if (includeProducts) {
      const { page, limit, from, to } = getPaginationParams(searchParams)

      const {
        data: products,
        error: productsError,
        count,
      } = await supabase.from("products").select("*", { count: "exact" }).eq("category_id", category.id).range(from, to)

      if (productsError) {
        return errorResponse(productsError.message, 400)
      }

      return successResponse(
        {
          ...category,
          products,
        },
        "Category retrieved successfully",
        {
          page,
          limit,
          total: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      )
    }

    return successResponse(category, "Category retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve category: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const slug = params.slug
    const body = await request.json()

    // Check if category exists
    const { data: existingCategory, error: findError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()

    if (findError || !existingCategory) {
      return errorResponse("Category not found", 404)
    }

    // Update the category
    const { data, error } = await supabase
      .from("categories")
      .update(body)
      .eq("id", existingCategory.id)
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Category updated successfully")
  } catch (error) {
    return errorResponse("Failed to update category: " + (error as Error).message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const slug = params.slug

    // Check if category exists
    const { data: existingCategory, error: findError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()

    if (findError || !existingCategory) {
      return errorResponse("Category not found", 404)
    }

    // Check if category has products
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact" })
      .eq("category_id", existingCategory.id)

    if (countError) {
      return errorResponse(countError.message, 400)
    }

    if (count && count > 0) {
      return errorResponse("Cannot delete category with associated products", 400)
    }

    // Delete the category
    const { error } = await supabase.from("categories").delete().eq("id", existingCategory.id)

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, "Category deleted successfully")
  } catch (error) {
    return errorResponse("Failed to delete category: " + (error as Error).message, 500)
  }
}
