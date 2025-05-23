"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { HasiriLogo } from "@/components/hasiri-logo"
import { HasiriIcon } from "@/components/hasiri-icon"
import { Upload, Check, RefreshCw, Trash2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function BrandingManager() {
  const { toast } = useToast()
  const logoFileInputRef = useRef<HTMLInputElement>(null)
  const iconFileInputRef = useRef<HTMLInputElement>(null)

  const [logoSettings, setLogoSettings] = useState({
    primaryColor: "#4CAF50",
    secondaryColor: "#2E7D32",
    textColor: "#FFFFFF",
    showLeafAccent: true,
    size: "medium",
  })

  const [iconSettings, setIconSettings] = useState({
    backgroundColor: "#4CAF50",
    iconColor: "#FFFFFF",
    showLeafAccent: true,
    borderRadius: "full",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoSettingChange = (key: string, value: string | boolean) => {
    setLogoSettings({
      ...logoSettings,
      [key]: value,
    })
  }

  const handleIconSettingChange = (key: string, value: string | boolean) => {
    setIconSettings({
      ...iconSettings,
      [key]: value,
    })
  }

  const handleSaveLogo = () => {
    // Here you would implement the actual save functionality
    // For now, we'll just show a success toast
    toast({
      title: "Logo settings saved",
      description: "Your logo settings have been updated successfully.",
    })
  }

  const handleSaveIcon = () => {
    // Here you would implement the actual save functionality
    // For now, we'll just show a success toast
    toast({
      title: "Icon settings saved",
      description: "Your icon settings have been updated successfully.",
    })
  }

  const handleResetLogo = () => {
    setLogoPreview(null)
    setLogoSettings({
      primaryColor: "#4CAF50",
      secondaryColor: "#2E7D32",
      textColor: "#FFFFFF",
      showLeafAccent: true,
      size: "medium",
    })
  }

  const handleResetIcon = () => {
    setIconPreview(null)
    setIconSettings({
      backgroundColor: "#4CAF50",
      iconColor: "#FFFFFF",
      showLeafAccent: true,
      borderRadius: "full",
    })
  }

  return (
    <Tabs defaultValue="logo" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="logo">Main Logo</TabsTrigger>
        <TabsTrigger value="icon">Icon & Favicon</TabsTrigger>
      </TabsList>

      {/* Logo Tab */}
      <TabsContent value="logo" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>Customize your main logo appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Upload Custom Logo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    ref={logoFileInputRef}
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => logoFileInputRef.current?.click()} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  {logoPreview && (
                    <Button variant="destructive" size="icon" onClick={() => setLogoPreview(null)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {logoPreview && (
                  <div className="mt-2 border rounded-md p-2">
                    <p className="text-xs text-muted-foreground mb-1">Custom logo preview:</p>
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="primary-color"
                    type="color"
                    value={logoSettings.primaryColor}
                    onChange={(e) => handleLogoSettingChange("primaryColor", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={logoSettings.primaryColor}
                    onChange={(e) => handleLogoSettingChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={logoSettings.secondaryColor}
                    onChange={(e) => handleLogoSettingChange("secondaryColor", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={logoSettings.secondaryColor}
                    onChange={(e) => handleLogoSettingChange("secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="text-color"
                    type="color"
                    value={logoSettings.textColor}
                    onChange={(e) => handleLogoSettingChange("textColor", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={logoSettings.textColor}
                    onChange={(e) => handleLogoSettingChange("textColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-leaf-accent">Show Leaf Accent</Label>
                <Switch
                  id="show-leaf-accent"
                  checked={logoSettings.showLeafAccent}
                  onCheckedChange={(checked) => handleLogoSettingChange("showLeafAccent", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-size">Logo Size</Label>
                <select
                  id="logo-size"
                  value={logoSettings.size}
                  onChange={(e) => handleLogoSettingChange("size", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetLogo}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSaveLogo} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo Preview</CardTitle>
              <CardDescription>See how your logo will appear on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {logoPreview ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Custom Logo</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-white">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Custom Logo"
                        className="max-h-20 max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Default Logo</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-white">
                      <div
                        style={
                          {
                            "--primary-color": logoSettings.primaryColor,
                            "--secondary-color": logoSettings.secondaryColor,
                            "--text-color": logoSettings.textColor,
                          } as React.CSSProperties
                        }
                      >
                        <HasiriLogo
                          className={cn(
                            logoSettings.size === "small" && "h-8",
                            logoSettings.size === "medium" && "h-12",
                            logoSettings.size === "large" && "h-16",
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Light Background</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-gray-100">
                      <div
                        style={
                          {
                            "--primary-color": logoSettings.primaryColor,
                            "--secondary-color": logoSettings.secondaryColor,
                            "--text-color": logoSettings.textColor,
                          } as React.CSSProperties
                        }
                      >
                        <HasiriLogo
                          className={cn(
                            logoSettings.size === "small" && "h-8",
                            logoSettings.size === "medium" && "h-12",
                            logoSettings.size === "large" && "h-16",
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Dark Background</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-gray-800">
                      <div
                        style={
                          {
                            "--primary-color": logoSettings.primaryColor,
                            "--secondary-color": logoSettings.secondaryColor,
                            "--text-color": logoSettings.textColor,
                          } as React.CSSProperties
                        }
                      >
                        <HasiriLogo
                          className={cn(
                            logoSettings.size === "small" && "h-8",
                            logoSettings.size === "medium" && "h-12",
                            logoSettings.size === "large" && "h-16",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => window.open("/", "_blank")}>
                  <Eye className="h-4 w-4 mr-2" />
                  View on Live Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Icon Tab */}
      <TabsContent value="icon" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Icon Settings</CardTitle>
              <CardDescription>Customize your site icon and favicon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon-upload">Upload Custom Icon</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="icon-upload"
                    type="file"
                    accept="image/*"
                    ref={iconFileInputRef}
                    onChange={handleIconFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => iconFileInputRef.current?.click()} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  {iconPreview && (
                    <Button variant="destructive" size="icon" onClick={() => setIconPreview(null)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {iconPreview && (
                  <div className="mt-2 border rounded-md p-2">
                    <p className="text-xs text-muted-foreground mb-1">Custom icon preview:</p>
                    <div className="flex justify-center">
                      <img
                        src={iconPreview || "/placeholder.svg"}
                        alt="Icon Preview"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="background-color"
                    type="color"
                    value={iconSettings.backgroundColor}
                    onChange={(e) => handleIconSettingChange("backgroundColor", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={iconSettings.backgroundColor}
                    onChange={(e) => handleIconSettingChange("backgroundColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon-color">Icon Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="icon-color"
                    type="color"
                    value={iconSettings.iconColor}
                    onChange={(e) => handleIconSettingChange("iconColor", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={iconSettings.iconColor}
                    onChange={(e) => handleIconSettingChange("iconColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-icon-leaf">Show Leaf Accent</Label>
                <Switch
                  id="show-icon-leaf"
                  checked={iconSettings.showLeafAccent}
                  onCheckedChange={(checked) => handleIconSettingChange("showLeafAccent", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <select
                  id="border-radius"
                  value={iconSettings.borderRadius}
                  onChange={(e) => handleIconSettingChange("borderRadius", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="none">None</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="full">Full (Circle)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetIcon}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSaveIcon} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Icon Preview</CardTitle>
              <CardDescription>See how your icon will appear in different contexts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {iconPreview ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Custom Icon</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-white">
                      <img
                        src={iconPreview || "/placeholder.svg"}
                        alt="Custom Icon"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Default Icon</p>
                    <div className="border rounded-md p-4 flex justify-center items-center bg-white">
                      <div
                        style={
                          {
                            "--icon-bg": iconSettings.backgroundColor,
                            "--icon-color": iconSettings.iconColor,
                          } as React.CSSProperties
                        }
                      >
                        <HasiriIcon
                          className="h-12 w-12"
                          showLeafAccent={iconSettings.showLeafAccent}
                          borderRadius={iconSettings.borderRadius as any}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Browser Tab</p>
                    <div className="border rounded-md p-2 bg-gray-100">
                      <div className="flex items-center gap-2 bg-white rounded border p-1 max-w-xs">
                        <div
                          style={
                            {
                              "--icon-bg": iconSettings.backgroundColor,
                              "--icon-color": iconSettings.iconColor,
                            } as React.CSSProperties
                          }
                        >
                          <HasiriIcon
                            className="h-4 w-4"
                            showLeafAccent={iconSettings.showLeafAccent}
                            borderRadius={iconSettings.borderRadius as any}
                          />
                        </div>
                        <span className="text-xs truncate">Hasiri - Regenerative Agriculture</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Mobile Home Screen</p>
                    <div className="border rounded-md p-4 bg-gray-800">
                      <div className="flex flex-col items-center">
                        <div
                          style={
                            {
                              "--icon-bg": iconSettings.backgroundColor,
                              "--icon-color": iconSettings.iconColor,
                            } as React.CSSProperties
                          }
                        >
                          <HasiriIcon
                            className="h-16 w-16"
                            showLeafAccent={iconSettings.showLeafAccent}
                            borderRadius={iconSettings.borderRadius as any}
                          />
                        </div>
                        <span className="text-xs text-white mt-1">Hasiri</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => window.open("/", "_blank")}>
                  <Eye className="h-4 w-4 mr-2" />
                  View on Live Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
