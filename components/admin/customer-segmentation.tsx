"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

// Define types for our props and data
type Customer = {
  id: string
  name: string
  email: string
  address: any
  created_at: string
}

type Order = {
  id: string
  user_id: string
  total: number
  created_at: string
  status: string
}

type CustomerSegmentationProps = {
  customers: Customer[]
  orders: Order[]
}

type CustomerWithMetrics = {
  id: string
  name: string
  email: string
  location: string
  totalSpent: number
  orderCount: number
  averageOrderValue: number
  daysSinceLastPurchase: number
  segment: string
}

export function CustomerSegmentation({ customers, orders }: CustomerSegmentationProps) {
  const [segmentationType, setSegmentationType] = useState("value")

  // Process customer data with order metrics
  const customersWithMetrics = useMemo(() => {
    return customers.map((customer) => {
      // Get all orders for this customer
      const customerOrders = orders.filter((order) => order.user_id === customer.id)

      // Calculate metrics
      const totalSpent = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      const orderCount = customerOrders.length
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0

      // Calculate days since last purchase
      let daysSinceLastPurchase = 365 // Default to a year if no orders
      if (customerOrders.length > 0) {
        const lastOrderDate = new Date(Math.max(...customerOrders.map((o) => new Date(o.created_at).getTime())))
        const diffTime = Math.abs(new Date().getTime() - lastOrderDate.getTime())
        daysSinceLastPurchase = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      // Determine location from address
      let location = "Unknown"
      try {
        if (customer.address && typeof customer.address === "object") {
          location = customer.address.state || customer.address.city || "Unknown"
        }
      } catch (e) {
        console.error("Error parsing customer address:", e)
      }

      // Determine customer segment based on RFM (Recency, Frequency, Monetary)
      let segment = "New"

      if (orderCount === 0) {
        segment = "Inactive"
      } else if (totalSpent > 10000 && orderCount > 5 && daysSinceLastPurchase < 30) {
        segment = "VIP"
      } else if (totalSpent > 5000 && orderCount > 3 && daysSinceLastPurchase < 60) {
        segment = "Loyal"
      } else if (daysSinceLastPurchase < 30) {
        segment = "Recent"
      } else if (daysSinceLastPurchase > 180) {
        segment = "At Risk"
      } else {
        segment = "Regular"
      }

      return {
        id: customer.id,
        name: customer.name || "Unknown",
        email: customer.email,
        location,
        totalSpent,
        orderCount,
        averageOrderValue,
        daysSinceLastPurchase,
        segment,
      }
    })
  }, [customers, orders])

  // Prepare data for charts based on segmentation type
  const segmentationData = useMemo(() => {
    if (segmentationType === "value") {
      // Group by customer segment and sum total spent
      const segmentGroups = customersWithMetrics.reduce(
        (acc, customer) => {
          if (!acc[customer.segment]) {
            acc[customer.segment] = {
              name: customer.segment,
              value: 0,
              count: 0,
            }
          }
          acc[customer.segment].value += customer.totalSpent
          acc[customer.segment].count += 1
          return acc
        },
        {} as Record<string, { name: string; value: number; count: number }>,
      )

      return Object.values(segmentGroups)
    } else if (segmentationType === "location") {
      // Group by location
      const locationGroups = customersWithMetrics.reduce(
        (acc, customer) => {
          if (!acc[customer.location]) {
            acc[customer.location] = {
              name: customer.location,
              value: 0,
              count: 0,
            }
          }
          acc[customer.location].value += customer.totalSpent
          acc[customer.location].count += 1
          return acc
        },
        {} as Record<string, { name: string; value: number; count: number }>,
      )

      // Sort by value and take top 10
      return Object.values(locationGroups)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    } else {
      // Group by order frequency
      const frequencyGroups = {
        "No Orders": { name: "No Orders", value: 0, count: 0 },
        "1 Order": { name: "1 Order", value: 0, count: 0 },
        "2-3 Orders": { name: "2-3 Orders", value: 0, count: 0 },
        "4-6 Orders": { name: "4-6 Orders", value: 0, count: 0 },
        "7+ Orders": { name: "7+ Orders", value: 0, count: 0 },
      }

      customersWithMetrics.forEach((customer) => {
        let group
        if (customer.orderCount === 0) group = "No Orders"
        else if (customer.orderCount === 1) group = "1 Order"
        else if (customer.orderCount <= 3) group = "2-3 Orders"
        else if (customer.orderCount <= 6) group = "4-6 Orders"
        else group = "7+ Orders"

        frequencyGroups[group].value += customer.totalSpent
        frequencyGroups[group].count += 1
      })

      return Object.values(frequencyGroups)
    }
  }, [customersWithMetrics, segmentationType])

  // Calculate customer lifetime value
  const averageCLV = useMemo(() => {
    const totalCustomers = customersWithMetrics.length
    const totalRevenue = customersWithMetrics.reduce((sum, c) => sum + c.totalSpent, 0)
    return totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  }, [customersWithMetrics])

  // Calculate average order value
  const averageOrderValue = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    return totalOrders > 0 ? totalRevenue / totalOrders : 0
  }, [orders])

  // Prepare RFM distribution data
  const rfmDistribution = useMemo(() => {
    const segments = ["VIP", "Loyal", "Regular", "Recent", "At Risk", "Inactive", "New"]
    return segments.map((segment) => ({
      name: segment,
      customers: customersWithMetrics.filter((c) => c.segment === segment).length,
      revenue: customersWithMetrics.filter((c) => c.segment === segment).reduce((sum, c) => sum + c.totalSpent, 0),
    }))
  }, [customersWithMetrics])

  // Colors for the pie chart
  const COLORS = ["#2E7D32", "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#F44336"]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">{orders.length} total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageCLV)}</div>
            <p className="text-xs text-muted-foreground">Customer Lifetime Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersWithMetrics.filter((c) => c.segment === "VIP").length}</div>
            <p className="text-xs text-muted-foreground">
              {((customersWithMetrics.filter((c) => c.segment === "VIP").length / customers.length) * 100).toFixed(1)}%
              of customer base
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Breakdown of customers by segment</CardDescription>
              </div>
              <Select value={segmentationType} onValueChange={setSegmentationType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Segmentation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">By Customer Value</SelectItem>
                  <SelectItem value="frequency">By Purchase Frequency</SelectItem>
                  <SelectItem value="location">By Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  segment: {
                    label: "Segment",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {segmentationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 space-y-1">
              {segmentationData.map((segment, index) => (
                <div key={segment.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{segment.name}</span>
                  </div>
                  <div className="font-medium">
                    {segment.count} customers ({formatCurrency(segment.value)})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFM Analysis</CardTitle>
            <CardDescription>Recency, Frequency, Monetary Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  customers: {
                    label: "Customers",
                    color: "hsl(var(--chart-1))",
                  },
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rfmDistribution}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--color-customers)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-revenue)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="customers" fill="var(--color-customers)" name="Customers" />
                    <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Segment Descriptions</CardTitle>
          <CardDescription>Understanding your customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium text-green-700">VIP Customers</h3>
              <p className="text-sm text-muted-foreground">
                High-value customers who shop frequently and recently. Focus on retention and premium offerings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-green-600">Loyal Customers</h3>
              <p className="text-sm text-muted-foreground">
                Regular shoppers with good spending habits. Target with loyalty programs and personalized
                recommendations.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-lime-600">Regular Customers</h3>
              <p className="text-sm text-muted-foreground">
                Consistent shoppers with moderate spending. Encourage increased purchase frequency with targeted
                promotions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-yellow-600">Recent Customers</h3>
              <p className="text-sm text-muted-foreground">
                New customers who have made purchases recently. Focus on second purchase conversion and onboarding.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-orange-600">At Risk Customers</h3>
              <p className="text-sm text-muted-foreground">
                Previously active customers who haven't purchased recently. Target with re-engagement campaigns.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-red-600">Inactive Customers</h3>
              <p className="text-sm text-muted-foreground">
                Customers who haven't purchased in a long time. Consider win-back campaigns or special offers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
