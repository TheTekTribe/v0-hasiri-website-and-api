"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface CartItem {
  id: number
  name: string // Ensure name is included and required
  price: string
  priceValue: number
  image: string
  quantity: number
  category: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  clearCartSilently: () => void // New silent method
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  totalItems: number
  subtotal: number
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  clearCartSilently: () => {}, // New silent method
  isCartOpen: false,
  setIsCartOpen: () => {},
  totalItems: 0,
  subtotal: 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()

  // Calculate total items and subtotal
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.priceValue * item.quantity, 0)

  // Add this after the totalItems calculation
  useEffect(() => {
    console.log("Total items updated:", totalItems)
  }, [totalItems])

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hasiriCart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("hasiriCart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    console.log("Adding item to cart:", newItem)

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1

        console.log("Updated cart items:", updatedItems)

        toast({
          title: "Item quantity updated",
          description: `${newItem.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        })

        return updatedItems
      } else {
        // Item doesn't exist, add new item
        const newItems = [...prevItems, { ...newItem, quantity: 1 }]

        console.log("New cart items:", newItems)

        toast({
          title: "Item added to cart",
          description: `${newItem.name} has been added to your cart`,
        })

        return newItems
      }
    })

    // Open cart when adding items
    setIsCartOpen(true)
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart`,
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  // New method to clear cart without showing a toast notification
  const clearCartSilently = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearCartSilently,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
