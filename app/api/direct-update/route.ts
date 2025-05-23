import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  console.log("[DirectUpdate] Request received")

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const orderId = searchParams.get("orderId")
  const status = searchParams.get("status")

  console.log(`[DirectUpdate] Parameters: orderId=${orderId}, status=${status}`)

  if (!orderId || !status) {
    return errorResponse("Missing required parameters: orderId and status", 400)
  }

  try {
    // Create a direct client with service role
    const supabaseUrl = process.env.SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[DirectUpdate] Missing Supabase credentials")
      return errorResponse("Server configuration error", 500)
    }

    console.log("[DirectUpdate] Creating Supabase client")
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try direct update
    console.log(`[DirectUpdate] Updating order ${orderId} to status ${status}`)
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()

    if (error) {
      console.error("[DirectUpdate] Database error:", error)
      return errorResponse(`Database error: ${error.message}`, 500)
    }

    console.log("[DirectUpdate] Update successful:", data)
    return successResponse(data, "Order updated successfully via direct update")
  } catch (error) {
    console.error("[DirectUpdate] Error:", error)
    return errorResponse(`Server error: ${(error as Error).message}`, 500)
  }
}
