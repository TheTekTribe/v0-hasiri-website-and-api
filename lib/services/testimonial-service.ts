import { createServerClient } from "../supabase/server"
import { supabase } from "../supabase/client"
import type { Database } from "../supabase/database.types"

export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]
export type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"]
export type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"]

// Server-side functions for testimonials
export const getTestimonials = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching testimonials:", error)
    throw error
  }

  return data
}

export const getEnabledTestimonials = async (page?: "login" | "signup") => {
  const supabase = createServerClient()

  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (page) {
    query = query.or(`page.eq.${page},page.eq.both`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching enabled testimonials:", error)
    throw error
  }

  return data
}

// Client-side functions for testimonials
export const createTestimonial = async (testimonial: TestimonialInsert) => {
  const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single()

  if (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }

  return data
}

export const updateTestimonial = async (id: string, updates: TestimonialUpdate) => {
  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating testimonial ${id}:`, error)
    throw error
  }

  return data
}

export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting testimonial ${id}:`, error)
    throw error
  }

  return true
}

export const reorderTestimonials = async (orderedTestimonials: { id: string; display_order: number }[]) => {
  const { error } = await supabase.rpc("reorder_testimonials", { testimonials: orderedTestimonials })

  if (error) {
    console.error("Error reordering testimonials:", error)
    throw error
  }

  return true
}
