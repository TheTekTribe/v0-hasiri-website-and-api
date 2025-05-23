"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import type { Testimonial, TestimonialUpdate } from "@/lib/services/testimonial-service"

// Testimonial actions
export async function updateTestimonial(id: string, updates: TestimonialUpdate) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/login")
  revalidatePath("/signup")
  revalidatePath("/admin/testimonials")

  return { success: true, data }
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "created_at" | "updated_at">) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/login")
  revalidatePath("/signup")
  revalidatePath("/admin/testimonials")

  return { success: true, data }
}

export async function deleteTestimonial(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/login")
  revalidatePath("/signup")
  revalidatePath("/admin/testimonials")

  return { success: true }
}

export async function reorderTestimonials(testimonials: { id: string; display_order: number }[]) {
  const supabase = createServerClient()

  // Update each testimonial's display_order
  const promises = testimonials.map(({ id, display_order }) =>
    supabase.from("testimonials").update({ display_order }).eq("id", id),
  )

  try {
    await Promise.all(promises)
    revalidatePath("/login")
    revalidatePath("/signup")
    revalidatePath("/admin/testimonials")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
