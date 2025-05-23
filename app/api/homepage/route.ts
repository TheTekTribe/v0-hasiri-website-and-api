import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const includeDisabled = searchParams.get("include_disabled") === "true"

    // Get homepage sections
    let sectionsQuery = supabase.from("homepage_sections").select("*").order("display_order")

    if (!includeDisabled) {
      sectionsQuery = sectionsQuery.eq("is_enabled", true)
    }

    const { data: sections, error: sectionsError } = await sectionsQuery

    if (sectionsError) {
      return errorResponse(sectionsError.message, 400)
    }

    // Get carousel images
    let carouselQuery = supabase.from("carousel_images").select("*").order("display_order")

    if (!includeDisabled) {
      carouselQuery = carouselQuery.eq("is_enabled", true)
    }

    const { data: carousel, error: carouselError } = await carouselQuery

    if (carouselError) {
      return errorResponse(carouselError.message, 400)
    }

    // Get featured products
    const { data: featuredProducts, error: productsError } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("featured", true)
      .eq("is_active", true)
      .limit(8)

    if (productsError) {
      return errorResponse(productsError.message, 400)
    }

    return successResponse(
      {
        sections,
        carousel,
        featuredProducts,
      },
      "Homepage content retrieved successfully",
    )
  } catch (error) {
    return errorResponse("Failed to retrieve homepage content: " + (error as Error).message, 500)
  }
}
