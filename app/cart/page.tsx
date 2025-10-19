import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CartContent />
      <Footer />
    </div>
  )
}
