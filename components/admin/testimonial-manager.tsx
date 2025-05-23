"use client"

import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Plus, Save, Trash2, Edit, Eye, ImageIcon, Video, Play, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/app/actions/testimonial-actions"

// Types
interface Testimonial {
  id: string
  image_url: string
  quote: string
  author: string
  video_id: string
  profile_image: string
  page: "login" | "signup" | "both"
  is_active: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

// Sortable Item Component
function SortableTestimonial({ testimonial, onEdit, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: testimonial.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={testimonial.profile_image || "/placeholder.svg"}
                alt={testimonial.author}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground truncate">{testimonial.quote.substring(0, 60)}...</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={testimonial.is_active} onCheckedChange={() => onToggle(testimonial.id)} />
              <Button variant="ghost" size="icon" onClick={() => onEdit(testimonial)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(testimonial.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("signup")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Fetch testimonials on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials?include_inactive=true")
        const data = await response.json()

        if (data.success) {
          setTestimonials(data.data)
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch testimonials",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [toast])

  // Filter testimonials by page
  const filteredTestimonials = testimonials.filter((t) => t.page === currentTab || t.page === "both")

  // Handle drag end event
  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      // Update local state first for immediate feedback
      setTestimonials((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })

      // Update display order values
      const updatedTestimonials = testimonials.map((item, index) => ({
        id: item.id,
        display_order: index,
      }))

      // Call server action to update order
      const result = await reorderTestimonials(updatedTestimonials)

      if (result.success) {
        toast({
          title: "Order updated",
          description: "The testimonial order has been updated.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update order",
          variant: "destructive",
        })
      }
    }
  }

  // Toggle testimonial active state
  const toggleTestimonial = async (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id)
    if (!testimonial) return

    // Update local state first for immediate feedback
    setTestimonials((prev) => prev.map((item) => (item.id === id ? { ...item, is_active: !item.is_active } : item)))

    // Call server action to update
    const result = await updateTestimonial(id, { is_active: !testimonial.is_active })

    if (result.success) {
      toast({
        title: "Status updated",
        description: "The testimonial status has been updated.",
      })
    } else {
      // Revert local state if server update fails
      setTestimonials((prev) => prev.map((item) => (item.id === id ? testimonial : item)))

      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  // Delete testimonial
  const handleDeleteTestimonial = async (id: string) => {
    // Store the testimonial for potential restoration
    const testimonialToDelete = testimonials.find((t) => t.id === id)

    // Update local state first for immediate feedback
    setTestimonials((prev) => prev.filter((item) => item.id !== id))

    // Call server action to delete
    const result = await deleteTestimonial(id)

    if (result.success) {
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been deleted.",
      })
    } else {
      // Restore the testimonial if server delete fails
      if (testimonialToDelete) {
        setTestimonials((prev) => [...prev, testimonialToDelete])
      }

      toast({
        title: "Error",
        description: result.error || "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  // Edit testimonial
  const editTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial)
    setIsDialogOpen(true)
  }

  // Add new testimonial
  const addTestimonial = () => {
    const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.display_order)) + 1 : 0

    const newTestimonial: Testimonial = {
      id: `new-${Date.now()}`,
      image_url: "/placeholder.svg",
      quote: "",
      author: "",
      video_id: "",
      profile_image: "/placeholder.svg",
      page: currentTab,
      is_active: true,
      display_order: maxOrder,
    }

    setCurrentTestimonial(newTestimonial)
    setIsDialogOpen(true)
  }

  // Save testimonial
  const saveTestimonial = async () => {
    if (!currentTestimonial) return

    setIsSaving(true)

    try {
      let result

      // Check if this is a new testimonial (id starts with "new-")
      if (currentTestimonial.id.startsWith("new-")) {
        // Create new testimonial
        const { id, created_at, updated_at, ...testimonialData } = currentTestimonial
        result = await createTestimonial(testimonialData)
      } else {
        // Update existing testimonial
        const { created_at, updated_at, ...testimonialData } = currentTestimonial
        result = await updateTestimonial(currentTestimonial.id, testimonialData)
      }

      if (result.success) {
        // Update local state
        if (currentTestimonial.id.startsWith("new-")) {
          setTestimonials((prev) => [...prev, result.data])
        } else {
          setTestimonials((prev) => prev.map((item) => (item.id === currentTestimonial.id ? result.data : item)))
        }

        toast({
          title: "Testimonial saved",
          description: "The testimonial has been saved successfully.",
        })

        setIsDialogOpen(false)
        setCurrentTestimonial(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Preview testimonial
  const previewTestimonial = () => {
    setIsPreviewOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-lg text-muted-foreground">Loading testimonials...</span>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="signup" onValueChange={(value) => setCurrentTab(value as "login" | "signup")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="signup">Signup Page</TabsTrigger>
            <TabsTrigger value="login">Login Page</TabsTrigger>
          </TabsList>

          <Button onClick={addTestimonial} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        <TabsContent value="signup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signup Page Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredTestimonials.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {filteredTestimonials.length > 0 ? (
                    filteredTestimonials.map((testimonial) => (
                      <SortableTestimonial
                        key={testimonial.id}
                        testimonial={testimonial}
                        onEdit={editTestimonial}
                        onToggle={toggleTestimonial}
                        onDelete={handleDeleteTestimonial}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No testimonials found. Click "Add Testimonial" to create one.
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Drag and drop to reorder testimonials. Toggle switch to enable/disable.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Page Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredTestimonials.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {filteredTestimonials.length > 0 ? (
                    filteredTestimonials.map((testimonial) => (
                      <SortableTestimonial
                        key={testimonial.id}
                        testimonial={testimonial}
                        onEdit={editTestimonial}
                        onToggle={toggleTestimonial}
                        onDelete={handleDeleteTestimonial}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No testimonials found. Click "Add Testimonial" to create one.
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Drag and drop to reorder testimonials. Toggle switch to enable/disable.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentTestimonial && !currentTestimonial.id.startsWith("new-") ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>

          {currentTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page">Display On</Label>
                  <Select
                    value={currentTestimonial.page}
                    onValueChange={(value) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        page: value as "login" | "signup" | "both",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signup">Signup Page</SelectItem>
                      <SelectItem value="login">Login Page</SelectItem>
                      <SelectItem value="both">Both Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={currentTestimonial.is_active}
                      onCheckedChange={(checked) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          is_active: checked,
                        })
                      }
                    />
                    <Label htmlFor="status">{currentTestimonial.is_active ? "Active" : "Inactive"}</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={currentTestimonial.author}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      author: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Testimonial Quote</Label>
                <Textarea
                  id="quote"
                  rows={3}
                  value={currentTestimonial.quote}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      quote: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background-image">Background Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background-image"
                      value={currentTestimonial.image_url}
                      onChange={(e) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          image_url: e.target.value,
                        })
                      }
                    />
                    <Button variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-image">Profile Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profile-image"
                      value={currentTestimonial.profile_image}
                      onChange={(e) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          profile_image: e.target.value,
                        })
                      }
                    />
                    <Button variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-id">YouTube Video ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="video-id"
                    value={currentTestimonial.video_id}
                    onChange={(e) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        video_id: e.target.value,
                      })
                    }
                    placeholder="e.g. dQw4w9WgXcQ"
                  />
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the YouTube video ID (e.g., dQw4w9WgXcQ from https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                </p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="mr-2" onClick={previewTestimonial}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTestimonial} className="bg-[#2E7D32] hover:bg-[#1B5E20]" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Testimonial Preview</DialogTitle>
          </DialogHeader>

          {currentTestimonial && (
            <div className="relative rounded-lg overflow-hidden bg-zinc-900 h-[400px]">
              <div className="absolute inset-0">
                <img
                  src={currentTestimonial.image_url || "/placeholder.svg"}
                  alt="Background"
                  className="object-cover w-full h-full opacity-50"
                />
              </div>
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mt-auto">
                  <div className="bg-black/30 p-6 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={currentTestimonial.profile_image || "/placeholder.svg"}
                          alt={currentTestimonial.author}
                          className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg text-white">{currentTestimonial.quote}</p>
                        <footer className="mt-2 text-sm text-white/80">{currentTestimonial.author}</footer>
                      </div>
                    </div>

                    <div className="relative aspect-video w-[70%] mx-auto bg-black/40 rounded-md overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${currentTestimonial.video_id}/maxresdefault.jpg`}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-70"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            `https://img.youtube.com/vi/${currentTestimonial.video_id}/hqdefault.jpg`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
