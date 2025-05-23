import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/services/product-service"

export async function Products() {
  const products = await getFeaturedProducts(8).catch(() => [])

  return (
    <section className="py-12 md:py-24 bg-[#F8F5F0]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our range of sustainable agricultural inputs designed to improve soil health
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-12">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={Number.parseInt(product.id.slice(0, 8), 16)}
                name={product.name}
                description={product.description || ""}
                price={`₹${product.price}`}
                priceValue={product.price}
                originalPrice={product.sale_price ? `₹${product.sale_price}` : undefined}
                image={product.image_url || "/placeholder.svg?height=300&width=300&text=Product"}
                rating={4.5} // This would come from a reviews system
                reviewCount={42} // This would come from a reviews system
                inventory={
                  product.stock_quantity > 30 ? "in-stock" : product.stock_quantity > 0 ? "low-stock" : "out-of-stock"
                }
                isNew={false} // This could be determined by created_at date
                isFeatured={product.featured}
                discount={
                  product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0
                }
                category={product.category_id ? "Product Category" : "Uncategorized"} // This would need to be fetched from the category
              />
            ))
          ) : (
            // Fallback products if none are found in the database
            <p className="col-span-4 text-center text-gray-500">No products found</p>
          )}
        </div>
        <div className="flex justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
