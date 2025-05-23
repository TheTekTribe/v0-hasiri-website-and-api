"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Settings, UserCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // If not authenticated, show login button
  if (!user) {
    return (
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className="font-medium border-primary text-primary hover:bg-primary/10 hover:text-primary"
        >
          Login
        </Button>
      </Link>
    )
  }

  // If authenticated, show user menu
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="User menu">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/account/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
