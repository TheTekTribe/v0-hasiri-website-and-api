"use client"

// Simplified version of the toast hook
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    // In a real implementation, we would also handle removing toasts after a timeout
  }

  return { toast, toasts }
}

// Export a simplified version for direct import
export const toast = (props: ToastProps) => {
  console.log("Toast:", props)
  // In a real app, this would show a toast notification
}
