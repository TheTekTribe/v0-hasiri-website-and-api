import { createServerClient } from "../supabase/server"
import { supabase } from "../supabase/client"
import type { Database } from "../supabase/database.types"

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

// Server-side functions
export const getProducts = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    throw error
  }

  return data
}

export const getProductBySlug = async (slug: string) => {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching product with slug ${slug}:`, error)
    throw error
  }

  return data
}

export const getFeaturedProducts = async (limit = 8) => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured products:", error)
    throw error
  }

  return data
}

// Client-side functions
export const createProduct = async (product: ProductInsert) => {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export const updateProduct = async (id: string, updates: ProductUpdate) => {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }

  return data
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }

  return true
}
