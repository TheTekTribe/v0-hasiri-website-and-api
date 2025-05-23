import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { successResponse, errorResponse } from "@/lib/api-utils"

// Create a service client with admin privileges using service role key
const createServiceClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service credentials")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
  try {
    const serviceClient = createServiceClient()

    // Get all products
    const { data: products, error } = await serviceClient
      .from("products")
      .select("id, name, price, sale_price, stock_quantity")

    if (error) {
      return errorResponse(error.message, 400)
    }

    // Get the search term from query params
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search")

    if (searchTerm) {
      // Filter products by search term
      const filteredProducts = products.filter(
        (product) => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      return successResponse({
        search: searchTerm,
        matches: filteredProducts,
        allProducts: products,
      })
    }

    return successResponse({
      products,
      count: products.length,
    })
  } catch (error) {
    return errorResponse("Failed to fetch products: " + (error as Error).message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName } = body

    if (!productName) {
      return errorResponse("Product name is required", 400)
    }

    const serviceClient = createServiceClient()

    // Get all products
    const { data: products, error } = await serviceClient
      .from("products")
      .select("id, name, price, sale_price, stock_quantity")

    if (error) {
      return errorResponse(error.message, 400)
    }

    // Try different matching strategies
    const normalizedName = productName.trim().toLowerCase()

    // Exact match
    const exactMatch = products.find((p) => p.name && p.name.trim().toLowerCase() === normalizedName)

    // Contains match
    const containsMatch = products.find((p) => p.name && p.name.trim().toLowerCase().includes(normalizedName))

    // Reverse contains match
    const reverseContainsMatch = products.find((p) => p.name && normalizedName.includes(p.name.trim().toLowerCase()))

    // Word match
    const words = normalizedName.split(/\s+/)
    const wordMatches = products.filter((p) => {
      if (!p.name) return false
      const productNameLower = p.name.trim().toLowerCase()
      return words.some((word) => productNameLower.includes(word))
    })

    return successResponse({
      productName,
      normalizedName,
      exactMatch,
      containsMatch,
      reverseContainsMatch,
      wordMatches,
      allProducts: products,
    })
  } catch (error) {
    return errorResponse("Failed to match product: " + (error as Error).message, 500)
  }
}
