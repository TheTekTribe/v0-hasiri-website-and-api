import Link from "next/link"
import { Check, ArrowRight, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function OrderConfirmationPage() {
  // Generate a random order number
  const orderNumber = `HS-${Math.floor(100000 + Math.random() * 900000)}`

  // Get current date and estimated delivery date (7 days from now)
  const currentDate = new Date()
  const deliveryDate = new Date(currentDate)
  deliveryDate.setDate(deliveryDate.getDate() + 7)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl py-10">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground max-w-md">
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Order Number</h3>
                <p className="font-bold">{orderNumber}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Order Date</h3>
                <p>{formatDate(currentDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Payment Method</h3>
                <p>Credit Card</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Estimated Delivery</h3>
                <p>{formatDate(deliveryDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We're preparing your items for shipment. You'll receive an email when your order ships.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered to your address within 5-7 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1B5E20]">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Orders
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
