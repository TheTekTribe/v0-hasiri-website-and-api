import { CategoryManager } from "@/components/admin/category-manager"

export const metadata = {
  title: "Category Management | Hasiri Admin",
  description: "Manage product categories for your Hasiri store",
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage product categories for your store</p>
      </div>
      <CategoryManager />
    </div>
  )
}
