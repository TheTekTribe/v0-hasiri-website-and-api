import { OrderManager } from "@/components/admin/order-manager"

export const metadata = {
  title: "Order Management | Hasiri Admin",
  description: "Manage customer orders",
}

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>
      <OrderManager />
    </div>
  )
}
