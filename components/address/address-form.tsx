"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { AddressFormData, AddressType } from "@/lib/types/address"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

const addressFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address_type: z.enum(["farm", "home", "business", "delivery", "billing", "other"]),
  recipient_name: z.string().optional(),
  address_line1: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  address_line2: z.string().optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postal_code: z.string().min(5, {
    message: "Postal code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  farm_size_acres: z.number().optional(),
  soil_type: z.string().optional(),
  notes: z.string().optional(),
  is_default: z.boolean().default(false),
  is_billing_default: z.boolean().default(false),
  is_shipping_default: z.boolean().default(false),
})

interface AddressFormProps {
  initialData?: AddressFormData
  addressId?: string
  onSuccess?: () => void
}

export default function AddressForm({ initialData, addressId, onSuccess }: AddressFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!addressId

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData || {
      name: "",
      address_type: "farm",
      recipient_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      phone: "",
      notes: "",
      is_default: false,
      is_billing_default: false,
      is_shipping_default: false,
    },
  })

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    try {
      setIsSubmitting(true)

      const endpoint = isEditing ? `/api/addresses/${addressId}` : "/api/addresses"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save address")
      }

      toast({
        title: isEditing ? "Address updated" : "Address created",
        description: isEditing
          ? "Your address has been updated successfully."
          : "Your address has been created successfully.",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/profile/addresses")
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addressTypes: { value: AddressType; label: string }[] = [
    { value: "farm", label: "Farm" },
    { value: "home", label: "Home" },
    { value: "business", label: "Business" },
    { value: "delivery", label: "Delivery" },
    { value: "billing", label: "Billing" },
    { value: "other", label: "Other" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Farm, Home, etc." {...field} />
                    </FormControl>
                    <FormDescription>A name to help you identify this address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select address type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {addressTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of person receiving deliveries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, P.O. box, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("address_type") === "farm" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="farm_size_acres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Size (acres)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Farm size in acres"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soil_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Soil type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Set as Default Address</FormLabel>
                      <FormDescription>Use this as your primary address</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_billing_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Set as Default Billing Address</FormLabel>
                      <FormDescription>Use this as your default billing address</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_shipping_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Set as Default Shipping Address</FormLabel>
                      <FormDescription>Use this as your default shipping address</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
