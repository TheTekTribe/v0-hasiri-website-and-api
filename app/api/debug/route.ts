import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { successResponse, errorResponse } from "@/lib/api-utils"

// This endpoint will directly query the database and return detailed information
export async function GET(request: NextRequest) {
  console.log("[DEBUG] Debug endpoint called")

  try {
    // Create a direct client with service role
    const supabaseUrl = process.env.SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[DEBUG] Missing Supabase credentials")
      return errorResponse("Server configuration error", 500)
    }

    console.log("[DEBUG] Creating Supabase client with service role")
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get database info
    console.log("[DEBUG] Checking database connection")

    // Check if orders table exists and get its structure
    console.log("[DEBUG] Checking orders table")
    const { data: tableInfo, error: tableError } = await supabase.from("orders").select("*").limit(1)

    if (tableError) {
      console.error("[DEBUG] Error accessing orders table:", tableError)
      return errorResponse(`Table error: ${tableError.message}`, 500)
    }

    // Count orders
    console.log("[DEBUG] Counting orders")
    const { count: orderCount, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("[DEBUG] Error counting orders:", countError)
      return errorResponse(`Count error: ${countError.message}`, 500)
    }

    // Get RLS policies
    console.log("[DEBUG] Getting RLS policies")
    const { data: rlsData, error: rlsError } = await supabase.rpc("get_rls_policies")

    // Get all orders with full details for debugging
    console.log("[DEBUG] Getting all orders")
    const { data: orders, error: ordersError } = await supabase.from("orders").select("*, order_items(*)").limit(10)

    if (ordersError) {
      console.error("[DEBUG] Error fetching orders:", ordersError)
      return errorResponse(`Orders error: ${ordersError.message}`, 500)
    }

    // Return all debug information
    return successResponse(
      {
        environment: {
          supabaseUrl: supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
        },
        database: {
          orderCount,
          tableInfo: tableInfo ? "Orders table accessible" : "No orders found",
          rlsPolicies: rlsData || "Could not fetch RLS policies",
          rlsError: rlsError ? rlsError.message : null,
        },
        orders: orders || [],
        ordersCount: orders?.length || 0,
      },
      "Debug information retrieved",
    )
  } catch (error) {
    console.error("[DEBUG] Error:", error)
    return errorResponse(`Server error: ${(error as Error).message}`, 500)
  }
}
