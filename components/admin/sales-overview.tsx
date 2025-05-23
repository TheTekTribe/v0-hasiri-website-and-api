"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

type Order = {
  id: string
  total: number
  created_at: string
  status: string
}

type SalesOverviewProps = {
  data: Order[]
}

export function SalesOverview({ data }: SalesOverviewProps) {
  // Process data for monthly sales chart
  const monthlySalesData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    // Initialize data structure
    const monthlyData = months.map((month, index) => ({
      name: month,
      [currentYear]: 0,
      [lastYear]: 0,
      month: index,
    }))

    // Populate with actual data
    data.forEach((order) => {
      const orderDate = new Date(order.created_at)
      const orderYear = orderDate.getFullYear()
      const orderMonth = orderDate.getMonth()

      if (orderYear === currentYear || orderYear === lastYear) {
        monthlyData[orderMonth][orderYear] += order.total || 0
      }
    })

    return monthlyData
  }, [data])

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return data.reduce((sum, order) => sum + (order.total || 0), 0)
  }, [data])

  // Calculate average order value
  const averageOrderValue = useMemo(() => {
    return data.length > 0 ? totalRevenue / data.length : 0
  }, [data, totalRevenue])

  // Calculate order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {}

    data.forEach((order) => {
      const status = order.status || "unknown"
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }))
  }, [data])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">{data.length} total orders</p>
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
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">From website visits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Comparison of sales by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                [new Date().getFullYear()]: {
                  label: `${new Date().getFullYear()}`,
                  color: "hsl(var(--chart-1))",
                },
                [new Date().getFullYear() - 1]: {
                  label: `${new Date().getFullYear() - 1}`,
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData}>
                  <defs>
                    <linearGradient id="colorCurrentYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-2023)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-2023)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-2022)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-2022)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey={new Date().getFullYear()}
                    stroke="var(--color-2023)"
                    fillOpacity={1}
                    fill="url(#colorCurrentYear)"
                  />
                  <Area
                    type="monotone"
                    dataKey={new Date().getFullYear() - 1}
                    stroke="var(--color-2022)"
                    fillOpacity={1}
                    fill="url(#colorLastYear)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Orders",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Weekly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: "Week 1", sales: 12000, orders: 42 },
                      { name: "Week 2", sales: 18000, orders: 63 },
                      { name: "Week 3", sales: 15000, orders: 51 },
                      { name: "Week 4", sales: 21000, orders: 72 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--color-sales)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-orders)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="var(--color-sales)" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="var(--color-orders)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
