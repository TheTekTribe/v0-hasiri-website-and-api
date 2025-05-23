import { BrandingManager } from "@/components/admin/branding-manager"

export default function BrandingPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
      <BrandingManager />
    </div>
  )
}
