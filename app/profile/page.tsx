import type { Metadata } from "next"
import UserProfile from "@/components/auth/user-profile"
import ProtectedRoute from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Profile | Hasiri",
  description: "Manage your Hasiri account profile",
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container max-w-4xl py-10">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
        <UserProfile />
      </div>
    </ProtectedRoute>
  )
}
