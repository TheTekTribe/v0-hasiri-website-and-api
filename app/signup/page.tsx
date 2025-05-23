import type { Metadata } from "next"
import Link from "next/link"
import SignupForm from "@/components/auth/signup-form"
import { Shield, Users, CheckCircle } from "lucide-react"
import { SignupCarousel } from "@/components/auth/signup-carousel"
import { HasiriIcon } from "@/components/hasiri-icon"

export const metadata: Metadata = {
  title: "Sign Up | Hasiri - Join Our Agricultural Community",
  description: "Create a new Hasiri account and join thousands of farmers improving their yields with our solutions",
}

export default function SignupPage() {
  return (
    <div className="flex flex-col w-full h-screen max-h-screen overflow-hidden">
      <div className="flex flex-grow w-full h-full overflow-y-auto">
        <div className="grid w-full h-auto min-h-full lg:grid-cols-2">
          <div className="relative hidden h-full lg:block">
            <SignupCarousel />
          </div>
          <div className="flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md space-y-6 py-8">
              <div className="flex flex-col items-center space-y-2 text-center">
                <HasiriIcon className="h-12 w-12 mb-2" />
                <p className="text-sm text-muted-foreground">Enter your details to create your Hasiri account</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs text-center font-medium">Secure & Private</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs text-center font-medium">Join 10,000+ Farmers</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary mb-1" />
                  <span className="text-xs text-center font-medium">Verified Products</span>
                </div>
              </div>

              <SignupForm />

              <div className="text-center text-sm">
                <p className="text-xs text-muted-foreground mt-6">
                  By creating an account, you agree to our{" "}
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
