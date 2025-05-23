import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAddress, getUserAddresses } from "@/lib/services/address-service"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await getUserAddresses(user.id)

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Error in GET /api/addresses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addressData = await request.json()

    const address = await createAddress(user.id, addressData)

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/addresses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
