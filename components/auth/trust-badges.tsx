import { Shield, Lock, Users, CheckCircle } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
        <Shield className="h-4 w-4 text-primary mr-2" />
        <span className="text-xs font-medium">Secure & Encrypted</span>
      </div>
      <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
        <Lock className="h-4 w-4 text-primary mr-2" />
        <span className="text-xs font-medium">Privacy Protected</span>
      </div>
      <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
        <Users className="h-4 w-4 text-primary mr-2" />
        <span className="text-xs font-medium">10,000+ Farmers Trust Us</span>
      </div>
      <div className="flex items-center bg-muted/50 px-3 py-2 rounded-lg">
        <CheckCircle className="h-4 w-4 text-primary mr-2" />
        <span className="text-xs font-medium">Verified Products</span>
      </div>
    </div>
  )
}
