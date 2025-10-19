import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { OrderDetails } from "@/components/order-details"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <OrderDetails orderId={params.id} />
      <Footer />
    </div>
  )
}
