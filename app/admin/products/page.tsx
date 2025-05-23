import { ProductManager } from "@/components/admin/product-manager"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
      <ProductManager />
    </div>
  )
}
