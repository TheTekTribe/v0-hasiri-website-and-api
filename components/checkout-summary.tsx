"use client"

import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function CheckoutSummary() {
  // Call useCart at the top level of the component, not inside useEffect
  const { items = [], subtotal = 0 } = useCart() || {}

  // Calculate shipping cost (free for orders over ₹2000)
  const shippingCost = subtotal > 2000 ? 0 : 150

  // Calculate tax (5% GST)
  const taxRate = 0.05
  const tax = subtotal * taxRate

  // Calculate total
  const total = subtotal + shippingCost + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="font-medium line-clamp-1">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="font-medium">₹{formatPrice(item.priceValue * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No items in cart</p>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shippingCost === 0 ? "Free" : `₹${formatPrice(shippingCost)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (5% GST)</span>
            <span>₹{formatPrice(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₹{formatPrice(total)}</span>
          </div>
        </div>

        {/* Shipping Policy */}
        {subtotal < 2000 && (
          <div className="text-xs text-muted-foreground mt-4">
            <p>Free shipping on orders over ₹2,000</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 text-xs text-muted-foreground">
        <p>
          By placing your order, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
