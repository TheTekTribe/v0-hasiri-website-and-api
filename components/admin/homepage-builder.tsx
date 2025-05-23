"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GripVertical, Plus, Save, Trash2, Edit, ImageIcon, Layout } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  updateHomepageSection,
  createHomepageSection,
  deleteHomepageSection,
  reorderHomepageSections,
  updateCarouselImage,
  createCarouselImage,
  deleteCarouselImage,
} from "@/app/actions/homepage-actions"
import type { HomepageSection, CarouselImage } from "@/lib/services/homepage-service"

// Define the section types
const sectionTypes = [
  { id: "hero", name: "Hero Section", description: "Main hero section with call-to-action" },
  { id: "features", name: "Features", description: "Highlight key features or benefits" },
  { id: "products", name: "Featured Products", description: "Showcase featured products" },
  { id: "testimonials", name: "Testimonials", description: "Customer testimonials and reviews" },
  { id: "education", name: "Educational Resources", description: "Educational content and resources" },
  { id: "cta", name: "Call to Action", description: "Call-to-action section" },
  { id: "carousel", name: "Image Carousel", description: "Rotating image carousel" },
  { id: "stats", name: "Statistics", description: "Key statistics and numbers" },
  { id: "blog", name: "Latest Blog Posts", description: "Recent blog posts" },
]

// Sortable section component
function SortableSection({ section, onToggle, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">
                  {section.title ||
                    sectionTypes.find((type) => type.id === section.section_type)?.name ||
                    section.section_type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sectionTypes.find((type) => type.id === section.section_type)?.description || "Custom section"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={`toggle-${section.id}`}
                checked={section.is_enabled}
                onCheckedChange={() => onToggle(section.id)}
              />
              <Button variant="ghost" size="sm" onClick={() => onEdit(section)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(section.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function HomepageBuilder({ initialSections = [], initialCarouselImages = [] }) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections)
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(initialCarouselImages)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false)
  const [isEditCarouselOpen, setIsEditCarouselOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<HomepageSection | null>(null)
  const [currentCarouselImage, setCurrentCarouselImage] = useState<CarouselImage | null>(null)
  const [availableSections, setAvailableSections] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index,
        }))

        // Save the new order to the database
        reorderHomepageSections(reorderedItems.map((item) => ({ id: item.id, display_order: item.display_order })))

        return reorderedItems
      })
    }
  }

  // Toggle section visibility
  const toggleSection = async (id: string) => {
    const section = sections.find((s) => s.id === id)
    if (!section) return

    try {
      const result = await updateHomepageSection(id, { is_enabled: !section.is_enabled })

      if (result.success) {
        setSections(sections.map((s) => (s.id === id ? { ...s, is_enabled: !s.is_enabled } : s)))
        toast({
          title: `Section ${section.is_enabled ? "disabled" : "enabled"}`,
          description: `The section has been ${section.is_enabled ? "disabled" : "enabled"} successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update section",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Delete section
  const handleDeleteSection = async (id: string) => {
    try {
      const result = await deleteHomepageSection(id)

      if (result.success) {
        setSections(sections.filter((section) => section.id !== id))
        toast({
          title: "Section deleted",
          description: "The section has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete section",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Open add section dialog
  const openAddSection = () => {
    // Filter out section types that are already added
    const existingSectionTypes = sections.map((section) => section.section_type)
    const available = sectionTypes.filter((type) => !existingSectionTypes.includes(type.id))
    setAvailableSections(available)
    setIsAddSectionOpen(true)
  }

  // Add new section
  const addSection = async (sectionTypeId: string) => {
    const sectionType = sectionTypes.find((type) => type.id === sectionTypeId)
    if (sectionType) {
      try {
        const newSection = {
          section_type: sectionType.id,
          title: sectionType.name,
          subtitle: null,
          content: {},
          is_enabled: true,
          display_order: sections.length,
        }

        const result = await createHomepageSection(newSection)

        if (result.success && result.data) {
          setSections([...sections, result.data])
          toast({
            title: "Section added",
            description: "The new section has been added successfully.",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add section",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
    setIsAddSectionOpen(false)
  }

  // Edit section
  const editSection = (section) => {
    setCurrentSection(section)
    setIsEditSectionOpen(true)
  }

  // Save section edits
  const saveSection = async () => {
    if (currentSection) {
      try {
        setIsSaving(true)
        const result = await updateHomepageSection(currentSection.id, {
          title: currentSection.title,
          subtitle: currentSection.subtitle,
          content: currentSection.content,
          is_enabled: currentSection.is_enabled,
        })

        if (result.success && result.data) {
          setSections(sections.map((section) => (section.id === currentSection.id ? result.data : section)))
          toast({
            title: "Section updated",
            description: "The section has been updated successfully.",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update section",
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
    setIsEditSectionOpen(false)
    setCurrentSection(null)
  }

  // Edit carousel image
  const editCarouselImage = (image) => {
    setCurrentCarouselImage(image)
    setIsEditCarouselOpen(true)
  }

  // Save carousel image edits
  const saveCarouselImage = async () => {
    if (currentCarouselImage) {
      try {
        setIsSaving(true)
        const result = await updateCarouselImage(currentCarouselImage.id, {
          image_url: currentCarouselImage.image_url,
          title: currentCarouselImage.title,
          subtitle: currentCarouselImage.subtitle,
          cta_text: currentCarouselImage.cta_text,
          cta_link: currentCarouselImage.cta_link,
          is_enabled: currentCarouselImage.is_enabled,
        })

        if (result.success && result.data) {
          setCarouselImages(carouselImages.map((image) => (image.id === currentCarouselImage.id ? result.data : image)))
          toast({
            title: "Image updated",
            description: "The carousel image has been updated successfully.",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update carousel image",
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
    setIsEditCarouselOpen(false)
    setCurrentCarouselImage(null)
  }

  // Add new carousel image
  const addCarouselImage = async () => {
    try {
      const newImage = {
        image_url: "/placeholder.svg?height=600&width=1200&text=New+Image",
        title: "New Carousel Image",
        subtitle: "Add your content here",
        cta_text: "Learn More",
        cta_link: "/",
        display_order: carouselImages.length,
        is_enabled: true,
      }

      const result = await createCarouselImage(newImage)

      if (result.success && result.data) {
        setCarouselImages([...carouselImages, result.data])
        editCarouselImage(result.data)
        toast({
          title: "Image added",
          description: "The new carousel image has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add carousel image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Delete carousel image
  const handleDeleteCarouselImage = async (id: string) => {
    try {
      const result = await deleteCarouselImage(id)

      if (result.success) {
        setCarouselImages(carouselImages.filter((image) => image.id !== id))
        toast({
          title: "Image deleted",
          description: "The carousel image has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete carousel image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="sections" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sections" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Page Sections
        </TabsTrigger>
        <TabsTrigger value="carousel" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Carousel Images
        </TabsTrigger>
      </TabsList>

      {/* Sections Tab */}
      <TabsContent value="sections" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Homepage Sections</h2>
          <Button onClick={openAddSection} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Arrange and Configure Sections</CardTitle>
            <CardDescription>
              Drag and drop to reorder sections. Toggle switches to enable or disable sections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sections.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {sections
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onToggle={toggleSection}
                        onEdit={editSection}
                        onDelete={handleDeleteSection}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No sections found. Click "Add Section" to create your homepage layout.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Section Dialog */}
        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Section</DialogTitle>
              <DialogDescription>Select a section type to add to your homepage.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {availableSections.length > 0 ? (
                availableSections.map((section) => (
                  <Card
                    key={section.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => addSection(section.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{section.name}</p>
                          <p className="text-xs text-muted-foreground">{section.description}</p>
                        </div>
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">All available sections have been added.</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Section Dialog */}
        <Dialog open={isEditSectionOpen} onOpenChange={setIsEditSectionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
              <DialogDescription>Customize the section settings.</DialogDescription>
            </DialogHeader>
            {currentSection && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Section Title</Label>
                  <Input
                    id="section-name"
                    value={currentSection.title || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section-subtitle">Section Subtitle</Label>
                  <Input
                    id="section-subtitle"
                    value={currentSection.subtitle || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, subtitle: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="section-enabled"
                    checked={currentSection.is_enabled}
                    onCheckedChange={(checked) => setCurrentSection({ ...currentSection, is_enabled: checked })}
                  />
                  <Label htmlFor="section-enabled">
                    {currentSection.is_enabled ? "Section Enabled" : "Section Disabled"}
                  </Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSectionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveSection} className="bg-[#2E7D32] hover:bg-[#1B5E20]" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* Carousel Tab */}
      <TabsContent value="carousel" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Carousel Images</h2>
          <Button onClick={addCarouselImage} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Carousel Images</CardTitle>
            <CardDescription>Edit or remove carousel images and their content.</CardDescription>
          </CardHeader>
          <CardContent>
            {carouselImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carouselImages
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.title || "Carousel image"}
                          className="h-full w-full object-cover"
                        />
                        {!image.is_enabled && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium">Disabled</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium truncate">{image.title || "Untitled Image"}</p>
                        <p className="text-sm text-muted-foreground truncate">{image.subtitle || "No subtitle"}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                        <Button variant="outline" size="sm" onClick={() => editCarouselImage(image)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCarouselImage(image.id)}>
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No carousel images found. Click "Add Image" to create carousel content.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Carousel Image Dialog */}
        <Dialog open={isEditCarouselOpen} onOpenChange={setIsEditCarouselOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Carousel Image</DialogTitle>
              <DialogDescription>Customize the carousel image and content.</DialogDescription>
            </DialogHeader>
            {currentCarouselImage && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      value={currentCarouselImage.image_url}
                      onChange={(e) => setCurrentCarouselImage({ ...currentCarouselImage, image_url: e.target.value })}
                    />
                    <Button variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={currentCarouselImage.title || ""}
                    onChange={(e) => setCurrentCarouselImage({ ...currentCarouselImage, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    value={currentCarouselImage.subtitle || ""}
                    onChange={(e) => setCurrentCarouselImage({ ...currentCarouselImage, subtitle: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-text">CTA Button Text</Label>
                    <Input
                      id="cta-text"
                      value={currentCarouselImage.cta_text || ""}
                      onChange={(e) => setCurrentCarouselImage({ ...currentCarouselImage, cta_text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-link">CTA Button Link</Label>
                    <Input
                      id="cta-link"
                      value={currentCarouselImage.cta_link || ""}
                      onChange={(e) => setCurrentCarouselImage({ ...currentCarouselImage, cta_link: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="image-enabled"
                    checked={currentCarouselImage.is_enabled}
                    onCheckedChange={(checked) =>
                      setCurrentCarouselImage({ ...currentCarouselImage, is_enabled: checked })
                    }
                  />
                  <Label htmlFor="image-enabled">
                    {currentCarouselImage.is_enabled ? "Image Enabled" : "Image Disabled"}
                  </Label>
                </div>
                <div className="pt-2">
                  <div className="bg-muted rounded-md p-4">
                    <h4 className="text-sm font-medium mb-2">Preview</h4>
                    <div className="relative h-32 w-full overflow-hidden rounded-md">
                      <img
                        src={currentCarouselImage.image_url || "/placeholder.svg"}
                        alt={currentCarouselImage.title || "Carousel image"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                        <div className="max-w-md bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                          <p className="text-white text-sm font-bold">{currentCarouselImage.title || "Untitled"}</p>
                          <p className="text-white text-xs">{currentCarouselImage.subtitle || "No subtitle"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCarouselOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveCarouselImage} className="bg-[#2E7D32] hover:bg-[#1B5E20]" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}
