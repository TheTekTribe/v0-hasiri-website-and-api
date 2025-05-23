"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Cart } from "@/components/cart"
import { HasiriIcon } from "@/components/hasiri-icon"
import UserMenu from "@/components/auth/user-menu"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoading } = useAuth()
  const { totalItems, isCartOpen, setIsCartOpen } = useCart()

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <HasiriIcon className="h-8 w-8" showLink={false} />
            <span className="hidden font-bold sm:inline-block">HASIRI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Cart button and sheet */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E7D32] text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Open cart ({totalItems} items)</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <Cart />
            </SheetContent>
          </Sheet>

          {/* Authentication */}
          {!isLoading && <UserMenu />}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                id="mobile-menu-button"
                variant="ghost"
                size="icon"
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                onClick={toggleMenu}
                className="md:hidden hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                type="button"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <div className="flex items-center gap-2 pb-4">
                <HasiriIcon className="h-6 w-6" showLink={false} />
                <span className="font-bold">HASIRI</span>
              </div>
              <Separator />
              <ScrollArea className="my-4 h-[calc(100vh-8rem)]">
                <div className="flex flex-col space-y-3 p-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                        pathname === item.href ? "bg-accent" : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/login"
                  className="flex items-center justify-center py-3 px-4 bg-primary text-white rounded-md font-medium transition-all hover:bg-primary/90 active:bg-primary/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
