import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { OrderTracker } from "@/components/order-tracker"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <OrderTracker />
      <Footer />
    </div>
  )
}
