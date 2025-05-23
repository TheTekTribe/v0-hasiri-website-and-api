import { RoleManager } from "@/components/admin/role-manager"

export const metadata = {
  title: "Role Management | Hasiri Admin",
  description: "Manage user roles and permissions",
}

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and control access to different sections of the admin panel.
        </p>
      </div>
      <RoleManager />
    </div>
  )
}
