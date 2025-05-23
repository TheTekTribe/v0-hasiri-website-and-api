"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types for our roles and permissions
type Permission = {
  id: string
  name: string
  description: string
  resource: string
}

type Role = {
  id: string
  name: string
  description: string
  created_at: string
}

type RolePermission = {
  role_id: string
  permission_id: string
}

type UserRole = {
  user_id: string
  role_id: string
  user_email: string
  user_first_name?: string
  user_last_name?: string
}

// Admin sections for permissions
const adminSections = [
  { id: "dashboard", name: "Dashboard", description: "View admin dashboard" },
  { id: "products", name: "Products", description: "Manage products" },
  { id: "categories", name: "Categories", description: "Manage categories" },
  { id: "orders", name: "Orders", description: "Manage orders" },
  { id: "users", name: "Users", description: "Manage users" },
  { id: "content", name: "Content", description: "Manage content" },
  { id: "analytics", name: "Analytics", description: "View analytics" },
  { id: "appearance", name: "Appearance", description: "Manage appearance" },
  { id: "settings", name: "Settings", description: "Manage settings" },
  { id: "roles", name: "Roles", description: "Manage roles and permissions" },
  { id: "homepage", name: "Homepage", description: "Manage homepage content" },
]

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({})
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("roles")

  const supabase = createClientComponentClient()

  // Fetch roles, permissions, and role-permissions on component mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase.from("roles").select("*").order("name")

        if (rolesError) throw rolesError
        setRoles(rolesData || [])

        // Fetch permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from("permissions")
          .select("*")
          .order("resource, name")

        if (permissionsError) throw permissionsError
        setPermissions(permissionsData || [])

        // Fetch role permissions
        const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
          .from("role_permissions")
          .select("*")

        if (rolePermissionsError) throw rolePermissionsError
        setRolePermissions(rolePermissionsData || [])

        // Replace the profiles query to use first_name and last_name instead of name
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, role_id")

        if (profilesError) throw profilesError

        // Update how profiles are mapped to include the concatenated name
        const profiles =
          profilesData?.map((profile) => ({
            id: profile.id,
            name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
            email: profile.email,
            roleId: profile.role_id,
          })) || []

        setUsers(profiles)

        // Fetch user roles
        const { data: userRolesData, error: userRolesError } = await supabase
          .from("user_roles")
          .select("user_id, role_id, profiles!inner(email, first_name, last_name)")
          .order("role_id")

        if (userRolesError) throw userRolesError

        // Transform the data to match our UserRole type
        const transformedUserRoles =
          userRolesData?.map((item) => ({
            user_id: item.user_id,
            role_id: item.role_id,
            user_email: item.profiles.email,
            user_first_name: item.profiles.first_name,
            user_last_name: item.profiles.last_name,
          })) || []

        setUserRoles(transformedUserRoles)

        // If there are roles, select the first one by default
        if (rolesData && rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].id)
          updateSelectedPermissions(rolesData[0].id, rolePermissionsData || [])
          updateSelectedUsers(rolesData[0].id, transformedUserRoles)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load roles and permissions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  // Helper function to get full name
  const getFullName = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) return `${firstName} ${lastName}`
    if (firstName) return firstName
    if (lastName) return lastName
    return "N/A"
  }

  // Update selected permissions when role changes
  const updateSelectedPermissions = (roleId: string, rolePerms: RolePermission[]) => {
    const newSelectedPermissions: Record<string, boolean> = {}

    permissions.forEach((permission) => {
      newSelectedPermissions[permission.id] = rolePerms.some(
        (rp) => rp.role_id === roleId && rp.permission_id === permission.id,
      )
    })

    setSelectedPermissions(newSelectedPermissions)
  }

  // Update selected users when role changes
  const updateSelectedUsers = (roleId: string, userRoles: UserRole[]) => {
    const newSelectedUsers: Record<string, boolean> = {}

    users.forEach((user) => {
      newSelectedUsers[user.id] = userRoles.some((ur) => ur.role_id === roleId && ur.user_id === user.id)
    })

    setSelectedUsers(newSelectedUsers)
  }

  // Handle role selection
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId)
    updateSelectedPermissions(roleId, rolePermissions)
    updateSelectedUsers(roleId, userRoles)
  }

  // Handle permission toggle
  const handlePermissionToggle = async (permissionId: string) => {
    if (!selectedRoleId) return

    const newValue = !selectedPermissions[permissionId]
    setSelectedPermissions({ ...selectedPermissions, [permissionId]: newValue })

    try {
      if (newValue) {
        // Add permission to role
        const { error } = await supabase
          .from("role_permissions")
          .insert({ role_id: selectedRoleId, permission_id: permissionId })

        if (error) throw error
      } else {
        // Remove permission from role
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role_id", selectedRoleId)
          .eq("permission_id", permissionId)

        if (error) throw error
      }

      // Update local state
      if (newValue) {
        setRolePermissions([...rolePermissions, { role_id: selectedRoleId, permission_id: permissionId }])
      } else {
        setRolePermissions(
          rolePermissions.filter((rp) => !(rp.role_id === selectedRoleId && rp.permission_id === permissionId)),
        )
      }

      toast({
        title: "Success",
        description: `Permission ${newValue ? "added to" : "removed from"} role`,
      })
    } catch (error) {
      console.error("Error updating permission:", error)
      // Revert the UI change
      setSelectedPermissions({ ...selectedPermissions, [permissionId]: !newValue })
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      })
    }
  }

  // Handle user role toggle
  const handleUserRoleToggle = async (userId: string) => {
    if (!selectedRoleId) return

    const newValue = !selectedUsers[userId]
    setSelectedUsers({ ...selectedUsers, [userId]: newValue })

    try {
      if (newValue) {
        // Add user to role
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role_id: selectedRoleId })

        if (error) throw error

        // Find user details
        const user = users.find((u) => u.id === userId)
        if (user) {
          setUserRoles([
            ...userRoles,
            {
              user_id: userId,
              role_id: selectedRoleId,
              user_email: user.email,
              user_first_name: user.first_name,
              user_last_name: user.last_name,
            },
          ])
        }
      } else {
        // Remove user from role
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role_id", selectedRoleId)

        if (error) throw error

        // Update local state
        setUserRoles(userRoles.filter((ur) => !(ur.user_id === userId && ur.role_id === selectedRoleId)))
      }

      toast({
        title: "Success",
        description: `User ${newValue ? "added to" : "removed from"} role`,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      // Revert the UI change
      setSelectedUsers({ ...selectedUsers, [userId]: !newValue })
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  // Handle adding a new role
  const handleAddRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("roles")
        .insert({ name: newRole.name, description: newRole.description })
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setRoles([...roles, data[0]])
        setNewRole({ name: "", description: "" })
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Role added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding role:", error)
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      })
    }
  }

  // Handle editing a role
  const handleEditRole = async () => {
    if (!editingRole || !editingRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("roles")
        .update({ name: editingRole.name, description: editingRole.description })
        .eq("id", editingRole.id)

      if (error) throw error

      // Update local state
      setRoles(roles.map((role) => (role.id === editingRole.id ? editingRole : role)))

      setEditingRole(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Role updated successfully",
      })
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a role
  const handleDeleteRole = async (roleId: string) => {
    try {
      // Delete role permissions first (due to foreign key constraints)
      const { error: permError } = await supabase.from("role_permissions").delete().eq("role_id", roleId)

      if (permError) throw permError

      // Delete user roles
      const { error: userRoleError } = await supabase.from("user_roles").delete().eq("role_id", roleId)

      if (userRoleError) throw userRoleError

      // Delete the role
      const { error } = await supabase.from("roles").delete().eq("id", roleId)

      if (error) throw error

      // Update local state
      setRoles(roles.filter((role) => role.id !== roleId))
      setRolePermissions(rolePermissions.filter((rp) => rp.role_id !== roleId))
      setUserRoles(userRoles.filter((ur) => ur.role_id !== roleId))

      // If the deleted role was selected, select another role
      if (selectedRoleId === roleId) {
        const newSelectedRole = roles.find((role) => role.id !== roleId)
        if (newSelectedRole) {
          setSelectedRoleId(newSelectedRole.id)
          updateSelectedPermissions(newSelectedRole.id, rolePermissions)
          updateSelectedUsers(newSelectedRole.id, userRoles)
        } else {
          setSelectedRoleId(null)
        }
      }

      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  // Group permissions by resource
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  // Create default permissions for admin sections if they don't exist
  const createDefaultPermissions = async () => {
    const permissionsToCreate = []

    for (const section of adminSections) {
      // Check if view permission exists
      if (!permissions.some((p) => p.resource === section.id && p.name === `view_${section.id}`)) {
        permissionsToCreate.push({
          name: `view_${section.id}`,
          description: `View ${section.name}`,
          resource: section.id,
        })
      }

      // Check if manage permission exists
      if (!permissions.some((p) => p.resource === section.id && p.name === `manage_${section.id}`)) {
        permissionsToCreate.push({
          name: `manage_${section.id}`,
          description: `Manage ${section.name}`,
          resource: section.id,
        })
      }
    }

    if (permissionsToCreate.length > 0) {
      try {
        const { data, error } = await supabase.from("permissions").insert(permissionsToCreate).select()

        if (error) throw error

        if (data) {
          setPermissions([...permissions, ...data])
          toast({
            title: "Success",
            description: "Default permissions created",
          })
        }
      } catch (error) {
        console.error("Error creating default permissions:", error)
        toast({
          title: "Error",
          description: "Failed to create default permissions",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Info",
        description: "All default permissions already exist",
      })
    }
  }

  // Create default roles if they don't exist
  const createDefaultRoles = async () => {
    const rolesToCreate = []

    if (!roles.some((r) => r.name === "Admin")) {
      rolesToCreate.push({
        name: "Admin",
        description: "Full access to all sections",
      })
    }

    if (!roles.some((r) => r.name === "Order Fulfillment")) {
      rolesToCreate.push({
        name: "Order Fulfillment",
        description: "Access to order management only",
      })
    }

    if (rolesToCreate.length > 0) {
      try {
        const { data, error } = await supabase.from("roles").insert(rolesToCreate).select()

        if (error) throw error

        if (data) {
          setRoles([...roles, ...data])
          toast({
            title: "Success",
            description: "Default roles created",
          })

          // Set up permissions for the default roles
          const adminRole = data.find((r) => r.name === "Admin")
          const orderRole = data.find((r) => r.name === "Order Fulfillment")

          if (adminRole) {
            // Give admin all permissions
            const adminPermissions = permissions.map((p) => ({
              role_id: adminRole.id,
              permission_id: p.id,
            }))

            if (adminPermissions.length > 0) {
              const { error: permError } = await supabase.from("role_permissions").insert(adminPermissions)

              if (permError) throw permError

              setRolePermissions([...rolePermissions, ...adminPermissions])
            }
          }

          if (orderRole) {
            // Give order fulfillment role access to orders only
            const orderPermissions = permissions
              .filter((p) => p.resource === "orders")
              .map((p) => ({
                role_id: orderRole.id,
                permission_id: p.id,
              }))

            if (orderPermissions.length > 0) {
              const { error: permError } = await supabase.from("role_permissions").insert(orderPermissions)

              if (permError) throw permError

              setRolePermissions([...rolePermissions, ...orderPermissions])
            }
          }
        }
      } catch (error) {
        console.error("Error creating default roles:", error)
        toast({
          title: "Error",
          description: "Failed to create default roles",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Info",
        description: "All default roles already exist",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Manage roles and permissions for users</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={createDefaultPermissions}>
              Create Default Permissions
            </Button>
            <Button variant="outline" onClick={createDefaultRoles}>
              Create Default Roles
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>Create a new role with specific permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter role name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Enter role description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole}>Add Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No roles found. Create a role to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role) => (
                        <TableRow key={role.id} className={selectedRoleId === role.id ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto font-medium"
                              onClick={() => handleRoleSelect(role.id)}
                            >
                              {role.name}
                            </Button>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingRole(role)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the role "{role.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="permissions">
              {selectedRoleId ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Permissions for {roles.find((r) => r.id === selectedRoleId)?.name}
                    </h3>
                  </div>

                  {Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <Card key={resource}>
                      <CardHeader>
                        <CardTitle className="capitalize">{resource}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {perms.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={selectedPermissions[permission.id] || false}
                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                              />
                              <Label htmlFor={permission.id} className="flex-1">
                                <div>{permission.description}</div>
                                <div className="text-xs text-muted-foreground">{permission.name}</div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>Select a role to manage its permissions</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              {selectedRoleId ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Users with role: {roles.find((r) => r.id === selectedRoleId)?.name}
                    </h3>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assigned</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No users found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedUsers[user.id] || false}
                                  onCheckedChange={() => handleUserRoleToggle(user.id)}
                                />
                              </TableCell>
                              <TableCell>{getFullName(user.first_name, user.last_name)}</TableCell>
                              <TableCell>{user.email}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>Select a role to manage its users</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter role name"
                value={editingRole?.name || ""}
                onChange={(e) => setEditingRole(editingRole ? { ...editingRole, name: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Enter role description"
                value={editingRole?.description || ""}
                onChange={(e) => setEditingRole(editingRole ? { ...editingRole, description: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
