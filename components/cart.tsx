"use client"
import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen, totalItems, subtotal } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-5 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="flex w-8 items-center justify-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{item.price}</span>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              Subtotal: ₹{formatPrice(item.priceValue * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={clearCart} className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground">Add items to your cart to see them here.</p>
            </div>
            <Button onClick={() => setIsCartOpen(false)} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
