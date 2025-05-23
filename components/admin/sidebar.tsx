"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  BarChart3,
  Package,
  LogOut,
  Palette,
  Home,
  Shield,
  MessageSquareQuote,
  Paintbrush,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Update the sidebarLinks array to include our new Branding section
const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Homepage",
    href: "/admin/homepage",
    icon: Home,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FileText,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    title: "Branding",
    href: "/admin/branding",
    icon: Paintbrush,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Roles",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    title: "Appearance",
    href: "/admin/appearance",
    icon: Palette,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Hasiri</span>
            <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
