import type { Metadata } from "next"
import Link from "next/link"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { Shield, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Forgot Password | Hasiri - Reset Your Account",
  description: "Reset your Hasiri account password securely",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container relative flex-col items-center justify-center min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="/rolling-green-fields.png"
            alt="Forgot password background"
            className="object-cover w-full h-full opacity-50"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">Hasiri</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "We're here to help you get back into your account and continue your agricultural journey with Hasiri."
            </p>
            <footer className="text-sm">Customer Support Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div className="flex items-center justify-center space-x-8 px-8 text-center text-sm">
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Secure Reset</span>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="h-6 w-6 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Email Verification</span>
            </div>
          </div>

          <ForgotPasswordForm />

          <div className="px-8 text-center text-sm">
            <div className="mb-4">
              <p className="text-muted-foreground">Remember your password?</p>
              <Link href="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Need help? Contact our{" "}
              <Link href="/support" className="underline underline-offset-4 hover:text-primary">
                Customer Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
