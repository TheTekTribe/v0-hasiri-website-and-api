"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CustomerSegmentation } from "./customer-segmentation"
import { SalesOverview } from "./sales-overview"
import { ProductPerformance } from "./product-performance"
import { CohortAnalysis } from "./cohort-analysis"

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchAnalyticsData() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch orders data for analytics
        const { data: orders, error: ordersError } = await supabase.from("orders").select("*")

        if (ordersError) throw new Error(ordersError.message)

        // Fetch users data for customer segmentation
        const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*")

        if (profilesError) throw new Error(profilesError.message)

        // Fetch order items and products for product performance
        const { data: orderItems, error: itemsError } = await supabase.from("order_items").select(`
            *,
            product:product_id (*)
          `)

        if (itemsError) throw new Error(itemsError.message)

        setAnalyticsData({
          orders,
          profiles,
          orderItems,
        })
      } catch (err: any) {
        console.error("Error fetching analytics data:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [supabase])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load analytics data: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Sales Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Segmentation</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? <AnalyticsSkeletons /> : <SalesOverview data={analyticsData?.orders || []} />}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          {isLoading ? (
            <AnalyticsSkeletons />
          ) : (
            <CustomerSegmentation customers={analyticsData?.profiles || []} orders={analyticsData?.orders || []} />
          )}
        </TabsContent>

        <TabsContent value="cohort" className="space-y-4">
          {isLoading ? <AnalyticsSkeletons /> : <CohortAnalysis orders={analyticsData?.orders || []} />}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {isLoading ? <AnalyticsSkeletons /> : <ProductPerformance orderItems={analyticsData?.orderItems || []} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnalyticsSkeletons() {
  return (
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
