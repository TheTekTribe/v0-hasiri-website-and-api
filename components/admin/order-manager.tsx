"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatDistanceToNow } from "date-fns"
import { Switch } from "@/components/ui/switch"

// Debug mode
const DEBUG_MODE = true

function debugLog(area: string, message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`[${area}] ${message}`)
    if (data !== undefined) {
      console.log(`[${area}] Data:`, data)
    }
  }
}

// Define types
interface Order {
  id: string
  user_id: string
  status: string
  payment_method: string
  shipping_method: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  created_at: string
  updated_at: string
  shipping_address: any
  billing_address: any
  order_items: OrderItem[]
  user_email?: string
  user_name?: string
  user_phone?: string
}

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  product?: {
    name: string
    slug: string
    image_url: string
  }
}

export function OrderManager() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [debugMode, setDebugMode] = useState(true)
  const ordersPerPage = 10

  // Status options with colors
  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  ]

  // Payment method options
  const paymentMethods = {
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    upi: "UPI",
    cod: "Cash on Delivery",
    net_banking: "Net Banking",
  }

  // Shipping method options
  const shippingMethods = {
    standard: "Standard Shipping",
    express: "Express Shipping",
    same_day: "Same Day Delivery",
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return `${date.toLocaleDateString()} (${formatDistanceToNow(date, { addSuffix: true })})`
    } catch (e) {
      return dateString
    }
  }

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    debugLog("OrderManager", "Fetching orders")
    setLoading(true)
    try {
      // Count total orders first
      const { count, error: countError } = await supabase.from("orders").select("*", { count: "exact", head: true })

      if (countError) {
        debugLog("OrderManager", "Error counting orders", countError)
        throw countError
      }

      debugLog("OrderManager", `Found ${count} total orders`)
      setTotalOrders(count || 0)

      // First, fetch orders with order items and products
      debugLog("OrderManager", "Fetching orders with items and products")
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            *,
            product:products(name, slug, image_url)
          )
        `)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage - 1)

      if (orderError) {
        debugLog("OrderManager", "Error fetching orders", orderError)
        throw orderError
      }

      debugLog("OrderManager", `Fetched ${orderData?.length || 0} orders`)

      // Then, for each order, fetch the user profile separately
      debugLog("OrderManager", "Fetching user profiles for orders")
      const ordersWithUserInfo = await Promise.all(
        (orderData || []).map(async (order) => {
          // Fetch user profile
          debugLog("OrderManager", `Fetching profile for user ${order.user_id}`)
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("first_name, last_name, email, phone")
            .eq("id", order.user_id)
            .single()

          if (profileError) {
            debugLog("OrderManager", `Could not fetch profile for user ${order.user_id}`, profileError)
            return {
              ...order,
              user_name: "Unknown",
              user_email: "Unknown",
              user_phone: "Unknown",
            }
          }

          debugLog("OrderManager", `Profile fetched for user ${order.user_id}`, profileData)
          return {
            ...order,
            user_name: profileData
              ? `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || "Unknown"
              : "Unknown",
            user_email: profileData?.email || "Unknown",
            user_phone: profileData?.phone || "Unknown",
          }
        }),
      )

      debugLog("OrderManager", "All orders processed with user info", ordersWithUserInfo?.length)
      setOrders(ordersWithUserInfo || [])
      setFilteredOrders(ordersWithUserInfo || [])
    } catch (error) {
      debugLog("OrderManager", "Error fetching orders", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, currentPage])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter orders when search term or status filter changes
  useEffect(() => {
    let result = orders

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          (order.user_name && order.user_name.toLowerCase().includes(term)) ||
          (order.user_email && order.user_email.toLowerCase().includes(term)) ||
          (order.shipping_address?.pincode && order.shipping_address.pincode.includes(term)),
      )
    }

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter])

  // View order details
  const viewOrderDetails = (order: Order) => {
    debugLog("OrderManager", "Viewing order details", order.id)
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  // Direct database update for debugging
  const directDatabaseUpdate = async (orderId: string, newStatus: string) => {
    debugLog("OrderManager", `Direct database update for order ${orderId} to status ${newStatus}`)

    try {
      const response = await fetch(`/api/direct-update?orderId=${orderId}&status=${newStatus}`, {
        method: "GET",
      })

      const result = await response.json()
      debugLog("OrderManager", "Direct update response", result)

      if (!response.ok) {
        throw new Error(result.message || "Direct update failed")
      }

      toast({
        title: "Direct Update",
        description: `Order directly updated to ${newStatus}.`,
      })

      // Refresh orders
      fetchOrders()
    } catch (error) {
      debugLog("OrderManager", "Direct update error", error)
      toast({
        title: "Error",
        description: `Direct update failed: ${(error as Error).message}`,
        variant: "destructive",
      })
    }
  }

  // Update order status - completely rewritten with detailed logging
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    debugLog("OrderManager", `Updating order ${orderId} to status ${newStatus}`)
    setUpdatingStatus(true)

    try {
      // Make API request with credentials
      debugLog("OrderManager", "Preparing fetch request")

      const requestBody = JSON.stringify({ status: newStatus })
      debugLog("OrderManager", "Request body", requestBody)

      debugLog("OrderManager", `Sending PUT request to /api/orders/${orderId}`)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        credentials: "include", // Include cookies for authentication
      })

      // Log the raw response for debugging
      debugLog("OrderManager", `Response status: ${response.status}`)

      // Try to get response text first for debugging
      const responseText = await response.text()
      debugLog("OrderManager", "Raw response text", responseText)

      // Parse the response as JSON
      let result
      try {
        result = JSON.parse(responseText)
        debugLog("OrderManager", "Parsed response data", result)
      } catch (parseError) {
        debugLog("OrderManager", "Failed to parse response as JSON", parseError)
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(result.message || `Failed to update order: ${response.status}`)
      }

      // Update local state
      debugLog("OrderManager", "Updating local state")
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order,
        ),
      )

      // Update selected order if it's the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        debugLog("OrderManager", "Updating selected order")
        setSelectedOrder({ ...selectedOrder, status: newStatus, updated_at: new Date().toISOString() })
      }

      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`,
      })

      // Force refresh data
      debugLog("OrderManager", "Refreshing data")
      fetchOrders()
    } catch (error) {
      debugLog("OrderManager", "Error updating order status", error)
      toast({
        title: "Error",
        description: `Failed to update order status: ${(error as Error).message}`,
        variant: "destructive",
      })

      // Try direct database update as fallback
      if (debugMode) {
        debugLog("OrderManager", "Attempting direct database update as fallback")
        try {
          await directDatabaseUpdate(orderId, newStatus)
        } catch (directError) {
          debugLog("OrderManager", "Direct database update failed", directError)
        }
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>{statusOption?.label || status}</Badge>
  }

  // Handle pagination
  const totalPages = Math.ceil(totalOrders / ordersPerPage)

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {/* Debug mode toggle */}
      <div className="flex items-center space-x-2">
        <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
        <Label htmlFor="debug-mode">Debug Mode {debugMode ? "(On)" : "(Off)"}</Label>
        {debugMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.clear()
              debugLog("OrderManager", "Console cleared")
            }}
          >
            Clear Console
          </Button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-[250px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[300px]">
            <Input
              placeholder="Search by order ID, customer, or pincode"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            Refresh
          </Button>
          <span className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {totalOrders} orders
          </span>
        </div>
      </div>

      {/* Orders table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.user_name || "Unknown"}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Order details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Order #{selectedOrder.id.substring(0, 8)}...</span>
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>Placed on {formatDate(selectedOrder.created_at)}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer Info</TabsTrigger>
                  <TabsTrigger value="status">Update Status</TabsTrigger>
                </TabsList>

                {/* Order Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.order_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {item.product?.image_url ? (
                                    <img
                                      src={item.product.image_url || "/placeholder.svg"}
                                      alt={item.product?.name || "Product"}
                                      className="w-10 h-10 object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                      No img
                                    </div>
                                  )}
                                  <span>{item.product?.name || "Unknown Product"}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex flex-col items-end gap-2">
                      <div className="flex justify-between w-full max-w-[300px]">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between w-full max-w-[300px]">
                        <span>Shipping:</span>
                        <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between w-full max-w-[300px]">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between w-full max-w-[300px] font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </CardFooter>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Method: </span>
                            <span>
                              {paymentMethods[selectedOrder.payment_method as keyof typeof paymentMethods] ||
                                selectedOrder.payment_method}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Method: </span>
                            <span>
                              {shippingMethods[selectedOrder.shipping_method as keyof typeof shippingMethods] ||
                                selectedOrder.shipping_method}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Customer Info Tab */}
                <TabsContent value="customer" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Name: </span>
                            <span>{selectedOrder.user_name || "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Email: </span>
                            <span>{selectedOrder.user_email || "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Phone: </span>
                            <span>{selectedOrder.user_phone || "N/A"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedOrder.shipping_address ? (
                          <div className="space-y-1">
                            <p>{selectedOrder.shipping_address.street}</p>
                            <p>
                              {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}
                            </p>
                            <p>
                              {selectedOrder.shipping_address.country} - {selectedOrder.shipping_address.pincode}
                            </p>
                          </div>
                        ) : (
                          <p>No shipping address provided</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Update Status Tab */}
                <TabsContent value="status" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Order Status</CardTitle>
                      <CardDescription>Change the status of this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Current Status</Label>
                          <div>{getStatusBadge(selectedOrder.status)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-status">New Status</Label>
                          <div className="space-y-2">
                            {statusOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant={selectedOrder.status === option.value ? "default" : "outline"}
                                className="mr-2 mb-2"
                                disabled={updatingStatus || selectedOrder.status === option.value}
                                onClick={() => updateOrderStatus(selectedOrder.id, option.value)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {debugMode && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Debug Actions</h4>
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground mb-2">
                                These actions bypass normal API routes and directly update the database
                              </div>
                              {statusOptions.map((option) => (
                                <Button
                                  key={`debug-${option.value}`}
                                  variant="outline"
                                  size="sm"
                                  className="mr-2 mb-2 border-dashed"
                                  disabled={updatingStatus || selectedOrder.status === option.value}
                                  onClick={() => directDatabaseUpdate(selectedOrder.id, option.value)}
                                >
                                  Direct: {option.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">Status changes are logged and cannot be undone.</p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
