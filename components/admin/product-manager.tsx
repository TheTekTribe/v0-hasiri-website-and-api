"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Save, ImageIcon } from "lucide-react"
import { formatPrice } from "@/lib/utils"

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Bio-Stimulant Plus",
    description:
      "Enhances soil microbial activity and improves nutrient uptake for healthier plants and higher yields.",
    price: 1200,
    originalPrice: 1500,
    image: "/placeholder.svg?height=300&width=300&text=Bio-Stimulant",
    category: "Bio-Stimulants",
    inventory: "in-stock",
    stock: 45,
    isNew: true,
    isFeatured: false,
    discount: 20,
  },
  {
    id: 2,
    name: "Organic Compost",
    description: "Rich in nutrients and beneficial microorganisms for soil health and sustainable plant growth.",
    price: 850,
    originalPrice: 850,
    image: "/placeholder.svg?height=300&width=300&text=Organic+Compost",
    category: "Fertilizers",
    inventory: "in-stock",
    stock: 120,
    isNew: false,
    isFeatured: true,
    discount: 0,
  },
  {
    id: 3,
    name: "Soil Revitalizer",
    description: "Restores depleted soil and improves structure and fertility for optimal growing conditions.",
    price: 1500,
    originalPrice: 1500,
    image: "/placeholder.svg?height=300&width=300&text=Soil+Revitalizer",
    category: "Soil Amendments",
    inventory: "low-stock",
    stock: 30,
    isNew: false,
    isFeatured: false,
    discount: 0,
  },
  {
    id: 4,
    name: "Premium Seeds",
    description: "High-quality, resilient seeds for various crops and conditions, selected for optimal performance.",
    price: 650,
    originalPrice: 800,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Seeds",
    category: "Seeds",
    inventory: "out-of-stock",
    stock: 0,
    isNew: false,
    isFeatured: false,
    discount: 15,
  },
]

// Product categories
const productCategories = ["Bio-Stimulants", "Fertilizers", "Soil Amendments", "Seeds", "Tools", "Pest Control"]

export function ProductManager() {
  const [products, setProducts] = useState(mockProducts)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [inventoryFilter, setInventoryFilter] = useState("all")

  // Function to handle editing a product
  const handleEditProduct = (product: any) => {
    setCurrentProduct(product)
    setIsEditing(true)
  }

  // Function to handle creating a new product
  const handleNewProduct = () => {
    setCurrentProduct({
      id: Date.now(),
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder.svg?height=300&width=300&text=New+Product",
      category: "",
      inventory: "in-stock",
      stock: 0,
      isNew: false,
      isFeatured: false,
      discount: 0,
    })
    setIsEditing(true)
  }

  // Function to save a product
  const saveProduct = () => {
    if (currentProduct) {
      const productIndex = products.findIndex((product) => product.id === currentProduct.id)
      if (productIndex >= 0) {
        // Update existing product
        const updatedProducts = [...products]
        updatedProducts[productIndex] = currentProduct
        setProducts(updatedProducts)
      } else {
        // Add new product
        setProducts([...products, currentProduct])
      }
      setIsEditing(false)
      setCurrentProduct(null)
    }
  }

  // Function to delete a product
  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesInventory = inventoryFilter === "all" || product.inventory === inventoryFilter

    return matchesSearch && matchesCategory && matchesInventory
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Product Management</h2>
        <Button onClick={handleNewProduct} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.inventory === "in-stock"
                          ? "bg-green-100 text-green-800"
                          : product.inventory === "low-stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inventory === "in-stock"
                        ? "In Stock"
                        : product.inventory === "low-stock"
                          ? "Low Stock"
                          : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger id="product-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price (₹)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                    placeholder="Product price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-original-price">Original Price (₹)</Label>
                  <Input
                    id="product-original-price"
                    type="number"
                    value={currentProduct.originalPrice}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: Number(e.target.value) })}
                    placeholder="Original price (if discounted)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock Quantity</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={(e) => {
                      const stock = Number(e.target.value)
                      let inventory = currentProduct.inventory
                      if (stock <= 0) inventory = "out-of-stock"
                      else if (stock <= 30) inventory = "low-stock"
                      else inventory = "in-stock"

                      setCurrentProduct({
                        ...currentProduct,
                        stock,
                        inventory,
                      })
                    }}
                    placeholder="Stock quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-discount">Discount (%)</Label>
                  <Input
                    id="product-discount"
                    type="number"
                    value={currentProduct.discount}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, discount: Number(e.target.value) })}
                    placeholder="Discount percentage"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  placeholder="Product description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="product-is-new"
                    checked={currentProduct.isNew}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isNew: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="product-is-new">Mark as New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="product-is-featured"
                    checked={currentProduct.isFeatured}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="product-is-featured">Featured Product</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 border-2 border-dashed rounded-md flex items-center justify-center bg-muted overflow-hidden">
                    {currentProduct.image ? (
                      <img
                        src={currentProduct.image || "/placeholder.svg"}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="outline">Upload Image</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveProduct} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
