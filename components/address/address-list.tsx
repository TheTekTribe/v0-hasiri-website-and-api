"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Address } from "@/lib/types/address"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Home, Building, Truck, CreditCard, FileText, Check, Pencil, Trash2 } from "lucide-react"

interface AddressListProps {
  addresses: Address[]
  onAddressDeleted?: () => void
}

export default function AddressList({ addresses, onAddressDeleted }: AddressListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "farm":
        return <MapPin className="h-4 w-4" />
      case "home":
        return <Home className="h-4 w-4" />
      case "business":
        return <Building className="h-4 w-4" />
      case "delivery":
        return <Truck className="h-4 w-4" />
      case "billing":
        return <CreditCard className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleDelete = async (addressId: string) => {
    try {
      setDeletingId(addressId)

      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete address")
      }

      toast({
        title: "Address deleted",
        description: "The address has been deleted successfully.",
      })

      if (onAddressDeleted) {
        onAddressDeleted()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete address",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Addresses</CardTitle>
          <CardDescription>You haven't added any addresses yet.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/profile/addresses/new">Add Address</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center">{getAddressTypeIcon(address.address_type)}</span>
                <CardTitle className="text-lg">{address.name}</CardTitle>
              </div>
              <div className="flex space-x-2">
                {address.is_default && (
                  <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
                    <Check className="h-3 w-3" /> Default
                  </Badge>
                )}
                {address.is_billing_default && (
                  <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-600">
                    <CreditCard className="h-3 w-3" /> Billing
                  </Badge>
                )}
                {address.is_shipping_default && (
                  <Badge variant="outline" className="flex items-center gap-1 border-purple-500 text-purple-600">
                    <Truck className="h-3 w-3" /> Shipping
                  </Badge>
                )}
              </div>
            </div>
            <CardDescription className="capitalize">{address.address_type} Address</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-1 text-sm">
              {address.recipient_name && <p>{address.recipient_name}</p>}
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
              {address.phone && <p className="pt-1">{address.phone}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/profile/addresses/${address.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Address</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this address? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletingId === address.id ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
