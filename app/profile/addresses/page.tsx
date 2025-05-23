import { createClient } from "@/lib/supabase/server"
import { getUserAddresses } from "@/lib/services/address-service"
import { Button } from "@/components/ui/button"
import AddressList from "@/components/address/address-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AddressesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to view your addresses.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const addresses = await getUserAddresses(user.id)

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Button asChild>
          <Link href="/profile/addresses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Link>
        </Button>
      </div>

      <AddressList addresses={addresses} />
    </div>
  )
}
