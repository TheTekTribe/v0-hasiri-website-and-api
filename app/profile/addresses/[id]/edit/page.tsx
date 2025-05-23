import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAddressById } from "@/lib/services/address-service"
import AddressForm from "@/components/address/address-form"

interface EditAddressPageProps {
  params: {
    id: string
  }
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to edit an address.</p>
      </div>
    )
  }

  const address = await getAddressById(params.id)

  if (!address) {
    notFound()
  }

  // Check if the address belongs to the user
  if (address.user_id !== user.id) {
    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

    if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to edit this address.</p>
        </div>
      )
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Address</h1>
      <AddressForm initialData={address} addressId={params.id} />
    </div>
  )
}
