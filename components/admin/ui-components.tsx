"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Copy, Info } from "lucide-react"

export function UIComponents() {
  const [colorScheme, setColorScheme] = useState({
    primary: "#2E7D32",
    secondary: "#1B5E20",
    accent: "#E8F5E9",
    text: "#333333",
    background: "#FFFFFF",
  })

  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleColorChange = (field: string, value: string) => {
    setColorScheme({
      ...colorScheme,
      [field]: value,
    })
  }

  return (
    <Tabs defaultValue="colors" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="colors">Brand Colors</TabsTrigger>
        <TabsTrigger value="components">UI Components</TabsTrigger>
        <TabsTrigger value="typography">Typography</TabsTrigger>
      </TabsList>

      {/* Colors Tab */}
      <TabsContent value="colors" className="space-y-4">
        <h2 className="text-xl font-bold">Brand Colors</h2>
        <p className="text-muted-foreground">
          Customize your brand colors. These colors will be used throughout the website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Adjust your brand's color palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => copyToClipboard(colorScheme.primary, "primary")}
                  >
                    {copied === "primary" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">{colorScheme.primary}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    id="primary-color"
                    type="color"
                    value={colorScheme.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colorScheme.primary }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => copyToClipboard(colorScheme.secondary, "secondary")}
                  >
                    {copied === "secondary" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">{colorScheme.secondary}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={colorScheme.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colorScheme.secondary }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => copyToClipboard(colorScheme.accent, "accent")}
                  >
                    {copied === "accent" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">{colorScheme.accent}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    id="accent-color"
                    type="color"
                    value={colorScheme.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colorScheme.accent }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">Save Color Scheme</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your colors look in UI components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <Button style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>Primary Button</Button>
                  <Button variant="outline" style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}>
                    Outline Button
                  </Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Badges</p>
                <div className="flex flex-wrap gap-2">
                  <Badge style={{ backgroundColor: colorScheme.primary }}>Primary Badge</Badge>
                  <Badge variant="outline" style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}>
                    Outline Badge
                  </Badge>
                  <Badge variant="secondary" style={{ backgroundColor: colorScheme.secondary, color: "#fff" }}>
                    Secondary Badge
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Alert</p>
                <Alert style={{ backgroundColor: colorScheme.accent, borderColor: colorScheme.primary }}>
                  <AlertCircle className="h-4 w-4" style={{ color: colorScheme.primary }} />
                  <AlertTitle style={{ color: colorScheme.primary }}>Alert Title</AlertTitle>
                  <AlertDescription>This is how alerts will look with your color scheme.</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Components Tab */}
      <TabsContent value="components" className="space-y-4">
        <h2 className="text-xl font-bold">UI Components</h2>
        <p className="text-muted-foreground">Preview and customize UI components used throughout the website.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="example-input">Input</Label>
                <Input id="example-input" placeholder="Enter text here..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example-select">Select</Label>
                <select
                  id="example-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an option</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="example-switch" />
                <Label htmlFor="example-switch">Toggle switch</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="example-checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="example-checkbox">Checkbox</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="example-radio"
                    name="example-radio-group"
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="example-radio">Radio Button</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                  <AccordionContent>
                    This is the content for accordion item 1. You can put any content here.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                  <AccordionContent>
                    This is the content for accordion item 2. You can put any content here.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-sm font-medium">Alerts</p>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>This is an informational alert.</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Typography Tab */}
      <TabsContent value="typography" className="space-y-4">
        <h2 className="text-xl font-bold">Typography</h2>
        <p className="text-muted-foreground">Preview and customize typography styles used throughout the website.</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Typography Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <p className="text-sm text-muted-foreground">Font size: 2.25rem (36px)</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <p className="text-sm text-muted-foreground">Font size: 1.875rem (30px)</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <p className="text-sm text-muted-foreground">Font size: 1.5rem (24px)</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold">Heading 4</h4>
              <p className="text-sm text-muted-foreground">Font size: 1.25rem (20px)</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-lg font-bold">Heading 5</h5>
              <p className="text-sm text-muted-foreground">Font size: 1.125rem (18px)</p>
            </div>
            <div className="space-y-2">
              <h6 className="text-base font-bold">Heading 6</h6>
              <p className="text-sm text-muted-foreground">Font size: 1rem (16px)</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <p className="text-base">
                  This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and{" "}
                  <a href="#" className="text-primary underline">
                    a link
                  </a>
                  . Paragraphs are used for blocks of text.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Font size: 1rem (16px)</p>
              </div>

              <div>
                <p className="text-sm">
                  This is small text, used for captions, footnotes, and other secondary information.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Font size: 0.875rem (14px)</p>
              </div>

              <div>
                <p className="text-xs">This is extra small text, used for very small labels and metadata.</p>
                <p className="text-sm text-muted-foreground mt-1">Font size: 0.75rem (12px)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
