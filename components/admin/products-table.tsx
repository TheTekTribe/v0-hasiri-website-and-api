"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"

// Sample data
const products = [
  {
    id: "PROD-001",
    name: "Bio-Stimulant Plus",
    category: "Bio-Stimulants",
    price: "₹1,200",
    stock: 45,
    status: "In Stock",
  },
  {
    id: "PROD-002",
    name: "Organic Compost",
    category: "Fertilizers",
    price: "₹850",
    stock: 120,
    status: "In Stock",
  },
  {
    id: "PROD-003",
    name: "Soil Revitalizer",
    category: "Soil Amendments",
    price: "₹1,500",
    stock: 30,
    status: "In Stock",
  },
  {
    id: "PROD-004",
    name: "Premium Seeds - Rice",
    category: "Seeds",
    price: "₹650",
    stock: 75,
    status: "In Stock",
  },
  {
    id: "PROD-005",
    name: "Premium Seeds - Wheat",
    category: "Seeds",
    price: "₹550",
    stock: 60,
    status: "In Stock",
  },
  {
    id: "PROD-006",
    name: "Micronutrient Mix",
    category: "Fertilizers",
    price: "₹950",
    stock: 25,
    status: "Low Stock",
  },
  {
    id: "PROD-007",
    name: "Organic Pest Control",
    category: "Pest Control",
    price: "₹750",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PROD-008",
    name: "Soil Testing Kit",
    category: "Tools",
    price: "₹1,800",
    stock: 15,
    status: "In Stock",
  },
  {
    id: "PROD-009",
    name: "Drip Irrigation Kit",
    category: "Tools",
    price: "₹3,500",
    stock: 8,
    status: "Low Stock",
  },
  {
    id: "PROD-010",
    name: "Composting Accelerator",
    category: "Soil Amendments",
    price: "₹450",
    stock: 90,
    status: "In Stock",
  },
]

export function ProductsTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button variant="ghost" size="sm" className="h-9 px-2">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bio-stimulants">Bio-Stimulants</SelectItem>
              <SelectItem value="fertilizers">Fertilizers</SelectItem>
              <SelectItem value="seeds">Seeds</SelectItem>
              <SelectItem value="soil-amendments">Soil Amendments</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="pest-control">Pest Control</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.status === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/admin/products/${product.id}`} className="w-full">
                          Edit Product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Stock</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete Product</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
