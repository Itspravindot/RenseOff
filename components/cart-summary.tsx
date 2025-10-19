"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CartSummary() {
  const { total, items } = useCart()

  const shipping = total > 50 ? 0 : 5.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        {shipping === 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">Free shipping on orders over $50!</div>
        )}

        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>

        <Link href="/checkout" className="w-full">
          <Button size="lg" className="w-full">
            Proceed to Checkout
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>

        <div className="text-xs text-muted-foreground text-center">Secure checkout • SSL encrypted</div>
      </CardContent>
    </Card>
  )
}
