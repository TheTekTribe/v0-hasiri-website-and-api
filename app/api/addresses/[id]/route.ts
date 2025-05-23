import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAddressById, updateAddress, deleteAddress } from "@/lib/services/address-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const address = await getAddressById(params.id)

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Check if the address belongs to the user
    if (address.user_id !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

      if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    return NextResponse.json({ address })
  } catch (error) {
    console.error(`Error in GET /api/addresses/${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addressData = await request.json()

    // Check if the address exists and belongs to the user
    const existingAddress = await getAddressById(params.id)

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    if (existingAddress.user_id !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

      if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const updatedAddress = await updateAddress(params.id, addressData)

    return NextResponse.json({ address: updatedAddress })
  } catch (error) {
    console.error(`Error in PUT /api/addresses/${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the address exists and belongs to the user
    const existingAddress = await getAddressById(params.id)

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    if (existingAddress.user_id !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

      if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const success = await deleteAddress(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/addresses/${params.id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
