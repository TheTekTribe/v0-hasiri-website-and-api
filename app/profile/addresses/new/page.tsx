import { createClient } from "@/lib/supabase/server"
import AddressForm from "@/components/address/address-form"

export default async function NewAddressPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to add an address.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Address</h1>
      <AddressForm />
    </div>
  )
}
