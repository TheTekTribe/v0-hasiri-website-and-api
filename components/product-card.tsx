"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star, StarHalf, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"

export interface ProductProps {
  id: number
  name: string
  description: string
  price: string
  priceValue: number
  originalPrice?: string
  image: string
  rating: number
  reviewCount: number
  inventory: "in-stock" | "low-stock" | "out-of-stock"
  isNew?: boolean
  isFeatured?: boolean
  discount?: number
  category: string
}

export function ProductCard({
  id,
  name,
  description,
  price,
  priceValue,
  originalPrice,
  image,
  rating,
  reviewCount,
  inventory,
  isNew = false,
  isFeatured = false,
  discount,
  category,
}: ProductProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const inventoryLabel = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  }

  const inventoryColor = {
    "in-stock": "bg-green-100 text-green-800 border-green-200",
    "low-stock": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "out-of-stock": "bg-red-100 text-red-800 border-red-200",
  }

  const handleAddToCart = () => {
    if (inventory === "out-of-stock") return

    console.log("Adding to cart:", { id, name, price, priceValue, image, category })

    setIsAdding(true)
    addItem({
      id,
      name,
      price,
      priceValue,
      image,
      category,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg">
        <div className="relative h-64 overflow-hidden">
          <Link href={`/products/${id}`}>
            <div className="absolute inset-0 bg-black/5 z-10 transition-opacity group-hover:opacity-100 opacity-0" />
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className={cn("object-cover transition-transform duration-500", isHovered ? "scale-110" : "scale-100")}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
            {isFeatured && <Badge className="bg-purple-500 hover:bg-purple-600">Featured</Badge>}
            {discount && <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>

          {/* Category */}
          <div className="absolute bottom-2 left-2 z-20">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(rating)) {
                  return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                } else if (i < Math.ceil(rating) && !Number.isInteger(rating)) {
                  return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                } else {
                  return <Star key={i} className="h-4 w-4 text-gray-300" />
                }
              })}
              <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
            </div>
            <Badge variant="outline" className={cn("text-xs font-medium", inventoryColor[inventory])}>
              {inventoryLabel[inventory]}
            </Badge>
          </div>

          <Link href={`/products/${id}`}>
            <h3 className="font-medium text-lg line-clamp-1 group-hover:text-[#2E7D32] transition-colors">{name}</h3>
          </Link>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg">{price}</span>
              {originalPrice && <span className="text-sm text-gray-500 line-through">{originalPrice}</span>}
            </div>
            <Button
              size="sm"
              className={cn(
                "rounded-full transition-all duration-300",
                isAdding ? "bg-green-600 hover:bg-green-700" : "bg-[#2E7D32] hover:bg-[#1B5E20]",
                inventory === "out-of-stock" && "opacity-50 cursor-not-allowed",
              )}
              onClick={handleAddToCart}
              disabled={inventory === "out-of-stock"}
            >
              {isAdding ? <Check className="h-4 w-4 mr-1" /> : <ShoppingCart className="h-4 w-4 mr-1" />}
              {isAdding ? "Added" : inventory === "out-of-stock" ? "Sold Out" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
