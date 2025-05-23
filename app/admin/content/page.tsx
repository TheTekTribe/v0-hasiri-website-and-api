import { ContentManager } from "@/components/admin/content-manager"

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
      <ContentManager />
    </div>
  )
}
