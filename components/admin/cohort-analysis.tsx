"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Order = {
  id: string
  user_id: string
  total: number
  created_at: string
  status: string
}

type CohortAnalysisProps = {
  orders: Order[]
}

export function CohortAnalysis({ orders }: CohortAnalysisProps) {
  const [timeFrame, setTimeFrame] = useState("month")
  const [metricType, setMetricType] = useState("retention")
  const [periodCount, setPeriodCount] = useState("12")

  // Process orders to get first purchase date for each customer
  const customerFirstPurchase = useMemo(() => {
    const firstPurchases = new Map<string, Date>()

    // Sort orders by date (oldest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    // Find first purchase date for each customer
    sortedOrders.forEach((order) => {
      if (!firstPurchases.has(order.user_id)) {
        firstPurchases.set(order.user_id, new Date(order.created_at))
      }
    })

    return firstPurchases
  }, [orders])

  // Group orders by cohort and period
  const cohortData = useMemo(() => {
    // Skip if no orders
    if (orders.length === 0) return { cohorts: [], periods: [], data: [] }

    // Determine time frame in milliseconds
    const timeFrameMs =
      timeFrame === "month"
        ? 30 * 24 * 60 * 60 * 1000
        : timeFrame === "quarter"
          ? 91 * 24 * 60 * 60 * 1000
          : 365 * 24 * 60 * 60 * 1000

    // Find min and max dates
    const dates = orders.map((o) => new Date(o.created_at).getTime())
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))

    // Create cohort periods
    const cohorts: string[] = []
    let currentDate = new Date(minDate)

    // Truncate date to start of period
    if (timeFrame === "month") {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    } else if (timeFrame === "quarter") {
      const quarter = Math.floor(currentDate.getMonth() / 3)
      currentDate = new Date(currentDate.getFullYear(), quarter * 3, 1)
    } else {
      currentDate = new Date(currentDate.getFullYear(), 0, 1)
    }

    // Generate cohort labels
    while (currentDate <= maxDate) {
      let label = ""
      if (timeFrame === "month") {
        label = `${currentDate.toLocaleString("default", { month: "short" })} ${currentDate.getFullYear()}`
      } else if (timeFrame === "quarter") {
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1
        label = `Q${quarter} ${currentDate.getFullYear()}`
      } else {
        label = `${currentDate.getFullYear()}`
      }

      cohorts.push(label)

      // Move to next period
      if (timeFrame === "month") {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      } else if (timeFrame === "quarter") {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 1)
      } else {
        currentDate = new Date(currentDate.getFullYear() + 1, 0, 1)
      }
    }

    // Limit to the specified number of periods
    const limitedCohorts = cohorts.slice(0, Number.parseInt(periodCount))

    // Generate period labels (0, 1, 2, etc.)
    const periods = Array.from({ length: limitedCohorts.length }, (_, i) => i)

    // Initialize data structure
    const data: number[][] = Array(limitedCohorts.length)
      .fill(0)
      .map(() => Array(limitedCohorts.length).fill(0))

    // Count customers in each cohort
    const cohortCustomers = new Map<number, Set<string>>()

    // Assign customers to cohorts based on first purchase
    customerFirstPurchase.forEach((firstPurchaseDate, userId) => {
      // Determine which cohort this customer belongs to
      let cohortIndex = -1
      let cohortStartDate = new Date(minDate)

      // Truncate date to start of period
      if (timeFrame === "month") {
        cohortStartDate = new Date(cohortStartDate.getFullYear(), cohortStartDate.getMonth(), 1)
      } else if (timeFrame === "quarter") {
        const quarter = Math.floor(cohortStartDate.getMonth() / 3)
        cohortStartDate = new Date(cohortStartDate.getFullYear(), quarter * 3, 1)
      } else {
        cohortStartDate = new Date(cohortStartDate.getFullYear(), 0, 1)
      }

      for (let i = 0; i < limitedCohorts.length; i++) {
        const nextPeriodStart = new Date(cohortStartDate)
        if (timeFrame === "month") {
          nextPeriodStart.setMonth(nextPeriodStart.getMonth() + 1)
        } else if (timeFrame === "quarter") {
          nextPeriodStart.setMonth(nextPeriodStart.getMonth() + 3)
        } else {
          nextPeriodStart.setFullYear(nextPeriodStart.getFullYear() + 1)
        }

        if (firstPurchaseDate >= cohortStartDate && firstPurchaseDate < nextPeriodStart) {
          cohortIndex = i
          break
        }

        cohortStartDate = nextPeriodStart
      }

      if (cohortIndex >= 0 && cohortIndex < limitedCohorts.length) {
        if (!cohortCustomers.has(cohortIndex)) {
          cohortCustomers.set(cohortIndex, new Set())
        }
        cohortCustomers.get(cohortIndex)!.add(userId)
      }
    })

    // For each order, determine which period it belongs to relative to the customer's cohort
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at)
      const userId = order.user_id

      // Find which cohort this customer belongs to
      let cohortIndex = -1
      for (const [index, customers] of cohortCustomers.entries()) {
        if (customers.has(userId)) {
          cohortIndex = index
          break
        }
      }

      if (cohortIndex >= 0) {
        // Find first purchase date for this customer
        const firstPurchaseDate = customerFirstPurchase.get(userId)!

        // Calculate which period this order belongs to
        let periodIndex = 0
        if (timeFrame === "month") {
          periodIndex =
            (orderDate.getFullYear() - firstPurchaseDate.getFullYear()) * 12 +
            (orderDate.getMonth() - firstPurchaseDate.getMonth())
        } else if (timeFrame === "quarter") {
          const orderQuarter = Math.floor(orderDate.getMonth() / 3)
          const firstQuarter = Math.floor(firstPurchaseDate.getMonth() / 3)
          periodIndex = (orderDate.getFullYear() - firstPurchaseDate.getFullYear()) * 4 + (orderQuarter - firstQuarter)
        } else {
          periodIndex = orderDate.getFullYear() - firstPurchaseDate.getFullYear()
        }

        if (periodIndex >= 0 && periodIndex < limitedCohorts.length) {
          // For retention, we just mark that the customer was active in this period
          // For revenue, we add the order total
          if (metricType === "retention") {
            data[cohortIndex][periodIndex] = 1
          } else {
            data[cohortIndex][periodIndex] += order.total || 0
          }
        }
      }
    })

    // Calculate retention percentages or average revenue
    for (let i = 0; i < limitedCohorts.length; i++) {
      const cohortSize = cohortCustomers.get(i)?.size || 0
      if (cohortSize > 0) {
        // For retention: count unique customers in each period and divide by cohort size
        if (metricType === "retention") {
          // For each period, count unique customers
          const periodCustomers = new Map<number, Set<string>>()

          orders.forEach((order) => {
            const userId = order.user_id
            if (cohortCustomers.get(i)?.has(userId)) {
              const orderDate = new Date(order.created_at)
              const firstPurchaseDate = customerFirstPurchase.get(userId)!

              // Calculate which period this order belongs to
              let periodIndex = 0
              if (timeFrame === "month") {
                periodIndex =
                  (orderDate.getFullYear() - firstPurchaseDate.getFullYear()) * 12 +
                  (orderDate.getMonth() - firstPurchaseDate.getMonth())
              } else if (timeFrame === "quarter") {
                const orderQuarter = Math.floor(orderDate.getMonth() / 3)
                const firstQuarter = Math.floor(firstPurchaseDate.getMonth() / 3)
                periodIndex =
                  (orderDate.getFullYear() - firstPurchaseDate.getFullYear()) * 4 + (orderQuarter - firstQuarter)
              } else {
                periodIndex = orderDate.getFullYear() - firstPurchaseDate.getFullYear()
              }

              if (periodIndex >= 0 && periodIndex < limitedCohorts.length) {
                if (!periodCustomers.has(periodIndex)) {
                  periodCustomers.set(periodIndex, new Set())
                }
                periodCustomers.get(periodIndex)!.add(userId)
              }
            }
          })

          // Calculate retention rate for each period
          for (let j = 0; j < limitedCohorts.length; j++) {
            const activeCustomers = periodCustomers.get(j)?.size || 0
            data[i][j] = Math.round((activeCustomers / cohortSize) * 100)
          }
        } else {
          // For revenue: sum order totals for each period and divide by cohort size
          for (let j = 0; j < limitedCohorts.length; j++) {
            data[i][j] = Math.round(data[i][j] / cohortSize)
          }
        }
      }
    }

    return { cohorts: limitedCohorts, periods, data }
  }, [orders, customerFirstPurchase, timeFrame, metricType, periodCount])

  // Get color for cell based on value
  const getCellColor = (value: number) => {
    if (metricType === "retention") {
      // Retention color scale (0-100%)
      if (value === 0) return "bg-gray-100"
      if (value < 20) return "bg-red-100"
      if (value < 40) return "bg-orange-100"
      if (value < 60) return "bg-yellow-100"
      if (value < 80) return "bg-green-100"
      return "bg-emerald-100"
    } else {
      // Revenue color scale
      if (value === 0) return "bg-gray-100"
      if (value < 1000) return "bg-blue-100"
      if (value < 2000) return "bg-blue-200"
      if (value < 5000) return "bg-blue-300"
      if (value < 10000) return "bg-blue-400"
      return "bg-blue-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Cohort Analysis</CardTitle>
            <CardDescription>
              Track customer {metricType === "retention" ? "retention" : "revenue"} over time
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retention">Retention %</SelectItem>
                <SelectItem value="revenue">Avg Revenue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodCount} onValueChange={setPeriodCount}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Periods</SelectItem>
                <SelectItem value="12">12 Periods</SelectItem>
                <SelectItem value="24">24 Periods</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border bg-muted/50 px-4 py-2 text-left font-medium">Cohort</th>
                <th className="border bg-muted/50 px-4 py-2 text-left font-medium">Size</th>
                {cohortData.periods.map((period) => (
                  <th key={period} className="border bg-muted/50 px-4 py-2 text-center font-medium">
                    {timeFrame === "month" ? `M${period}` : timeFrame === "quarter" ? `Q${period}` : `Y${period}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.cohorts.map((cohort, cohortIndex) => {
                // Calculate cohort size
                const cohortSize = orders.filter((order) => {
                  const orderDate = new Date(order.created_at)
                  let cohortMatch = false

                  if (timeFrame === "month") {
                    const [month, year] = cohort.split(" ")
                    const monthIndex = new Date(`${month} 1, 2000`).getMonth()
                    cohortMatch =
                      orderDate.getMonth() === monthIndex && orderDate.getFullYear() === Number.parseInt(year)
                  } else if (timeFrame === "quarter") {
                    const [quarter, year] = cohort.split(" ")
                    const quarterNum = Number.parseInt(quarter.substring(1))
                    const orderQuarter = Math.floor(orderDate.getMonth() / 3) + 1
                    cohortMatch = orderQuarter === quarterNum && orderDate.getFullYear() === Number.parseInt(year)
                  } else {
                    cohortMatch = orderDate.getFullYear() === Number.parseInt(cohort)
                  }

                  return cohortMatch
                }).length

                return (
                  <tr key={cohort}>
                    <td className="border px-4 py-2 font-medium">{cohort}</td>
                    <td className="border px-4 py-2 text-center">{cohortSize}</td>
                    {cohortData.periods.map((period) => {
                      // Only show cells where period >= cohortIndex (can't have retention before cohort starts)
                      const value = period >= cohortIndex ? cohortData.data[cohortIndex][period - cohortIndex] : null
                      return (
                        <td
                          key={`${cohort}-${period}`}
                          className={`border px-4 py-2 text-center ${value !== null ? getCellColor(value) : ""}`}
                        >
                          {value !== null ? (metricType === "retention" ? `${value}%` : `₹${value}`) : ""}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">How to Read This Chart</h4>
            <p className="text-sm text-muted-foreground">
              Each row represents a cohort of customers who made their first purchase during that period. The columns
              show {metricType === "retention" ? "retention rates" : "average revenue"} for subsequent periods.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Color Legend</h4>
            <div className="flex flex-wrap gap-2">
              {metricType === "retention" ? (
                <>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-red-100"></div>
                    <span className="text-xs">0-20%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-orange-100"></div>
                    <span className="text-xs">20-40%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-yellow-100"></div>
                    <span className="text-xs">40-60%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-green-100"></div>
                    <span className="text-xs">60-80%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-emerald-100"></div>
                    <span className="text-xs">80-100%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-blue-100"></div>
                    <span className="text-xs">₹0-₹1,000</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-blue-200"></div>
                    <span className="text-xs">₹1,000-₹2,000</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-blue-300"></div>
                    <span className="text-xs">₹2,000-₹5,000</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-blue-400"></div>
                    <span className="text-xs">₹5,000-₹10,000</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-3 w-3 bg-blue-500"></div>
                    <span className="text-xs">₹10,000+</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
