import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    const slug = params.slug

    const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

    if (error) {
      return errorResponse("Product not found", 404)
    }

    return successResponse(data, "Product retrieved successfully")
  } catch (error) {
    return errorResponse("Failed to retrieve product: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const slug = params.slug
    const body = await request.json()

    // Check if product exists
    const { data: existingProduct, error: findError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single()

    if (findError || !existingProduct) {
      return errorResponse("Product not found", 404)
    }

    // Update the product
    const { data, error } = await supabase.from("products").update(body).eq("id", existingProduct.id).select().single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Product updated successfully")
  } catch (error) {
    return errorResponse("Failed to update product: " + (error as Error).message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const slug = params.slug

    // Check if product exists
    const { data: existingProduct, error: findError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single()

    if (findError || !existingProduct) {
      return errorResponse("Product not found", 404)
    }

    // Delete the product
    const { error } = await supabase.from("products").delete().eq("id", existingProduct.id)

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(null, "Product deleted successfully")
  } catch (error) {
    return errorResponse("Failed to delete product: " + (error as Error).message, 500)
  }
}
