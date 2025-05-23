import { createClient } from "@/lib/supabase/server"
import type { Address, AddressFormData, AddressType } from "@/lib/types/address"

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching addresses:", error)
    throw new Error("Failed to fetch addresses")
  }

  return data as Address[]
}

export async function getAddressById(addressId: string): Promise<Address | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("addresses").select("*").eq("id", addressId).single()

  if (error) {
    console.error("Error fetching address:", error)
    return null
  }

  return data as Address
}

export async function getDefaultAddress(userId: string, type?: "billing" | "shipping"): Promise<Address | null> {
  const supabase = createClient()

  let query = supabase.from("addresses").select("*").eq("user_id", userId)

  if (type === "billing") {
    query = query.eq("is_billing_default", true)
  } else if (type === "shipping") {
    query = query.eq("is_shipping_default", true)
  } else {
    query = query.eq("is_default", true)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error("Error fetching default address:", error)
    return null
  }

  if (!data) {
    // If no default found, return the first address
    const { data: firstAddress, error: firstAddressError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (firstAddressError) {
      console.error("Error fetching first address:", firstAddressError)
      return null
    }

    return firstAddress as Address
  }

  return data as Address
}

export async function createAddress(userId: string, addressData: AddressFormData): Promise<Address | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      ...addressData,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating address:", error)
    throw new Error("Failed to create address")
  }

  return data as Address
}

export async function updateAddress(addressId: string, addressData: Partial<AddressFormData>): Promise<Address | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("addresses")
    .update({
      ...addressData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .select()
    .single()

  if (error) {
    console.error("Error updating address:", error)
    throw new Error("Failed to update address")
  }

  return data as Address
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("addresses").delete().eq("id", addressId)

  if (error) {
    console.error("Error deleting address:", error)
    return false
  }

  return true
}

export async function getAddressesByType(userId: string, type: AddressType): Promise<Address[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("address_type", type)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching addresses by type:", error)
    throw new Error("Failed to fetch addresses")
  }

  return data as Address[]
}
