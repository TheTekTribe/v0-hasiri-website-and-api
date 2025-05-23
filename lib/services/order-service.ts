import { createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { debugLog, debugError } from "@/lib/debug-utils"

// Create a service client with admin privileges using service role key
const createServiceClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  debugLog("OrderService", `Creating service client with URL: ${supabaseUrl}`)

  if (!supabaseUrl || !supabaseServiceKey) {
    debugError("OrderService", "Missing Supabase service credentials", {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
    })
    throw new Error("Missing Supabase service credentials")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function updateOrderStatus(orderId: string, status: string) {
  debugLog("OrderService", `Updating order ${orderId} to status ${status}`)

  try {
    // Try with service role first (bypasses RLS)
    debugLog("OrderService", "Creating service client")
    const serviceClient = createServiceClient()

    debugLog("OrderService", "Executing update query", { orderId, status })
    const { data, error } = await serviceClient
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()

    if (error) {
      debugError("OrderService", "Error updating with service role", error)

      // Try direct SQL function as fallback
      debugLog("OrderService", "Trying direct SQL function as fallback")
      const { data: rpcData, error: rpcError } = await serviceClient.rpc("admin_update_order_status", {
        p_order_id: orderId,
        p_status: status,
      })

      if (rpcError) {
        debugError("OrderService", "RPC function error", rpcError)
        throw rpcError
      }

      debugLog("OrderService", "Order updated successfully via RPC", rpcData)
      return { success: true, data: rpcData }
    }

    debugLog("OrderService", "Order updated successfully with service role", data)
    return { success: true, data }
  } catch (error) {
    debugError("OrderService", "Failed to update order", error)
    throw error
  }
}

export async function getOrderById(orderId: string) {
  debugLog("OrderService", `Getting order ${orderId}`)

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("orders").select("*, order_items(*)").eq("id", orderId).single()

    if (error) {
      debugError("OrderService", "Error fetching order", error)
      throw error
    }

    debugLog("OrderService", "Order fetched successfully", data)
    return data
  } catch (error) {
    debugError("OrderService", "Failed to get order", error)
    throw error
  }
}

// Direct database query function for debugging
export async function directDatabaseQuery(orderId: string, status: string) {
  debugLog("OrderService", `Executing direct database query for order ${orderId}`)

  try {
    const serviceClient = createServiceClient()

    // Try a direct SQL query using the PostgreSQL syntax
    const { data, error } = await serviceClient.rpc("direct_update_order", { order_id: orderId, new_status: status })

    if (error) {
      debugError("OrderService", "Direct database query error", error)
      throw error
    }

    debugLog("OrderService", "Direct database query successful", data)
    return { success: true, data }
  } catch (error) {
    debugError("OrderService", "Direct database query failed", error)
    throw error
  }
}
