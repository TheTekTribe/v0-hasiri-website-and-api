import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      <AnalyticsDashboard />
    </div>
  )
}
