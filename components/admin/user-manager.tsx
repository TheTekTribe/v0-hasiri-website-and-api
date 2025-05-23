"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, Save, Search, Phone, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "customer",
    status: "active",
    location: "Punjab",
    phone: "+91 98765 43210",
    orders: 12,
    lastOrder: "2023-06-15",
    avatar: "RK",
  },
  {
    id: 2,
    name: "Anita Patel",
    email: "anita@example.com",
    role: "customer",
    status: "active",
    location: "Gujarat",
    phone: "+91 87654 32109",
    orders: 8,
    lastOrder: "2023-07-22",
    avatar: "AP",
  },
  {
    id: 3,
    name: "Suresh Reddy",
    email: "suresh@example.com",
    role: "customer",
    status: "inactive",
    location: "Andhra Pradesh",
    phone: "+91 76543 21098",
    orders: 5,
    lastOrder: "2023-05-10",
    avatar: "SR",
  },
  {
    id: 4,
    name: "Admin User",
    email: "admin@hasiri.com",
    role: "admin",
    status: "active",
    location: "Karnataka",
    phone: "+91 65432 10987",
    orders: 0,
    lastOrder: "",
    avatar: "AU",
  },
  {
    id: 5,
    name: "Support Staff",
    email: "support@hasiri.com",
    role: "staff",
    status: "active",
    location: "Karnataka",
    phone: "+91 54321 09876",
    orders: 0,
    lastOrder: "",
    avatar: "SS",
  },
]

export function UserManager() {
  const [users, setUsers] = useState(mockUsers)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Function to handle editing a user
  const handleEditUser = (user: any) => {
    setCurrentUser(user)
    setIsEditing(true)
  }

  // Function to handle creating a new user
  const handleNewUser = () => {
    setCurrentUser({
      id: Date.now(),
      name: "",
      email: "",
      role: "customer",
      status: "active",
      location: "",
      phone: "",
      orders: 0,
      lastOrder: "",
      avatar: "",
    })
    setIsEditing(true)
  }

  // Function to save a user
  const saveUser = () => {
    if (currentUser) {
      // Generate avatar if not present
      if (!currentUser.avatar && currentUser.name) {
        const nameParts = currentUser.name.split(" ")
        currentUser.avatar =
          nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : `${nameParts[0][0]}${nameParts[0][1] || ""}`
      }

      const userIndex = users.findIndex((user) => user.id === currentUser.id)
      if (userIndex >= 0) {
        // Update existing user
        const updatedUsers = [...users]
        updatedUsers[userIndex] = currentUser
        setUsers(updatedUsers)
      } else {
        // Add new user
        setUsers([...users, currentUser])
      }
      setIsEditing(false)
      setCurrentUser(null)
    }
  }

  // Function to delete a user
  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button onClick={handleNewUser} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search users..."
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder-icon.png?height=32&width=32&text=${user.avatar}`} />
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "staff"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.orders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)}>
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

      {/* User Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentUser?.id ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>Make changes to user information here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-status">Status</Label>
                  <Select
                    value={currentUser.status}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, status: value })}
                  >
                    <SelectTrigger id="user-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-phone">Phone</Label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="user-phone"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-location">Location</Label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="user-location"
                    value={currentUser.location}
                    onChange={(e) => setCurrentUser({ ...currentUser, location: e.target.value })}
                    placeholder="Location"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Save className="h-4 w-4 mr-2" />
              Save User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
