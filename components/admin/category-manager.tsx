"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import type { Category } from "@/lib/services/category-service"

export function CategoryManager() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
    slug: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name if slug field is empty
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Clear errors
    if (name === "name" || name === "slug") {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const errors = {
      name: "",
      slug: "",
    }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = "Name is required"
      isValid = false
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required"
      isValid = false
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      errors.slug = "Slug must contain only lowercase letters, numbers, and hyphens"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleCreateCategory = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Check if slug is unique
      const { data: existingCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", formData.slug)
        .single()

      if (existingCategory) {
        setFormErrors((prev) => ({
          ...prev,
          slug: "A category with this slug already exists",
        }))
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("categories").insert([formData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Category created successfully",
      })
      setIsCreateDialogOpen(false)
      resetForm()
      fetchCategories()
      router.refresh()
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async () => {
    if (!validateForm() || !currentCategory) return

    setIsSubmitting(true)
    try {
      // Check if slug is unique (excluding current category)
      if (formData.slug !== currentCategory.slug) {
        const { data: existingCategory } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", formData.slug)
          .single()

        if (existingCategory) {
          setFormErrors((prev) => ({
            ...prev,
            slug: "A category with this slug already exists",
          }))
          setIsSubmitting(false)
          return
        }
      }

      const { error } = await supabase.from("categories").update(formData).eq("id", currentCategory.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category updated successfully",
      })
      setIsEditDialogOpen(false)
      resetForm()
      fetchCategories()
      router.refresh()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!currentCategory) return

    setIsSubmitting(true)
    try {
      // Check if category has products
      const { count, error: countError } = await supabase
        .from("products")
        .select("id", { count: "exact" })
        .eq("category_id", currentCategory.id)

      if (countError) throw countError

      if (count && count > 0) {
        toast({
          title: "Error",
          description: "Cannot delete category with associated products",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("categories").delete().eq("id", currentCategory.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      fetchCategories()
      router.refresh()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
    })
    setFormErrors({
      name: "",
      slug: "",
    })
    setCurrentCategory(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">Product Categories</h2>
          <p className="text-sm text-muted-foreground">Manage the categories for your products</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-2 text-lg font-medium">No categories found</p>
              <p className="text-sm text-muted-foreground">Create your first category to get started</p>
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {category.image_url ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                          <img
                            src={category.image_url || "/placeholder.svg"}
                            alt={category.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-icon.png"
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      {category.description
                        ? category.description.length > 50
                          ? `${category.description.substring(0, 50)}...`
                          : category.description
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>Add a new product category to your store</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Soil Amendments"
              />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g. soil-amendments"
              />
              {formErrors.slug && <p className="text-sm text-destructive">{formErrors.slug}</p>}
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description for this category"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <div className="space-y-2">
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">Enter a URL for the category image</p>

                {formData.image_url && (
                  <div className="mt-2">
                    <p className="mb-1 text-sm font-medium">Preview:</p>
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Category preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-icon.png"
                          toast({
                            title: "Image Error",
                            description: "The image URL could not be loaded.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the details for this category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input id="edit-slug" name="slug" value={formData.slug} onChange={handleInputChange} />
              {formErrors.slug && <p className="text-sm text-destructive">{formErrors.slug}</p>}
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL</Label>
              <div className="space-y-2">
                <Input id="edit-image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
                <p className="text-xs text-muted-foreground">Enter a URL for the category image</p>

                {formData.image_url && (
                  <div className="mt-2">
                    <p className="mb-1 text-sm font-medium">Preview:</p>
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Category preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-icon.png"
                          toast({
                            title: "Image Error",
                            description: "The image URL could not be loaded.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;
              {currentCategory?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteCategory()
              }}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
