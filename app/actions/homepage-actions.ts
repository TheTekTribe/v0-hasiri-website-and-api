"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import type {
  HomepageSection,
  HomepageSectionUpdate,
  CarouselImage,
  CarouselImageUpdate,
} from "@/lib/services/homepage-service"

// Homepage section actions
export async function updateHomepageSection(id: string, updates: HomepageSectionUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("homepage_sections").update(updates).eq("id", id).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true, data }
}

export async function createHomepageSection(section: Omit<HomepageSection, "id" | "created_at" | "updated_at">) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("homepage_sections").insert(section).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true, data }
}

export async function deleteHomepageSection(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("homepage_sections").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true }
}

export async function reorderHomepageSections(sections: { id: string; display_order: number }[]) {
  const supabase = createServerClient()

  // Update each section's display_order
  const promises = sections.map(({ id, display_order }) =>
    supabase.from("homepage_sections").update({ display_order }).eq("id", id),
  )

  try {
    await Promise.all(promises)
    revalidatePath("/")
    revalidatePath("/admin/homepage")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Carousel image actions
export async function updateCarouselImage(id: string, updates: CarouselImageUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("carousel_images").update(updates).eq("id", id).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true, data }
}

export async function createCarouselImage(image: Omit<CarouselImage, "id" | "created_at" | "updated_at">) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("carousel_images").insert(image).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true, data }
}

export async function deleteCarouselImage(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("carousel_images").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true }
}

export async function reorderCarouselImages(images: { id: string; display_order: number }[]) {
  const supabase = createServerClient()

  // Update each image's display_order
  const promises = images.map(({ id, display_order }) =>
    supabase.from("carousel_images").update({ display_order }).eq("id", id),
  )

  try {
    await Promise.all(promises)
    revalidatePath("/")
    revalidatePath("/admin/homepage")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
