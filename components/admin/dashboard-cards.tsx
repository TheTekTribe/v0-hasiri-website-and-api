import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Package, ShoppingCart, IndianRupee } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹45,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +20.1% <ArrowUpRight className="ml-1 h-4 w-4" />
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +12.2% <ArrowUpRight className="ml-1 h-4 w-4" />
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">124</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +8.3% <ArrowUpRight className="ml-1 h-4 w-4" />
            </span>
            new products this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,350</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +18.7% <ArrowUpRight className="ml-1 h-4 w-4" />
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
