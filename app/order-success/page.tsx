import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-lg mb-2">Order Details</h2>
                  <p className="text-muted-foreground">Order Number: #{orderNumber}</p>
                  <p className="text-muted-foreground">Confirmation email sent to your registered email address</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Link href="/products">
              <Button size="lg" className="w-full md:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <div>
              <Link href="/orders" className="text-primary hover:text-primary/80">
                Track your order
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
