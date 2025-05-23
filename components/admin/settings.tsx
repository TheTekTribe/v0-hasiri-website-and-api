"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Globe, Mail, Bell, CreditCard } from "lucide-react"

export function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Hasiri",
    siteDescription: "Empowering farmers with regenerative agriculture solutions",
    contactEmail: "info@hasiri.com",
    phoneNumber: "+91 98765 43210",
    address: "123 Farming Road, Bangalore, Karnataka, India",
    currency: "INR",
    language: "en",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@hasiri.com",
    smtpPassword: "••••••••••••",
    senderName: "Hasiri Team",
    senderEmail: "notifications@hasiri.com",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newCustomerRegistration: true,
    newsletterSignup: false,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enableCreditCard: true,
    enableUPI: true,
    testMode: true,
    razorpayKeyId: "rzp_test_••••••••••••",
    razorpayKeySecret: "••••••••••••••••••••••••••",
  })

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value,
    })
  }

  const handleEmailSettingsChange = (field: string, value: string) => {
    setEmailSettings({
      ...emailSettings,
      [field]: value,
    })
  }

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    })
  }

  const handlePaymentSettingsChange = (field: string, value: any) => {
    setPaymentSettings({
      ...paymentSettings,
      [field]: value,
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment
        </TabsTrigger>
      </TabsList>

      {/* General Settings Tab */}
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic information about your website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralSettingsChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => handleGeneralSettingsChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="kn">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea
                id="site-description"
                value={generalSettings.siteDescription}
                onChange={(e) => handleGeneralSettingsChange("siteDescription", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => handleGeneralSettingsChange("contactEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={generalSettings.phoneNumber}
                  onChange={(e) => handleGeneralSettingsChange("phoneNumber", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={generalSettings.address}
                onChange={(e) => handleGeneralSettingsChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={generalSettings.currency}
                  onValueChange={(value) => handleGeneralSettingsChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Email Settings Tab */}
      <TabsContent value="email" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email server settings for sending notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  value={emailSettings.smtpHost}
                  onChange={(e) => handleEmailSettingsChange("smtpHost", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  value={emailSettings.smtpPort}
                  onChange={(e) => handleEmailSettingsChange("smtpPort", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input
                  id="smtp-username"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => handleEmailSettingsChange("smtpUsername", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => handleEmailSettingsChange("smtpPassword", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  value={emailSettings.senderName}
                  onChange={(e) => handleEmailSettingsChange("senderName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) => handleEmailSettingsChange("senderEmail", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline">Test Email Configuration</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Notifications Settings Tab */}
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure which notifications are sent to customers and administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-confirmation">Order Confirmation</Label>
                  <p className="text-sm text-muted-foreground">Send email notification when an order is placed</p>
                </div>
                <Switch
                  id="order-confirmation"
                  checked={notificationSettings.orderConfirmation}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("orderConfirmation", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-shipped">Order Shipped</Label>
                  <p className="text-sm text-muted-foreground">Send email notification when an order is shipped</p>
                </div>
                <Switch
                  id="order-shipped"
                  checked={notificationSettings.orderShipped}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("orderShipped", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-delivered">Order Delivered</Label>
                  <p className="text-sm text-muted-foreground">Send email notification when an order is delivered</p>
                </div>
                <Switch
                  id="order-delivered"
                  checked={notificationSettings.orderDelivered}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("orderDelivered", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock-alert">Low Stock Alert</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notification to admin when product stock is low
                  </p>
                </div>
                <Switch
                  id="low-stock-alert"
                  checked={notificationSettings.lowStockAlert}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("lowStockAlert", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-customer-registration">New Customer Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notification to admin when a new customer registers
                  </p>
                </div>
                <Switch
                  id="new-customer-registration"
                  checked={notificationSettings.newCustomerRegistration}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("newCustomerRegistration", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter-signup">Newsletter Signup</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email when someone subscribes to the newsletter
                  </p>
                </div>
                <Switch
                  id="newsletter-signup"
                  checked={notificationSettings.newsletterSignup}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("newsletterSignup", checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Payment Settings Tab */}
      <TabsContent value="payment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment methods and gateway settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-cod">Cash on Delivery</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay with cash on delivery</p>
                </div>
                <Switch
                  id="enable-cod"
                  checked={paymentSettings.enableCashOnDelivery}
                  onCheckedChange={(checked) => handlePaymentSettingsChange("enableCashOnDelivery", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-credit-card">Credit/Debit Card</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay with credit or debit cards</p>
                </div>
                <Switch
                  id="enable-credit-card"
                  checked={paymentSettings.enableCreditCard}
                  onCheckedChange={(checked) => handlePaymentSettingsChange("enableCreditCard", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-upi">UPI Payment</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay with UPI</p>
                </div>
                <Switch
                  id="enable-upi"
                  checked={paymentSettings.enableUPI}
                  onCheckedChange={(checked) => handlePaymentSettingsChange("enableUPI", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable test mode for payment gateways</p>
                </div>
                <Switch
                  id="test-mode"
                  checked={paymentSettings.testMode}
                  onCheckedChange={(checked) => handlePaymentSettingsChange("testMode", checked)}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium">Razorpay Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razorpay-key-id">Key ID</Label>
                  <Input
                    id="razorpay-key-id"
                    value={paymentSettings.razorpayKeyId}
                    onChange={(e) => handlePaymentSettingsChange("razorpayKeyId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpay-key-secret">Key Secret</Label>
                  <Input
                    id="razorpay-key-secret"
                    type="password"
                    value={paymentSettings.razorpayKeySecret}
                    onChange={(e) => handlePaymentSettingsChange("razorpayKeySecret", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
