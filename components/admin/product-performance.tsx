"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"

type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  product: {
    id: string
    name: string
    category_id: string
    price: number
    sale_price: number | null
  }
}

type ProductPerformanceProps = {
  orderItems: OrderItem[]
}

export function ProductPerformance({ orderItems }: ProductPerformanceProps) {
  // Process data for top products
  const topProducts = useMemo(() => {
    const productMap = new Map()

    orderItems.forEach((item) => {
      if (!item.product) return

      const productId = item.product.id
      if (!productMap.has(productId)) {
        productMap.set(productId, {
          id: productId,
          name: item.product.name,
          revenue: 0,
          quantity: 0,
          orders: new Set(),
        })
      }

      const productData = productMap.get(productId)
      productData.revenue += item.total_price || 0
      productData.quantity += item.quantity || 0
      productData.orders.add(item.order_id)
    })

    return Array.from(productMap.values())
      .map((product) => ({
        ...product,
        orders: product.orders.size,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [orderItems])

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
  }, [orderItems])

  // Calculate total quantity
  const totalQuantity = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  }, [orderItems])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Product Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From {orderItems.length} order items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}</div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Unit Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalQuantity > 0 ? totalRevenue / totalQuantity : 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per unit sold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Revenue</CardTitle>
          <CardDescription>Best performing products by total sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                quantity: {
                  label: "Quantity",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts.map((p) => ({
                    name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
                    revenue: p.revenue,
                    quantity: p.quantity,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue (₹)" />
                  <Bar dataKey="quantity" fill="var(--color-quantity)" name="Quantity" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Performance Details</CardTitle>
          <CardDescription>Detailed metrics for top performing products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Product</th>
                  <th className="py-3 text-right font-medium">Revenue</th>
                  <th className="py-3 text-right font-medium">Quantity</th>
                  <th className="py-3 text-right font-medium">Orders</th>
                  <th className="py-3 text-right font-medium">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 text-left">{product.name}</td>
                    <td className="py-3 text-right">{formatCurrency(product.revenue)}</td>
                    <td className="py-3 text-right">{product.quantity}</td>
                    <td className="py-3 text-right">{product.orders}</td>
                    <td className="py-3 text-right">
                      {formatCurrency(product.quantity > 0 ? product.revenue / product.quantity : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
