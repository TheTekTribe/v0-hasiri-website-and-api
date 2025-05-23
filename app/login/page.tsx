import type { Metadata } from "next"
import Link from "next/link"
import LoginForm from "@/components/auth/login-form"
import { Shield, Lock, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginCarousel } from "@/components/auth/login-carousel"
import { HasiriIcon } from "@/components/hasiri-icon"

export const metadata: Metadata = {
  title: "Login | Hasiri - Secure Access to Your Agricultural Solutions",
  description: "Securely access your Hasiri account to manage your agricultural products and services",
}

export default function LoginPage({ searchParams }: { searchParams: { registered?: string; reset?: string } }) {
  const showRegisteredMessage = searchParams.registered === "true"
  const showResetMessage = searchParams.reset === "true"

  return (
    <div className="flex flex-col w-full h-screen max-h-screen overflow-hidden">
      <div className="flex flex-grow w-full h-full overflow-y-auto">
        <div className="grid w-full h-auto min-h-full lg:grid-cols-2">
          <div className="relative hidden h-full lg:block">
            <LoginCarousel />
          </div>
          <div className="flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md space-y-6 py-8">
              <div className="flex flex-col items-center space-y-2 text-center">
                <HasiriIcon className="h-12 w-12 mb-2" />
                <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
              </div>

              {showRegisteredMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Account created successfully! Please log in with your credentials.
                  </AlertDescription>
                </Alert>
              )}

              {showResetMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Password reset successfully! Please log in with your new password.
                  </AlertDescription>
                </Alert>
              )}

              <LoginForm />

              <div className="flex items-center justify-center space-x-8 px-8 text-center text-sm">
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Secure Login</span>
                </div>
                <div className="flex flex-col items-center">
                  <Lock className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Encrypted Data</span>
                </div>
              </div>

              <div className="px-8 text-center text-sm">
                <p className="text-xs text-muted-foreground mt-6">
                  By logging in, you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
