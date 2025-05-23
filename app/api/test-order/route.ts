import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { debugLog, debugError } from "@/lib/debug-utils"

export async function GET(request: NextRequest) {
  debugLog("TestOrderAPI", "Test order creation initiated")

  try {
    // Create a service client with admin privileges
    const supabaseUrl = process.env.SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      debugError("TestOrderAPI", "Missing Supabase credentials")
      return new Response(JSON.stringify({ error: "Missing Supabase credentials" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create a test user if needed
    let userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      debugLog("TestOrderAPI", "No user ID provided, creating test user")

      // Create a test user in auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        email_confirm: true,
      })

      if (userError) {
        debugError("TestOrderAPI", "Error creating test user", userError)
        return new Response(JSON.stringify({ error: "Failed to create test user", details: userError }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }

      userId = userData.user.id

      // Create profile for the user
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        name: "Test User",
        email: userData.user.email,
        role: "customer",
      })

      if (profileError) {
        debugError("TestOrderAPI", "Error creating user profile", profileError)
        // Continue anyway
      }

      debugLog("TestOrderAPI", `Created test user with ID: ${userId}`)
    }

    // Get a product for the test order
    const { data: products, error: productError } = await supabase.from("products").select("id, price").limit(1)

    if (productError || !products || products.length === 0) {
      debugError("TestOrderAPI", "Error fetching product", productError)
      return new Response(JSON.stringify({ error: "Failed to fetch product", details: productError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const productId = products[0].id
    const productPrice = products[0].price

    debugLog("TestOrderAPI", `Using product: ${productId} with price: ${productPrice}`)

    // Create test order
    const orderData = {
      user_id: userId,
      shipping_address: { address: "123 Test St", city: "Test City", pincode: "123456" },
      billing_address: { address: "123 Test St", city: "Test City", pincode: "123456" },
      payment_method: "card",
      shipping_method: "standard",
      subtotal: productPrice,
      shipping_cost: 100,
      tax: productPrice * 0.05,
      total: productPrice + 100 + productPrice * 0.05,
      status: "pending",
    }

    debugLog("TestOrderAPI", "Creating test order", orderData)

    const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

    if (orderError) {
      debugError("TestOrderAPI", "Error creating order", orderError)
      return new Response(JSON.stringify({ error: "Failed to create order", details: orderError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const orderId = order.id
    debugLog("TestOrderAPI", `Created order with ID: ${orderId}`)

    // Create order item
    const orderItemData = {
      order_id: orderId,
      product_id: productId,
      quantity: 1,
      unit_price: productPrice,
      total_price: productPrice,
    }

    debugLog("TestOrderAPI", "Creating order item", orderItemData)

    const { data: orderItem, error: orderItemError } = await supabase.from("order_items").insert(orderItemData).select()

    if (orderItemError) {
      debugError("TestOrderAPI", "Error creating order item", orderItemError)
      return new Response(JSON.stringify({ error: "Failed to create order item", details: orderItemError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Return success with order details
    const result = {
      success: true,
      message: "Test order created successfully",
      order: {
        ...order,
        items: orderItem,
      },
      userId,
    }

    debugLog("TestOrderAPI", "Test order creation successful", result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    debugError("TestOrderAPI", "Test order creation failed", error)
    return new Response(JSON.stringify({ error: "Test order creation failed", details: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
