"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, CreditCard, ShoppingBag, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { CheckoutForm } from "@/components/checkout-form"
import { CheckoutSummary } from "@/components/checkout-summary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./checkout.css"

// Define the shipping info interface
interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  notes: string
}

// Define the form data interface
interface FormData {
  shippingInfo: ShippingInfo
  paymentMethod: string
}

const steps = [
  { id: "shipping", title: "Shipping", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review", icon: ShoppingBag },
  { id: "complete", title: "Complete", icon: Check },
]

// Default empty form data - ensure all fields are initialized
const defaultFormData: FormData = {
  shippingInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  },
  paymentMethod: "card",
}

// Debug flag - set to true to enable detailed logging
const DEBUG_MODE = true

function debugLog(message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`[CHECKOUT] ${message}`, data !== undefined ? data : "")
  }
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState("shipping")
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()
  const { items = [], subtotal = 0, totalItems = 0, clearCartSilently } = useCart() || {}

  // Initialize form data state with default values
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  // Debug cart state on mount
  useEffect(() => {
    debugLog("Cart state on mount:", { items, totalItems, subtotal })
  }, [items, totalItems, subtotal])

  // Load form data from localStorage on component mount
  useEffect(() => {
    try {
      debugLog("Component mounted, loading saved form data")
      const savedFormData = localStorage.getItem("hasiriCheckoutFormData")
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData)
        debugLog("Found saved form data", parsedData)

        // Create a new object with all required fields
        const loadedFormData: FormData = {
          shippingInfo: {
            firstName: parsedData.shippingInfo?.firstName || "",
            lastName: parsedData.shippingInfo?.lastName || "",
            email: parsedData.shippingInfo?.email || "",
            phone: parsedData.shippingInfo?.phone || "",
            address: parsedData.shippingInfo?.address || "",
            city: parsedData.shippingInfo?.city || "",
            state: parsedData.shippingInfo?.state || "",
            pincode: parsedData.shippingInfo?.pincode || "",
            notes: parsedData.shippingInfo?.notes || "",
          },
          paymentMethod: parsedData.paymentMethod || "card",
        }

        setFormData(loadedFormData)
      } else {
        debugLog("No saved form data found")
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error)
    }
  }, [])

  // Save form data to localStorage when it changes
  useEffect(() => {
    try {
      debugLog("Saving form data to localStorage", formData)
      localStorage.setItem("hasiriCheckoutFormData", JSON.stringify(formData))
    } catch (error) {
      console.error("Error saving form data to localStorage:", error)
    }
  }, [formData])

  // Update form data from child component
  const updateFormData = (newData: Partial<FormData>) => {
    // Only update if there are actual changes
    setFormData((prev) => {
      // For shipping info, only update if there are changes
      const updatedShippingInfo = newData.shippingInfo
        ? {
            ...prev.shippingInfo,
            ...newData.shippingInfo,
          }
        : prev.shippingInfo

      // For payment method, only update if there's a change
      const updatedPaymentMethod = newData.paymentMethod !== undefined ? newData.paymentMethod : prev.paymentMethod

      // If nothing changed, return the previous state to avoid re-render
      if (updatedShippingInfo === prev.shippingInfo && updatedPaymentMethod === prev.paymentMethod) {
        return prev
      }

      // Otherwise return the updated state
      return {
        shippingInfo: updatedShippingInfo,
        paymentMethod: updatedPaymentMethod,
      }
    })
  }

  // Check if cart is empty - fixed to properly check items array
  const isCartEmpty = !items || items.length === 0

  if (isCartEmpty && currentStep !== "complete") {
    debugLog("Cart is empty, showing empty cart message")
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container max-w-6xl py-10">
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart to proceed to checkout.</p>
            <Link href="/products">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]">Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleNext = () => {
    try {
      debugLog(`Moving to next step from ${currentStep}`)
      const currentIndex = steps.findIndex((step) => step.id === currentStep)
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id)
      }
    } catch (error) {
      console.error("Error in handleNext:", error)
    }
  }

  const handleBack = () => {
    try {
      debugLog(`Moving to previous step from ${currentStep}`)
      const currentIndex = steps.findIndex((step) => step.id === currentStep)
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1].id)
      }
    } catch (error) {
      console.error("Error in handleBack:", error)
    }
  }

  const handleComplete = async () => {
    try {
      debugLog("Order completion started")
      setOrderSubmitting(true)
      setOrderError(null)

      // Prepare order data with explicit product names
      const orderItems = items.map((item) => {
        // Ensure name is explicitly included
        return {
          product_id: item.id,
          product_name: item.name, // Explicitly include the product name
          quantity: item.quantity,
          unit_price: item.priceValue,
          total_price: item.priceValue * item.quantity,
        }
      })

      debugLog("Order items prepared", orderItems)

      const orderData = {
        shipping_address: {
          name: `${formData.shippingInfo.firstName} ${formData.shippingInfo.lastName}`,
          email: formData.shippingInfo.email,
          phone: formData.shippingInfo.phone,
          address: formData.shippingInfo.address,
          city: formData.shippingInfo.city,
          state: formData.shippingInfo.state,
          pincode: formData.shippingInfo.pincode,
          notes: formData.shippingInfo.notes,
        },
        billing_address: {
          name: `${formData.shippingInfo.firstName} ${formData.shippingInfo.lastName}`,
          email: formData.shippingInfo.email,
          phone: formData.shippingInfo.phone,
          address: formData.shippingInfo.address,
          city: formData.shippingInfo.city,
          state: formData.shippingInfo.state,
          pincode: formData.shippingInfo.pincode,
        },
        payment_method: formData.paymentMethod,
        shipping_method: "standard",
        items: orderItems,
      }

      debugLog("Submitting order to API", orderData)

      // Get user ID from localStorage if available
      const userId = localStorage.getItem("userId") || "guest-user"

      // Submit order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(orderData),
      })

      const responseData = await response.json()
      debugLog("API response received", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create order")
      }

      // Clear the cart silently when order is completed
      debugLog("Order created successfully, clearing cart")
      if (items && items.length > 0) {
        clearCartSilently()
      }

      // Then set the step to complete
      setCurrentStep("complete")

      // Clear the form data from localStorage
      localStorage.removeItem("hasiriCheckoutFormData")

      debugLog("Order process completed successfully")
    } catch (error) {
      console.error("Error in handleComplete:", error)
      setOrderError((error as Error).message || "Failed to create order")
    } finally {
      setOrderSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container max-w-6xl py-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4">Checkout</h1>
        </div>

        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              // Calculate if this step is completed
              const isCompleted = steps.findIndex((s) => s.id === currentStep) > index
              // Calculate if this step is active
              const isActive = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                        : isCompleted
                          ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                          : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.icon && <step.icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive || isCompleted ? "text-[#2E7D32]" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === "shipping" && "Shipping Information"}
                  {currentStep === "payment" && "Payment Details"}
                  {currentStep === "review" && "Review Your Order"}
                  {currentStep === "complete" && "Order Complete"}
                </CardTitle>
                <CardDescription>
                  {currentStep === "shipping" && "Enter your shipping address"}
                  {currentStep === "payment" && "Enter your payment information"}
                  {currentStep === "review" && "Review your order details before placing your order"}
                  {currentStep === "complete" && "Your order has been placed successfully"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Use key prop to force remount when step changes */}
                <CheckoutForm
                  key={currentStep}
                  currentStep={currentStep}
                  setIsValid={setIsFormValid}
                  formData={formData}
                  updateFormData={updateFormData}
                />

                {orderError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">{orderError}</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep !== "shipping" && currentStep !== "complete" && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {currentStep === "shipping" && (
                  <div className="ml-auto">
                    <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]" onClick={handleNext} disabled={!isFormValid}>
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                {currentStep === "payment" && (
                  <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]" onClick={handleNext}>
                    Review Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {currentStep === "review" && (
                  <Button
                    className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                    onClick={handleComplete}
                    disabled={orderSubmitting}
                  >
                    {orderSubmitting ? "Processing..." : "Place Order"}
                    {!orderSubmitting && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                )}
                {currentStep === "complete" && (
                  <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]" onClick={() => router.push("/")}>
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <CheckoutSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
