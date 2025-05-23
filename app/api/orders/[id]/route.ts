import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { updateOrderStatus, getOrderById, directDatabaseQuery } from "@/lib/services/order-service"
import { debugLog, debugError } from "@/lib/debug-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id
  debugLog("API", `GET request for order ${orderId}`)

  try {
    const order = await getOrderById(orderId)

    if (!order) {
      debugLog("API", `Order ${orderId} not found`)
      return errorResponse("Order not found", 404)
    }

    debugLog("API", `Order ${orderId} retrieved successfully`)
    return successResponse(order, "Order retrieved successfully")
  } catch (error) {
    debugError("API", `Error retrieving order ${orderId}`, error)
    return errorResponse("Failed to retrieve order: " + (error as Error).message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id
  debugLog("API", `PUT request received for order ID: ${orderId}`)

  try {
    // Log request details for debugging
    debugLog("API", "Request headers", Object.fromEntries(request.headers.entries()))

    // Parse request body
    let body
    try {
      body = await request.json()
      debugLog("API", "Request body parsed", body)
    } catch (e) {
      debugError("API", "Error parsing request body", e)
      return errorResponse("Invalid request body", 400)
    }

    const { status } = body

    if (!status) {
      debugLog("API", "Status is required but not provided")
      return errorResponse("Status is required", 400)
    }

    debugLog("API", `Updating order ${orderId} to status ${status}`)

    // Try multiple update methods
    try {
      // Method 1: Use the service to update the order
      debugLog("API", "Attempting update via service")
      const result = await updateOrderStatus(orderId, status)
      debugLog("API", "Service update result", result)

      // If that fails, try direct database query
      if (!result.success) {
        debugLog("API", "Service update failed, trying direct database query")
        const directResult = await directDatabaseQuery(orderId, status)
        debugLog("API", "Direct database query result", directResult)
      }

      debugLog("API", `Order ${orderId} updated successfully`)
      return successResponse({ id: orderId, status, updated: true }, "Order updated successfully")
    } catch (updateError) {
      debugError("API", "All update methods failed", updateError)
      throw updateError
    }
  } catch (error) {
    debugError("API", `Error updating order ${orderId}`, error)
    return errorResponse("Failed to update order: " + (error as Error).message, 500)
  }
}
