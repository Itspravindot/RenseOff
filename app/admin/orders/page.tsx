import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdminOrderList } from "@/components/admin-order-list"

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminOrderList />
      <Footer />
    </div>
  )
}
