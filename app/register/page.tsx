import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegisterForm />
      <Footer />
    </div>
  )
}
