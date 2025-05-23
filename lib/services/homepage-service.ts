import { createServerClient } from "../supabase/server"
import { supabase } from "../supabase/client"
import type { Database } from "../supabase/database.types"

export type HomepageSection = Database["public"]["Tables"]["homepage_sections"]["Row"]
export type HomepageSectionInsert = Database["public"]["Tables"]["homepage_sections"]["Insert"]
export type HomepageSectionUpdate = Database["public"]["Tables"]["homepage_sections"]["Update"]

export type CarouselImage = Database["public"]["Tables"]["carousel_images"]["Row"]
export type CarouselImageInsert = Database["public"]["Tables"]["carousel_images"]["Insert"]
export type CarouselImageUpdate = Database["public"]["Tables"]["carousel_images"]["Update"]

// Server-side functions for homepage sections
export const getHomepageSections = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching homepage sections:", error)
    throw error
  }

  return data
}

export const getEnabledHomepageSections = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching enabled homepage sections:", error)
    throw error
  }

  return data
}

// Server-side functions for carousel images
export const getCarouselImages = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("carousel_images").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching carousel images:", error)
    throw error
  }

  return data
}

export const getEnabledCarouselImages = async () => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("carousel_images")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching enabled carousel images:", error)
    throw error
  }

  return data
}

// Client-side functions for homepage sections
export const createHomepageSection = async (section: HomepageSectionInsert) => {
  const { data, error } = await supabase.from("homepage_sections").insert(section).select().single()

  if (error) {
    console.error("Error creating homepage section:", error)
    throw error
  }

  return data
}

export const updateHomepageSection = async (id: string, updates: HomepageSectionUpdate) => {
  const { data, error } = await supabase.from("homepage_sections").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating homepage section ${id}:`, error)
    throw error
  }

  return data
}

export const deleteHomepageSection = async (id: string) => {
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting homepage section ${id}:`, error)
    throw error
  }

  return true
}

export const reorderHomepageSections = async (orderedSections: { id: string; display_order: number }[]) => {
  const { error } = await supabase.rpc("reorder_homepage_sections", { sections: orderedSections })

  if (error) {
    console.error("Error reordering homepage sections:", error)
    throw error
  }

  return true
}

// Client-side functions for carousel images
export const createCarouselImage = async (image: CarouselImageInsert) => {
  const { data, error } = await supabase.from("carousel_images").insert(image).select().single()

  if (error) {
    console.error("Error creating carousel image:", error)
    throw error
  }

  return data
}

export const updateCarouselImage = async (id: string, updates: CarouselImageUpdate) => {
  const { data, error } = await supabase.from("carousel_images").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating carousel image ${id}:`, error)
    throw error
  }

  return data
}

export const deleteCarouselImage = async (id: string) => {
  const { error } = await supabase.from("carousel_images").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting carousel image ${id}:`, error)
    throw error
  }

  return true
}

export const reorderCarouselImages = async (orderedImages: { id: string; display_order: number }[]) => {
  const { error } = await supabase.rpc("reorder_carousel_images", { images: orderedImages })

  if (error) {
    console.error("Error reordering carousel images:", error)
    throw error
  }

  return true
}
