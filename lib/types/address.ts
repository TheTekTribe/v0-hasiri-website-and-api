export type AddressType = "farm" | "home" | "business" | "delivery" | "billing" | "other"

export interface Address {
  id: string
  user_id: string
  name: string
  address_type: AddressType
  is_default: boolean
  is_billing_default: boolean
  is_shipping_default: boolean
  recipient_name?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  latitude?: number
  longitude?: number
  farm_size_acres?: number
  soil_type?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface AddressFormData {
  name: string
  address_type: AddressType
  recipient_name?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  latitude?: number
  longitude?: number
  farm_size_acres?: number
  soil_type?: string
  notes?: string
  is_default?: boolean
  is_billing_default?: boolean
  is_shipping_default?: boolean
}
