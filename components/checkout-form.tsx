"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Check, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"

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

interface CheckoutFormProps {
  currentStep: string
  isValid?: boolean
  setIsValid?: (valid: boolean) => void
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

// List of Indian states for the dropdown
const indianStates = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "gujarat", label: "Gujarat" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "punjab", label: "Punjab" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "west-bengal", label: "West Bengal" },
]

const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`

export function CheckoutForm({ currentStep, setIsValid, formData, updateFormData }: CheckoutFormProps) {
  const { items = [] } = useCart() || {}

  // Create local state for each form field
  const [firstName, setFirstName] = useState(formData.shippingInfo.firstName || "")
  const [lastName, setLastName] = useState(formData.shippingInfo.lastName || "")
  const [email, setEmail] = useState(formData.shippingInfo.email || "")
  const [phone, setPhone] = useState(formData.shippingInfo.phone || "")
  const [address, setAddress] = useState(formData.shippingInfo.address || "")
  const [city, setCity] = useState(formData.shippingInfo.city || "")
  const [state, setState] = useState(formData.shippingInfo.state || "")
  const [pincode, setPincode] = useState(formData.shippingInfo.pincode || "")
  const [notes, setNotes] = useState(formData.shippingInfo.notes || "")
  const [paymentMethod, setPaymentMethod] = useState(formData.paymentMethod || "card")

  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validate form fields
  useEffect(() => {
    if (currentStep === "shipping" && setIsValid) {
      const newErrors: Record<string, string> = {}

      // Validate first name
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required"
      }

      // Validate phone
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone number"
      }

      // Validate address
      if (!address.trim()) {
        newErrors.address = "Address is required"
      }

      // Update errors state
      setErrors(newErrors)

      // Check if form is valid
      const isFormValid =
        Object.keys(newErrors).length === 0 && firstName.trim() !== "" && phone.trim() !== "" && address.trim() !== ""

      setIsValid(isFormValid)
    }
  }, [currentStep, setIsValid, firstName, phone, address])

  // Remove the problematic useEffect that's causing the infinite loop
  // Replace this useEffect:
  // useEffect(() => {
  //   return () => {
  //     // Only update parent data when unmounting
  //     if (currentStep === "shipping") {
  //       updateFormData({
  //         shippingInfo: {
  //           firstName,
  //           lastName,
  //           email,
  //           phone,
  //           address,
  //           city,
  //           state,
  //           pincode,
  //           notes,
  //         },
  //       })
  //     } else if (currentStep === "payment") {
  //       updateFormData({
  //         paymentMethod,
  //       })
  //     }
  //   }
  // }, [currentStep, updateFormData])

  // With these individual handlers that only update when the user changes a value:

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        firstName: value,
      },
    })
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        lastName: value,
      },
    })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        email: value,
      },
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        phone: value,
      },
    })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setAddress(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        address: value,
      },
    })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCity(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        city: value,
      },
    })
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setState(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        state: value,
      },
    })
  }

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPincode(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        pincode: value,
      },
    })
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNotes(value)
    updateFormData({
      shippingInfo: {
        ...formData.shippingInfo,
        notes: value,
      },
    })
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    updateFormData({
      paymentMethod: value,
    })
  }

  // Then update all the onChange handlers in the JSX to use these new functions
  // For example:
  // onChange={(e) => setFirstName(e.target.value)} becomes onChange={handleFirstNameChange}

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  if (currentStep === "shipping") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex justify-between">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              onBlur={() => handleBlur("firstName")}
              placeholder="Enter your first name"
              className={errors.firstName && touched.firstName ? "border-red-500" : ""}
              required
            />
            {errors.firstName && touched.firstName && (
              <p className="text-xs text-red-500 mt-1 animate-fadeIn">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex justify-between">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur("phone")}
              placeholder="Enter your phone number"
              className={errors.phone && touched.phone ? "border-red-500" : ""}
              required
            />
            {errors.phone && touched.phone && (
              <p className="text-xs text-red-500 mt-1 animate-fadeIn">{errors.phone}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" className="flex justify-between">
            Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            value={address}
            onChange={handleAddressChange}
            onBlur={() => handleBlur("address")}
            placeholder="Enter your address"
            className={errors.address && touched.address ? "border-red-500" : ""}
            required
          />
          {errors.address && touched.address && (
            <p className="text-xs text-red-500 mt-1 animate-fadeIn">{errors.address}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={city} onChange={handleCityChange} placeholder="Enter your city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              value={state}
              onChange={handleStateChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select state</option>
              {indianStates.map((stateOption) => (
                <option key={stateOption.value} value={stateOption.value}>
                  {stateOption.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input
              id="pincode"
              name="pincode"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="Enter PIN code"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Notes about your order, e.g. special notes for delivery"
          />
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <p>
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "payment") {
    return (
      <div className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-5 w-5" />
              Credit/Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="cursor-pointer">
              UPI Payment
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="cursor-pointer">
              Cash on Delivery
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === "card" && (
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="Enter name as on card" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "upi" && (
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="yourname@upi" required />
            </div>
          </div>
        )}

        {paymentMethod === "cod" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Please note that a nominal fee of ₹50 will be charged for Cash on Delivery orders.
            </p>
          </div>
        )}
      </div>
    )
  }

  if (currentStep === "review") {
    // Use the parent formData for review
    const reviewShippingInfo = formData.shippingInfo
    const reviewPaymentMethod = formData.paymentMethod

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Shipping Information</h3>
          <div className="bg-muted p-4 rounded-md">
            <p>
              {reviewShippingInfo.firstName} {reviewShippingInfo.lastName}
            </p>
            <p>{reviewShippingInfo.address}</p>
            <p>
              {reviewShippingInfo.city},{" "}
              {reviewShippingInfo.state
                ? indianStates.find((s) => s.value === reviewShippingInfo.state)?.label || reviewShippingInfo.state
                : ""}{" "}
              {reviewShippingInfo.pincode}
            </p>
            <p>
              Email: {reviewShippingInfo.email || "Not provided"} | Phone: {reviewShippingInfo.phone || "Not provided"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Payment Method</h3>
          <div className="bg-muted p-4 rounded-md">
            <p className="flex items-center gap-2">
              {reviewPaymentMethod === "card" && <CreditCard className="h-4 w-4" />}
              {reviewPaymentMethod === "card" && "Credit/Debit Card"}
              {reviewPaymentMethod === "upi" && "UPI Payment"}
              {reviewPaymentMethod === "cod" && "Cash on Delivery"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Order Items</h3>
          <div className="bg-muted p-4 rounded-md space-y-4">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-medium">₹{formatPrice(item.priceValue * item.quantity)}</p>
                </div>
              ))
            ) : (
              <p>No items in cart</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "complete") {
    // Use the parent formData for the completion page
    const completionShippingInfo = formData.shippingInfo

    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
        <p className="text-center text-muted-foreground mb-4">
          Your order has been placed successfully. We have sent a confirmation email to{" "}
          {completionShippingInfo.email || "your email address"}.
        </p>
        <div className="bg-muted p-4 rounded-md w-full mb-4">
          <p className="font-medium">Order Number: #HS-{Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="text-sm text-muted-foreground">Please keep this number for your reference.</p>
        </div>
        <p className="text-sm text-center">
          We will process your order soon. You can track your order status in your account dashboard.
        </p>
      </div>
    )
  }

  return null
}
