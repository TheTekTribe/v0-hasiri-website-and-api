"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HasiriIcon } from "@/components/hasiri-icon"
import { usePathname } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  routes: { name: string; path: string }[]
}

export function MobileMenu({ isOpen, onClose, routes }: MobileMenuProps) {
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" onClick={onClose}>
            <HasiriIcon className="h-8 w-8" showLink={false} />
            <span className="text-primary">Hasiri</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`block py-3 px-4 rounded-md text-lg ${
                    pathname === route.path ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Link
            href="/login"
            className="block w-full py-3 text-center bg-primary text-white rounded-md font-medium"
            onClick={onClose}
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
