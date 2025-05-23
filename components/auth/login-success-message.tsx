"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function LoginSuccessMessage() {
  const searchParams = useSearchParams()

  const registered = searchParams.get("registered")
  const reset = searchParams.get("reset")

  if (!registered && !reset) return null

  return (
    <Alert className="border-green-500 bg-green-50">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-green-700">
        {registered && "Registration successful! Please log in with your new account."}
        {reset && "Password reset successful! Please log in with your new password."}
      </AlertDescription>
    </Alert>
  )
}
