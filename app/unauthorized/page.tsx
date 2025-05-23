import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-red-100 p-6">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
