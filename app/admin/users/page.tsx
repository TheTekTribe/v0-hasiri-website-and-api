import { UserManager } from "@/components/admin/user-manager"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      <UserManager />
    </div>
  )
}
