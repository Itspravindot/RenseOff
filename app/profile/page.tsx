import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProfileClient } from "@/components/profile-client"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ProfileClient />
      <Footer />
    </div>
  )
}