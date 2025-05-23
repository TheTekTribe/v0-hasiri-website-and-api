import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse, getPaginationParams } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const { page, limit, from, to } = getPaginationParams(searchParams)

    // Get filters from query params
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "desc"

    // Build the query
    let query = supabase
      .from("products")
      .select("*, categories(*)", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to)

    // Apply filters
    if (category) {
      query = query.eq("category_id", category)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Execute the query
    const { data, error, count } = await query

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Products retrieved successfully", {
      page,
      limit,
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    })
  } catch (error) {
    return errorResponse("Failed to retrieve products: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint requires admin privileges (handled by middleware)
    const supabase = createServerClient()
    const body = await request.json()

    const { name, slug, description, price, sale_price, stock_quantity, category_id, image_url, featured, is_active } =
      body

    if (!name || !slug || !price) {
      return errorResponse("Name, slug, and price are required", 400)
    }

    // Check if slug is unique
    const { data: existingProduct } = await supabase.from("products").select("id").eq("slug", slug).single()

    if (existingProduct) {
      return errorResponse("A product with this slug already exists", 400)
    }

    // Insert the product
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        sale_price,
        stock_quantity: stock_quantity || 0,
        category_id,
        image_url,
        featured: featured || false,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message, 400)
    }

    return successResponse(data, "Product created successfully")
  } catch (error) {
    return errorResponse("Failed to create product: " + (error as Error).message, 500)
  }
}
