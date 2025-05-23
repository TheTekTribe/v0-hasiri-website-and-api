import { createServerClient } from "../supabase/server"
import { supabase } from "../supabase/client"
import type { Database } from "../supabase/database.types"

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"]

// Server-side functions
export const getCategories = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  return data
}

export const getCategoryBySlug = async (slug: string) => {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching category with slug ${slug}:`, error)
    throw error
  }

  return data
}

// Client-side functions
export const createCategory = async (category: CategoryInsert) => {
  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) {
    console.error("Error creating category:", error)
    throw error
  }

  return data
}

export const updateCategory = async (id: string, updates: CategoryUpdate) => {
  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating category ${id}:`, error)
    throw error
  }

  return data
}

export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting category ${id}:`, error)
    throw error
  }

  return true
}
